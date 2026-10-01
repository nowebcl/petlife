/**
 * Servicio de Integración de Pagos con Webpay Plus
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
 * Crea una orden de pago en Webpay Plus y retorna la URL de redirección oficial
 */
export async function createFlowPayment(
  data: FlowPaymentRequest
): Promise<FlowPaymentResponse> {
  try {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tiendapetlife.cl';
    const urlReturn =
      data.urlReturn || `${origin}/checkout?status=success&order=${data.commerceOrder}`;
    const urlConfirmation =
      data.urlConfirmation || 'https://tiendapetlife.cl/api/flow-confirm';

    const payload = {
      commerceOrder: data.commerceOrder,
      amount: Math.round(data.amount),
      email: data.email.trim(),
      subject: data.subject.trim(),
      urlConfirmation,
      urlReturn,
    };

    // 1. Invocar endpoint serverless oficial /api/flow
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

    // 2. Si /api/flow falló o retornó status >= 400, intentar fallback /api/flow/payment/create
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

    // Si hubo respuesta pero con error del servidor
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
 * Genera el enlace directo a WhatsApp (+56 9 8253 5868) con el mensaje de coordinación pre-cargado
 */
export function buildWhatsAppCoordinationUrl(order: {
  orderNumber: string;
  customerName: string;
  total: number;
  customerAddress?: string;
  customerCity?: string;
}): string {
  const number = WEBPAY_CONFIG.whatsappNumber;
  const totalFormatted = '$' + Math.round(order.total).toLocaleString('es-CL');
  const addressLine = order.customerAddress
    ? `\n📍 *Dirección de Despacho:* ${order.customerAddress}${
        order.customerCity ? `, ${order.customerCity}` : ''
      }`
    : '';

  const message =
    `¡Hola PetLife! 🐾 Acabo de realizar mi compra mediante Webpay Plus.\n\n` +
    `📦 *Orden N°:* ${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customerName}\n` +
    `💰 *Monto Pagado:* ${totalFormatted}` +
    `${addressLine}\n\n` +
    `Adjunto mi comprobante de pago para coordinar el envío. ¡Muchas gracias!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
