const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Request failed.');
  }

  return payload as T;
}

export const api = {
  chat: (body: Record<string, unknown>) => request<{ message: string; conversationId?: string; provider?: string; resources?: Array<{ title: string; url: string; snippet?: string; source?: string }> }>('/api/agent/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  search: (body: Record<string, unknown>) => request<{ results: Array<{ title: string; url: string; snippet?: string; source?: string }> }>('/api/search', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  buildProject: (body: Record<string, unknown>) => request<{ status: string; summary: string; filesChanged: string[] }>('/api/coding/build', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
};
