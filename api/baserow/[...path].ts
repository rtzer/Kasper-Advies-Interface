import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASEROW_API_URL = process.env.BASEROW_API_URL;
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Validate server-side environment variables
  if (!BASEROW_API_URL || !BASEROW_TOKEN) {
    console.error('Missing BASEROW_API_URL or BASEROW_TOKEN environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Get the path from the catch-all route
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';

  // Build the full Baserow URL
  const baserowUrl = `${BASEROW_API_URL}/api/database/${pathString}`;

  // Forward query parameters (except 'path' which is our routing param)
  const url = new URL(baserowUrl);
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'path' && value) {
      url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
    }
  });

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Authorization': `Token ${BASEROW_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    // Handle empty responses (like DELETE)
    if (response.status === 204) {
      return res.status(204).end();
    }

    const data = await response.json();

    // Forward the response status and data
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Baserow proxy error:', error);
    return res.status(500).json({ error: 'Failed to proxy request to Baserow' });
  }
}
