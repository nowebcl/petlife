import { FLOW_CONFIG, signParams, syncPaidOrderWithPocketBase } from './flow.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
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

    // Si req.body aún no fue procesado por el parser
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
        // Ignorar
      }
    }

    // 2. Si no viene en body, buscar en query params
    const url = new URL(req.url, 'http://localhost');
    if (!token) {
      token = url.searchParams.get('token') || (req.query && req.query.token) || '';
    }

    if (!token) {
      console.warn('Flow-confirm invocado sin token');
      return res.status(200).send('OK (Sin token)');
    }

    // 3. Consultar a Flow el estado oficial de la transacción
    const params = {
      apiKey: FLOW_CONFIG.apiKey,
      token,
    };
    params.s = signParams(params, FLOW_CONFIG.secretKey);

    const statusUrl = `${FLOW_CONFIG.statusEndpoint}?${new URLSearchParams(params).toString()}`;
    const statusRes = await fetch(statusUrl);
    const statusData = await statusRes.json();

    console.log('Flow-confirm recibido para orden:', statusData.commerceOrder, 'Status:', statusData.status);

    // 4. Si la orden fue pagada con éxito (status === 2), sincronizar con PocketBase
    if (statusData.status === 2) {
      await syncPaidOrderWithPocketBase(statusData);
    }

    // Flow exige respuesta 200 OK para confirmar la notificación
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Error en flow-confirm webhook:', err);
    // Responder 200 para evitar reintentos infinitos de Flow si ya se procesó
    return res.status(200).send('Error procesado');
  }
}
