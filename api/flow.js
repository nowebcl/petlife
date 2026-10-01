import crypto from 'crypto';

export const FLOW_CONFIG = {
  apiKey: '56EC0FE0-1DAB-487B-93BE-22LC27EC1B24',
  secretKey: '4d36d14f697419812207fc8fc13fe87bc698b431',
  createEndpoint: 'https://www.flow.cl/api/payment/create',
  statusEndpoint: 'https://www.flow.cl/api/payment/getStatus',
};

export function signParams(params, secretKey) {
  const sortedKeys = Object.keys(params).sort();
  let toSign = '';
  for (const k of sortedKeys) {
    if (params[k] !== undefined && params[k] !== null && k !== 's') {
      toSign += k + params[k];
    }
  }
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

/**
 * Sincroniza una orden pagada con la base de datos PocketBase y descuenta stock
 */
export async function syncPaidOrderWithPocketBase(statusData) {
  try {
    const pbUrl = process.env.POCKETBASE_URL || 'https://petlife.noweb.cl';
    const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL || 'contacto@tiendapetlife.cl';
    const adminPass = process.env.POCKETBASE_ADMIN_PASSWORD || 'PetLife.2026*';

    // 1. Iniciar sesión como superusuario en PocketBase
    const authRes = await fetch(`${pbUrl}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: adminEmail, password: adminPass }),
    });

    if (!authRes.ok) {
      console.error('PocketBase superuser auth failed in flow sync:', authRes.status);
      return false;
    }

    const authData = await authRes.json();
    const token = authData.token;

    const commerceOrder = statusData.commerceOrder || '';
    const flowOrder = String(statusData.flowOrder || '');

    // 2. Buscar la orden por orderNumber
    let targetOrder = null;
    if (commerceOrder) {
      const searchRes = await fetch(
        `${pbUrl}/api/collections/orders/records?filter=${encodeURIComponent(`orderNumber="${commerceOrder}"`)}`,
        { headers: { Authorization: token } }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.items && searchData.items.length > 0) {
          targetOrder = searchData.items[0];
        }
      }
    }

    // Si no la encontramos por orderNumber exacto, buscar por correo del pagador y monto
    if (!targetOrder && statusData.payer && statusData.amount) {
      const filter = `customerEmail="${statusData.payer}" && total=${Math.round(statusData.amount)}`;
      const searchRes = await fetch(
        `${pbUrl}/api/collections/orders/records?filter=${encodeURIComponent(filter)}&sort=-id`,
        { headers: { Authorization: token } }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.items && searchData.items.length > 0) {
          targetOrder = searchData.items[0];
        }
      }
    }

    if (targetOrder) {
      // 3. Actualizar la orden a 'pagado'
      const patchRes = await fetch(`${pbUrl}/api/collections/orders/records/${targetOrder.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: commerceOrder || targetOrder.orderNumber,
          status: 'pagado',
          paymentStatus: 'pagado',
          transbankToken: flowOrder,
          transbankResponse: statusData,
        }),
      });

      console.log(`Orden ${targetOrder.orderNumber} sincronizada con estado PAGADO:`, patchRes.status);

      // 4. Si la orden tiene items y su estado anterior no era pagado, descontar stock de los productos
      if (Array.isArray(targetOrder.items) && targetOrder.status !== 'pagado') {
        for (const item of targetOrder.items) {
          if (item && item.id) {
            try {
              const prodRes = await fetch(`${pbUrl}/api/collections/products/records/${item.id}`, {
                headers: { Authorization: token },
              });
              if (prodRes.ok) {
                const prod = await prodRes.json();
                const currentStock = typeof prod.stockCount === 'number' ? prod.stockCount : 15;
                const newStock = Math.max(0, currentStock - (item.quantity || 1));
                await fetch(`${pbUrl}/api/collections/products/records/${item.id}`, {
                  method: 'PATCH',
                  headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    stockCount: newStock,
                    inStock: newStock > 0,
                  }),
                });
              }
            } catch (stockErr) {
              console.warn('Error al descontar stock del producto:', item.id, stockErr);
            }
          }
        }
      }

      return true;
    } else {
      console.warn(`No se encontró orden en PocketBase para Flow order ${commerceOrder}`);
      return false;
    }
  } catch (err) {
    console.error('Error sincronizando orden pagada con PocketBase:', err);
    return false;
  }
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
      let orderUpdated = false;

      if (isPaid) {
        try {
          orderUpdated = await syncPaidOrderWithPocketBase(statusData);
        } catch (syncErr) {
          console.error('Error sincronizando orden en PocketBase:', syncErr);
        }
      }

      return res.status(200).json({
        success: true,
        isPaid,
        orderUpdated,
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

  // 2. POST: Crear nueva orden de pago en Flow (o procesar retorno de Flow)
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

      // Si Flow hace POST de retorno a este endpoint con un token y sin monto
      const url = new URL(req.url, 'http://localhost');
      const action = url.searchParams.get('action') || (req.query && req.query.action);
      if (action === 'return' || (data.token && !data.amount)) {
        const token = data.token || url.searchParams.get('token') || '';
        const order = url.searchParams.get('order') || data.order || data.commerceOrder || '';
        res.writeHead(302, {
          Location: `/checkout?status=flow_return&order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`,
        });
        return res.end();
      }

      const commerceOrder = data.commerceOrder || `PL-${Date.now().toString().slice(-6)}`;
      const amount = Math.round(Number(data.amount) || 0);
      const email = (data.email || 'contacto@tiendapetlife.cl').trim();
      const subject = (data.subject || `Compra PetLife ${commerceOrder}`).trim();
      const urlConfirmation =
        data.urlConfirmation || 'https://tiendapetlife.cl/api/flow-confirm';
      const urlReturn =
        data.urlReturn || `https://tiendapetlife.cl/api/flow-return?order=${commerceOrder}`;

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
