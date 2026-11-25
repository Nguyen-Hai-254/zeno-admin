const backendUrl = process.env.ZENO_API_URL ?? 'http://localhost:4000/api';

async function forward(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  const suffix = path.length ? `/${path.map(encodeURIComponent).join('/')}` : '';
  const url = new URL(`${backendUrl.replace(/\/$/, '')}/attributes${suffix}`);
  url.search = new URL(request.url).search;

  const headers = new Headers();
  for (const name of ['content-type', 'authorization', 'cookie']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: request.method === 'GET' ? undefined : await request.text(),
      cache: 'no-store'
    });
    return new Response(response.body, {
      status: response.status,
      headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' }
    });
  } catch {
    return Response.json({ message: 'Không thể kết nối API thuộc tính.' }, { status: 502 });
  }
}

export { forward as GET, forward as POST, forward as PUT };
