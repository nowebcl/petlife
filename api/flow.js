import crypto from 'node:crypto';
import https from 'node:https';

const FLOW_CONFIG = {
  apiKey: '56EC0FE0-1DAB-487B-93BE-22LC27EC1B24',
  secretKey: '4d36d14f697419812207fc8fc13fe87bc698b431',
  endpoint: 'https://www.flow.cl/api/payment/create',
};

function signParams(params, secretKey) {
  const sortedKeys = Object.keys(params).sort();
  let toSign = '';
  for (const k of sortedKeys) {
    if (params[k] !== undefined && params[k] !== null && k !== 's') {
      toSign += `${k}${params[k]}`;
    }
  }
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

export default async function handler(req, res) {
  // Configuración de cabeceras CORS universales
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método no permitido' });
    return;
  }

  try {
    let data = req.body;
    if (!data && typeof req.on === 'function') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        data = JSON.parse(raw);
      } catch {
        data = Object.fromEntries(new URLSearchParams(raw));
      }
    } else if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        data = Object.fromEntries(new URLSearchParams(data));
      }
    }

    data = data || {};

    const commerceOrder = data.commerceOrder || `PL-${Date.now().toString().slice(-6)}`;
    const amount = Math.round(Number(data.amount) || 0);
    const email = (data.email || 'contacto@tiendapetlife.cl').trim();
    const subject = (data.subject || `Compra PetLife ${commerceOrder}`).trim();
    const urlConfirmation =
      data.urlConfirmation || 'https://tiendapetlife.cl/api/flow-confirm';
    const urlReturn =
      data.urlReturn || `https://tiendapetlife.cl/checkout?status=flow_return&order=${commerceOrder}`;

    if (amount <= 0) {
      res.status(400).json({ success: false, error: 'Monto de orden inválido' });
      return;
    }

    const params = {
      apiKey: FLOW_CONFIG.apiKey,
      amount,
      commerceOrder,
      currency: 'CLP',
      email,
      subject,
      urlConfirmation,
      urlReturn,
    };

    params.s = signParams(params, FLOW_CONFIG.secretKey);
    const postData = new URLSearchParams(params).toString();

    const flowRes = await new Promise((resolve, reject) => {
      const apiReq = https.request(
        FLOW_CONFIG.endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        (apiRes) => {
          let body = '';
          apiRes.on('data', (chunk) => (body += chunk));
          apiRes.on('end', () => {
            try {
              resolve({ statusCode: apiRes.statusCode, data: JSON.parse(body) });
            } catch {
              resolve({ statusCode: apiRes.statusCode, raw: body });
            }
          });
        }
      );

      apiReq.on('error', (err) => reject(err));
      apiReq.setTimeout(12000, () => {
        apiReq.destroy(new Error('Timeout de conexión con Flow'));
      });

      apiReq.write(postData);
      apiReq.end();
    });

    if (flowRes.data && flowRes.data.url && flowRes.data.token) {
      res.status(200).json({
        success: true,
        url: flowRes.data.url,
        token: flowRes.data.token,
        flowOrder: flowRes.data.flowOrder,
        redirectUrl: `${flowRes.data.url}?token=${flowRes.data.token}`,
      });
    } else {
      res.status(400).json({
        success: false,
        error:
          (flowRes.data && flowRes.data.message) ||
          'Error al comunicarse con la pasarela Webpay Plus',
        raw: flowRes.data,
      });
    }
  } catch (err) {
    console.error('Error en api/flow:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error interno del servidor de pagos',
    });
  }
}
