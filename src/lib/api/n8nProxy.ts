/**
 * N8N Webhook Proxy Client
 *
 * Routes all n8n webhook calls through the Vercel API proxy.
 * Secrets (URLs, credentials) are kept server-side, never exposed to the browser.
 */

export type WebhookType =
  | 'auth'
  | 'create-client'
  | 'update-client'
  | 'client-action'
  | 'create-prospect'
  | 'update-prospect'
  | 'prospect-lost'
  | 'create-project'
  | 'update-project-status';

interface ProxyResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Send a request to an n8n webhook via the secure proxy
 *
 * @param webhookType - The type of webhook to call
 * @param payload - The data to send to the webhook
 * @returns The response from the webhook
 */
export async function callN8nWebhook<T = unknown>(
  webhookType: WebhookType,
  payload: Record<string, unknown>
): Promise<ProxyResponse<T>> {
  try {
    const response = await fetch('/api/n8n/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookType,
        ...payload,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error('N8N proxy error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Authentication via n8n webhook
 */
export async function authenticateUser(email: string, password: string) {
  return callN8nWebhook<{
    success: boolean;
    userId?: string;
    email?: string;
    name?: string;
    role?: string;
    error?: string;
  }>('auth', { email, password });
}

/**
 * Create a new client via n8n webhook
 */
export async function createClient(payload: Record<string, unknown>) {
  return callN8nWebhook('create-client', payload);
}

/**
 * Update an existing client via n8n webhook
 */
export async function updateClient(payload: Record<string, unknown>) {
  return callN8nWebhook('update-client', payload);
}

/**
 * Perform a client action (focus, archive, delete) via n8n webhook
 */
export async function clientAction(
  action: 'focus' | 'archive' | 'delete',
  clientId: number,
  value: boolean
) {
  return callN8nWebhook('client-action', { action, client_id: clientId, value });
}

/**
 * Create a new prospect via n8n webhook
 */
export async function createProspect(payload: Record<string, unknown>) {
  return callN8nWebhook('create-prospect', payload);
}

/**
 * Update an existing prospect via n8n webhook
 */
export async function updateProspect(payload: Record<string, unknown>) {
  return callN8nWebhook('update-prospect', payload);
}

/**
 * Mark a prospect as lost via n8n webhook
 */
export async function markProspectAsLost(prospectId: string, lostReason: string) {
  return callN8nWebhook('prospect-lost', { prospect_id: prospectId, lost_reason: lostReason });
}

/**
 * Create a new project via n8n webhook
 */
export async function createProjectWebhook(payload: Record<string, unknown>) {
  return callN8nWebhook<{ success: boolean }>('create-project', payload);
}

/**
 * Update project status via n8n webhook
 */
export async function updateProjectStatusWebhook(projectId: string, status: string) {
  return callN8nWebhook<{ success: boolean }>('update-project-status', {
    project_id: projectId,
    status: status,
  });
}
