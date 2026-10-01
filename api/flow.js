import crypto from 'crypto';

const FLOW_CONFIG = {
  apiKey: '56EC0FE0-1DAB-487B-93BE-22LC27EC1B24',
  secretKey: '4d36d14f697419812207fc8fc13fe87bc698b431',
  createEndpoint: 'https://www.flow.cl/api/payment/create',
  statusEndpoint: 'https://www.flow.cl/api/payment/getStatus',
};

function signParams(params, secretKey) {
  const sortedKeys = Object.keys(params).sort();
  let toSign = '';
  for (const k of sortedKeys) {
    if (params[k] !== undefined && params[k] !== null && k !== 's') {
      toSign += k + params[k];
    }
  }
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Consultar Estado de Pago en Flow (para saber cuándo se pagó la venta)
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token') || (req.query && req.query.token);

      if (!token) {
        return res.status(400).json({ success: false, error: 'Token de pago requerido' });
      }

      const params = {
        apiKey: FLOW_CONFIG.apiKey,
        token,
      };
      params.s = signParams(params, FLOW_CONFIG.secretKey);

      const statusUrl = `${FLOW_CONFIG.statusEndpoint}?${new URLSearchParams(params).toString()}`;
      const statusRes = await fetch(statusUrl);
      const statusData = await statusRes.json();

      // En Flow:
      // 1 = Pendiente de pago
      // 2 = Pagada (Venta completada con éxito)
      // 3 = Rechazada
      // 4 = Anulada
      const isPaid = statusData.status === 2;

      return res.status(200).json({
        success: true,
        isPaid,
        status: statusData.status,
        flowOrder: statusData.flowOrder,
        commerceOrder: statusData.commerceOrder,
        amount: statusData.amount,
        requestDate: statusData.requestDate,
        data: statusData,
      });
    } catch (err) {
      console.error('Error al consultar estado de pago en Flow:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Error al consultar estado de pago en Flow',
      });
    }
  }

  // 2. POST: Crear nueva orden de pago en Flow
  if (req.method === 'POST') {
    try {
      let data = req.body;
      if (typeof data === 'string') {
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
        return res.status(400).json({ success: false, error: 'Monto de orden inválido' });
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

      const flowResponse = await fetch(FLOW_CONFIG.createEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params).toString(),
      });

      const flowData = await flowResponse.json();

      if (flowData && flowData.url && flowData.token) {
        return res.status(200).json({
          success: true,
          url: flowData.url,
          token: flowData.token,
          flowOrder: flowData.flowOrder,
          redirectUrl: `${flowData.url}?token=${flowData.token}`,
        });
      }

      return res.status(400).json({
        success: false,
        error:
          (flowData && flowData.message) ||
          'Error al comunicarse con la pasarela Webpay Plus',
        raw: flowData,
      });
    } catch (err) {
      console.error('Error en api/flow handler:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Error interno del servidor de pagos',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Método no permitido' });
}
