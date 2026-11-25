const BASE_URL = '/api';

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body && typeof body === 'object' && 'message' in body ? body.message : null;
    throw new Error(
      Array.isArray(message)
        ? message.join(', ')
        : typeof message === 'string'
          ? message
          : `API error: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}
