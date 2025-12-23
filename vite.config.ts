import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy /api/baserow/* to Baserow API in development
        '/api/baserow': {
          target: env.BASEROW_API_URL || 'https://baserow.kaspersadvies.nl',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/baserow/, '/api/database'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Add Baserow token to all requests
              if (env.BASEROW_TOKEN) {
                proxyReq.setHeader('Authorization', `Token ${env.BASEROW_TOKEN}`);
              }
            });
          },
        },
        // Proxy /api/n8n/webhook to handle n8n webhooks in development
        '/api/n8n/webhook': {
          target: 'http://localhost:8080', // Will be handled by custom middleware
          changeOrigin: true,
          configure: (proxy, options) => {
            // Custom handler for n8n webhooks
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // This will be intercepted by the middleware below
            });
          },
        },
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      // Custom plugin to handle /api/n8n/webhook in development
      {
        name: 'n8n-webhook-proxy',
        configureServer(server) {
          server.middlewares.use('/api/n8n/webhook', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            // Parse request body
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { webhookType, ...payload } = JSON.parse(body);

                // Webhook URL mapping
                const webhookUrls: Record<string, string | undefined> = {
                  'auth': env.N8N_AUTH_WEBHOOK_URL,
                  'create-client': env.N8N_CREATE_CLIENT_WEBHOOK_URL,
                  'update-client': env.N8N_UPDATE_CLIENT_WEBHOOK_URL,
                  'client-action': env.N8N_CLIENT_ACTION_WEBHOOK_URL,
                  'create-prospect': env.N8N_CREATE_PROSPECT_WEBHOOK_URL,
                  'update-prospect': env.N8N_UPDATE_PROSPECT_WEBHOOK_URL,
                  'prospect-lost': env.N8N_PROSPECT_LOST_WEBHOOK_URL,
                  'create-project': env.N8N_CREATE_PROJECT_WEBHOOK_URL,
                  'update-project-status': env.N8N_UPDATE_PROJECT_STATUS_WEBHOOK_URL,
                  'create-assignment': env.N8N_CREATE_ASSIGNMENT_WEBHOOK_URL,
                  'create-task': env.N8N_CREATE_TASK_WEBHOOK_URL,
                  'create-subtask': env.N8N_CREATE_SUBTASK_WEBHOOK_URL,
                  'toggle-subtask': env.N8N_TOGGLE_SUBTASK_WEBHOOK_URL,
                };

                const webhookUrl = webhookUrls[webhookType];
                if (!webhookUrl) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: `Unknown webhook type: ${webhookType}` }));
                  return;
                }

                // Create Basic Auth header
                const credentials = Buffer.from(`${env.N8N_AUTH_USERNAME}:${env.N8N_AUTH_PASSWORD}`).toString('base64');

                // Forward to n8n
                const response = await fetch(webhookUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`,
                  },
                  body: JSON.stringify(payload),
                });

                const data = await response.text();
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
              } catch (error) {
                console.error('N8N webhook proxy error:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to proxy request' }));
              }
            });
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
