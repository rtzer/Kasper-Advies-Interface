import type { VercelRequest, VercelResponse } from '@vercel/node';

// Server-side environment variables (not exposed to client)
const N8N_AUTH_USERNAME = process.env.N8N_AUTH_USERNAME;
const N8N_AUTH_PASSWORD = process.env.N8N_AUTH_PASSWORD;

// Webhook URLs mapping
const WEBHOOK_URLS: Record<string, string | undefined> = {
  auth: process.env.N8N_AUTH_WEBHOOK_URL,
  'create-client': process.env.N8N_CREATE_CLIENT_WEBHOOK_URL,
  'update-client': process.env.N8N_UPDATE_CLIENT_WEBHOOK_URL,
  'client-action': process.env.N8N_CLIENT_ACTION_WEBHOOK_URL,
  'create-prospect': process.env.N8N_CREATE_PROSPECT_WEBHOOK_URL,
  'update-prospect': process.env.N8N_UPDATE_PROSPECT_WEBHOOK_URL,
  'prospect-lost': process.env.N8N_PROSPECT_LOST_WEBHOOK_URL,
  'create-project': process.env.N8N_CREATE_PROJECT_WEBHOOK_URL,
  'update-project-status': process.env.N8N_UPDATE_PROJECT_STATUS_WEBHOOK_URL,
  'create-assignment': process.env.N8N_CREATE_ASSIGNMENT_WEBHOOK_URL,
  'create-task': process.env.N8N_CREATE_TASK_WEBHOOK_URL,
  'create-subtask': process.env.N8N_CREATE_SUBTASK_WEBHOOK_URL,
  'toggle-subtask': process.env.N8N_TOGGLE_SUBTASK_WEBHOOK_URL,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate server-side environment variables
  if (!N8N_AUTH_USERNAME || !N8N_AUTH_PASSWORD) {
    console.error('Missing N8N_AUTH_USERNAME or N8N_AUTH_PASSWORD environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Get the webhook type from the request body
  const { webhookType, ...payload } = req.body;

  if (!webhookType || typeof webhookType !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid webhookType in request body' });
  }

  // Get the corresponding webhook URL
  const webhookUrl = WEBHOOK_URLS[webhookType];

  if (!webhookUrl) {
    return res.status(400).json({ error: `Unknown webhook type: ${webhookType}` });
  }

  try {
    // Create Basic Auth header
    const credentials = Buffer.from(`${N8N_AUTH_USERNAME}:${N8N_AUTH_PASSWORD}`).toString('base64');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
    });

    // Try to parse JSON response, but handle non-JSON responses too
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Forward the response status and data
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('N8N webhook proxy error:', error);
    return res.status(500).json({ error: 'Failed to proxy request to n8n webhook' });
  }
}
