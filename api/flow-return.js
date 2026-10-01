export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let token = '';

  // 1. Obtener token del body (POST de Flow)
  if (req.body) {
    if (typeof req.body === 'object') {
      token = req.body.token || '';
    } else if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        token = parsed.token || '';
      } catch {
        const params = new URLSearchParams(req.body);
        token = params.get('token') || '';
      }
    }
  }

  // Si req.body aún no fue procesado por el parser de Vercel/Node
  if (!token && req.method === 'POST') {
    try {
      const rawBody = await new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', () => resolve(''));
      });
      if (rawBody) {
        try {
          token = JSON.parse(rawBody).token || '';
        } catch {
          token = new URLSearchParams(rawBody).get('token') || '';
        }
      }
    } catch {
      // Ignorar error de lectura
    }
  }

  // 2. Obtener parámetros de la query URL
  const url = new URL(req.url, 'http://localhost');
  if (!token) {
    token = url.searchParams.get('token') || (req.query && req.query.token) || '';
  }
  const order = url.searchParams.get('order') || (req.query && req.query.order) || '';

  // 3. Redirección HTTP 302 hacia el frontend React en /checkout con método GET
  // Esto evita el error HTTP 405 de páginas estáticas al recibir un POST de Flow
  const targetUrl = `/checkout?status=flow_return&order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`;

  res.writeHead(302, {
    Location: targetUrl,
  });
  res.end();
}
