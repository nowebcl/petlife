/**
 * Servicio de Integración de Pagos en Producción con Flow.cl
 * API REST Oficial Flow Chile (Webpay Plus, Tarjetas de Débito, Crédito, Prepago)
 */

export const FLOW_CONFIG = {
  apiKey: '56EC0FE0-1DAB-487B-93BE-22LC27EC1B24',
  secretKey: '4d36d14f697419812207fc8fc13fe87bc698b431',
  whatsappNumber: '56982535868',
  endpoint: '/api/flow/payment/create', // Proxied vía Vite / backend
  directEndpoint: 'https://www.flow.cl/api/payment/create',
};

/**
 * Calcula la firma HMAC-SHA256 requerida por Flow
 * Ordena las llaves alfabéticamente, concatena llave+valor y aplica HMAC-SHA256
 */
export async function signFlowParams(
  params: Record<string, any>,
  secretKey: string = FLOW_CONFIG.secretKey
): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  let toSign = '';
  for (const k of sortedKeys) {
    if (params[k] !== undefined && params[k] !== null) {
      toSign += `${k}${params[k]}`;
    }
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const msgData = encoder.encode(toSign);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface FlowPaymentRequest {
  commerceOrder: string;
  amount: number;
  email: string;
  subject: string;
  urlReturn?: string;
  urlConfirmation?: string;
}

export interface FlowPaymentResponse {
  success: boolean;
  url?: string;
  token?: string;
  flowOrder?: number | string;
  redirectUrl?: string;
  error?: string;
}

/**
 * Crea una orden de pago en Flow en producción y retorna la URL de redirección
 */
export async function createFlowPayment(
  data: FlowPaymentRequest
): Promise<FlowPaymentResponse> {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://petlife.noweb.cl';
    const urlReturn =
      data.urlReturn || `${origin}/checkout?status=success&order=${data.commerceOrder}`;
    const urlConfirmation =
      data.urlConfirmation || `https://petlife.noweb.cl/api/flow-confirm`;

    const params: Record<string, any> = {
      apiKey: FLOW_CONFIG.apiKey,
      amount: Math.round(data.amount),
      commerceOrder: data.commerceOrder,
      currency: 'CLP',
      email: data.email.trim(),
      subject: data.subject.trim(),
      urlConfirmation,
      urlReturn,
    };

    // Generar firma digital HMAC-SHA256
    const signature = await signFlowParams(params, FLOW_CONFIG.secretKey);
    params.s = signature;

    const postBody = new URLSearchParams(params).toString();

    // 1. Intentar por el proxy local / Vite
    let res: Response | null = null;
    try {
      res = await fetch(FLOW_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postBody,
      });
    } catch {
      // Fallback si el proxy no responde
      res = null;
    }

    if (!res || !res.ok) {
      // Intento directo con el endpoint oficial
      res = await fetch(FLOW_CONFIG.directEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postBody,
      });
    }

    const json = await res.json();

    if (json.url && json.token) {
      const redirectUrl = `${json.url}?token=${json.token}`;
      return {
        success: true,
        url: json.url,
        token: json.token,
        flowOrder: json.flowOrder,
        redirectUrl,
      };
    }

    return {
      success: false,
      error: json.message || `Error Flow: ${JSON.stringify(json)}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Error de conexión con la pasarela Flow',
    };
  }
}

/**
 * Genera el enlace directo a WhatsApp (+56 9 8253 5868) con el mensaje de coordinación pre-cargado
 */
export function buildWhatsAppCoordinationUrl(order: {
  orderNumber: string;
  customerName: string;
  total: number;
  customerAddress?: string;
  customerCity?: string;
}): string {
  const number = FLOW_CONFIG.whatsappNumber;
  const totalFormatted = '$' + Math.round(order.total).toLocaleString('es-CL');
  const addressLine = order.customerAddress
    ? `\n📍 *Dirección de Despacho:* ${order.customerAddress}${
        order.customerCity ? `, ${order.customerCity}` : ''
      }`
    : '';

  const message =
    `¡Hola PetLife! 🐾 Acabo de realizar mi compra mediante Flow.\n\n` +
    `📦 *Orden N°:* ${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customerName}\n` +
    `💰 *Monto Pagado:* ${totalFormatted}` +
    `${addressLine}\n\n` +
    `Adjunto mi comprobante de pago para coordinar el envío. ¡Muchas gracias!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
