/**
 * Servicio de Integración de Pagos con Webpay Plus (Flow Chile)
 * Pasarela Oficial en Producción (Tarjetas de Débito, Crédito, Prepago)
 */

export const WEBPAY_CONFIG = {
  apiKey: '56EC0FE0-1DAB-487B-93BE-22LC27EC1B24',
  secretKey: '4d36d14f697419812207fc8fc13fe87bc698b431',
  whatsappNumber: '56982535868',
};

export interface FlowPaymentRequest {
  commerceOrder: string;
  amount: number;
  email: string;
  subject: string;
  urlReturn?: string;
  urlConfirmation?: string;
  isSandbox?: boolean;
}

export interface FlowPaymentResponse {
  success: boolean;
  url?: string;
  token?: string;
  flowOrder?: number | string;
  redirectUrl?: string;
  isSandbox?: boolean;
  error?: string;
}

export interface FlowStatusResponse {
  success: boolean;
  isPaid: boolean;
  status?: number; // 1: pendiente, 2: pagada, 3: rechazada, 4: anulada
  flowOrder?: number | string;
  commerceOrder?: string;
  amount?: number | string;
  requestDate?: string;
  order?: any;
  isSandbox?: boolean;
  error?: string;
}

/**
 * Consulta el estado real de pago en Flow para verificar cuándo la venta fue pagada con éxito
 */
export async function checkFlowPaymentStatus(
  token: string,
  commerceOrder?: string
): Promise<FlowStatusResponse> {
  try {
    const url = `/api/flow?token=${encodeURIComponent(token)}${
      commerceOrder ? `&order=${encodeURIComponent(commerceOrder)}` : ''
    }`;
    const res = await fetch(url);
    if (!res.ok) {
      return { success: false, isPaid: false, error: 'No se pudo verificar el estado en Flow' };
    }
    const data = await res.json();
    return {
      success: true,
      isPaid: data.isPaid === true || data.status === 2,
      status: data.status,
      flowOrder: data.flowOrder,
      commerceOrder: data.commerceOrder,
      amount: data.amount,
      requestDate: data.requestDate,
      order: data.order,
      isSandbox: data.isSandbox,
    };
  } catch (err: any) {
    console.error('Error al verificar estado de pago Flow:', err);
    return { success: false, isPaid: false, error: err.message };
  }
}

/**
 * Crea una orden de pago en Webpay Plus y retorna la URL de redirección oficial
 */
export async function createFlowPayment(
  data: FlowPaymentRequest
): Promise<FlowPaymentResponse> {
  try {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tiendapetlife.cl';
    const urlReturn =
      data.urlReturn || `${origin}/api/flow-return?order=${data.commerceOrder}`;
    const urlConfirmation =
      data.urlConfirmation || 'https://tiendapetlife.cl/api/flow-confirm';

    const payload = {
      commerceOrder: data.commerceOrder,
      amount: Math.round(data.amount),
      email: data.email.trim(),
      subject: data.subject.trim(),
      urlConfirmation,
      urlReturn,
      isSandbox: data.isSandbox === true,
    };

    let res: Response | null = null;
    try {
      res = await fetch('/api/flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (fetchErr) {
      console.warn('Error al invocar /api/flow:', fetchErr);
      res = null;
    }

    if (!res || !res.ok) {
      try {
        res = await fetch('/api/flow/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (fallbackErr) {
        console.warn('Error al invocar fallback /api/flow/payment/create:', fallbackErr);
      }
    }

    if (res && res.ok) {
      const json = await res.json();
      if (json.success && json.redirectUrl) {
        return {
          success: true,
          url: json.url,
          token: json.token,
          flowOrder: json.flowOrder,
          redirectUrl: json.redirectUrl,
        };
      }
      if (json.url && json.token) {
        return {
          success: true,
          url: json.url,
          token: json.token,
          flowOrder: json.flowOrder,
          redirectUrl: `${json.url}?token=${json.token}`,
        };
      }
      return {
        success: false,
        error: json.error || 'No se pudo generar la transacción en Webpay Plus.',
      };
    }

    if (res) {
      try {
        const errJson = await res.json();
        return {
          success: false,
          error:
            errJson.error ||
            'Error al comunicarse con Webpay Plus. Por favor reintenta en un momento.',
        };
      } catch {
        const rawText = await res.text().catch(() => '');
        console.error('Servidor retornó error no JSON:', res.status, rawText);
        return {
          success: false,
          error:
            res.status === 500
              ? 'Error en el servidor de pagos. Reintenta en breves segundos.'
              : 'Error al conectar con Webpay Plus (Código: ' + res.status + ').',
        };
      }
    }

    return {
      success: false,
      error:
        'No se pudo conectar con el servidor de pagos Webpay Plus. Por favor verifica tu conexión e intenta nuevamente.',
    };
  } catch (err: any) {
    console.error('Error al procesar pago con Webpay Plus:', err);
    return {
      success: false,
      error:
        'Error al iniciar el pago con Webpay Plus. Por favor verifica tus datos e intenta nuevamente.',
    };
  }
}

/**
 * Genera el enlace directo a WhatsApp (+56 9 8253 5868) para el seguimiento del envío
 */
export function buildWhatsAppCoordinationUrl(order: {
  orderNumber: string;
  customerName: string;
  total: number;
  customerAddress?: string;
  customerCity?: string;
  customerRegion?: string;
}): string {
  const number = WEBPAY_CONFIG.whatsappNumber;
  const totalFormatted = '$' + Math.round(order.total).toLocaleString('es-CL');
  const locationLine = order.customerAddress
    ? `\n📍 *Dirección de Despacho:* ${order.customerAddress}${
        order.customerCity ? `, ${order.customerCity}` : ''
      }${order.customerRegion ? ` (${order.customerRegion})` : ''}`
    : '';

  const message =
    `¡Hola PetLife! 🐾 Acabo de realizar mi compra.\n\n` +
    `📦 *Número de Seguimiento / Orden:* ${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customerName}\n` +
    `💰 *Monto Pagado (Productos):* ${totalFormatted}\n` +
    `🚚 *Envío:* A coordinar en la entrega` +
    `${locationLine}\n\n` +
    `Adjunto mi comprobante para coordinar el seguimiento y entrega de mi envío. ¡Muchas gracias!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
