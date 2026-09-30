import { useState, useEffect, type FC } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Truck,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Download,
  MessageCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import type { Product } from '../data/products.ts';
import { formatPrice } from '../data/products.ts';
import { submitOrder, type OrderItem } from '../services/pocketbase.ts';
import {
  createFlowPayment,
  buildWhatsAppCoordinationUrl,
} from '../services/flow.ts';
import {
  downloadOrderReceiptPDF,
  type ReceiptData,
} from '../services/receipt.ts';
import { Logo } from './Logo.tsx';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onOrderSuccess: (orderNumber: string) => void;
  onNavigateToCart: () => void;
  onNavigateToHome: () => void;
}

export const CheckoutPage: FC<CheckoutPageProps> = ({
  cartItems,
  onOrderSuccess,
  onNavigateToCart,
  onNavigateToHome,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+56 9 ');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Santiago');
  const [customerRegion, setCustomerRegion] = useState('Región Metropolitana');
  const [customerNotes, setCustomerNotes] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ReceiptData | null>(null);
  const [autoDownloadNotice, setAutoDownloadNotice] = useState(false);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shippingCost = cartSubtotal >= 30000 || cartItems.length === 0 ? 0 : 2990;
  const totalAmount = cartSubtotal + shippingCost;

  // Detect return from Webpay Plus gateway (urlReturn) or restored session
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = new URLSearchParams(window.location.search);
    const hasPaymentReturn =
      query.get('status') === 'flow_return' ||
      query.get('status') === 'success' ||
      Boolean(query.get('token')) ||
      Boolean(query.get('order'));

    const storedPending = sessionStorage.getItem('petlife_pending_order');
    const storedLast = sessionStorage.getItem('petlife_last_order');

    let orderData: ReceiptData | null = null;
    if (storedPending) {
      try {
        orderData = JSON.parse(storedPending);
      } catch (e) {
        console.error('Error parsing stored pending order', e);
      }
    } else if (storedLast && hasPaymentReturn) {
      try {
        orderData = JSON.parse(storedLast);
      } catch (e) {
        console.error('Error parsing stored last order', e);
      }
    }

    if (orderData && hasPaymentReturn) {
      setConfirmedOrder(orderData);
      sessionStorage.removeItem('petlife_pending_order');
      sessionStorage.setItem('petlife_last_order', JSON.stringify(orderData));
      onOrderSuccess(orderData.orderNumber);

      // Trigger automatic PDF receipt download immediately
      setAutoDownloadNotice(true);
      setTimeout(() => {
        downloadOrderReceiptPDF(orderData!);
      }, 600);
    }
  }, [onOrderSuccess]);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim()) {
      setErrorMessage('Por favor completa todos los datos obligatorios de contacto y despacho.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const buyOrder = `PL-${Date.now().toString().slice(-6)}`;

    // Prepare full receipt & order data
    const orderData: ReceiptData = {
      orderNumber: buyOrder,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      customerCity: customerCity.trim(),
      customerNotes: customerNotes.trim(),
      items: cartItems.map((ci) => ({
        name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        weightOrSize: ci.product.weightOrSize,
      })),
      subtotal: cartSubtotal,
      shippingCost,
      total: totalAmount,
      paymentMethod: 'Webpay Plus (Débito / Crédito)',
      date: new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Store in session storage so it persists during gateway redirection
    sessionStorage.setItem('petlife_pending_order', JSON.stringify(orderData));
    sessionStorage.setItem('petlife_last_order', JSON.stringify(orderData));

    const dbItems: OrderItem[] = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      weightOrSize: item.product.weightOrSize,
      imageUrl: item.product.imageUrl,
    }));

    try {
      // 1. Registrar pedido en base de datos
      try {
        await submitOrder({
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone || '',
          customerAddress: `${orderData.customerAddress} (${customerRegion})`,
          customerCity: orderData.customerCity || '',
          customerNotes: orderData.customerNotes || '',
          items: dbItems,
          subtotal: cartSubtotal,
          shippingCost,
          total: totalAmount,
          paymentMethod: 'Webpay Plus',
          transbankToken: '',
        });
      } catch (dbErr) {
        console.warn('Registro de pedido en backend advertencia:', dbErr);
      }

      // 2. Iniciar pago con pasarela oficial Webpay Plus
      const paymentRes = await createFlowPayment({
        commerceOrder: buyOrder,
        amount: totalAmount,
        email: customerEmail.trim(),
        subject: `Compra PetLife ${buyOrder}`,
        urlReturn: `${window.location.origin}/checkout?status=flow_return&order=${buyOrder}`,
      });

      if (paymentRes.success && paymentRes.redirectUrl) {
        if (paymentRes.flowOrder) {
          orderData.flowOrder = paymentRes.flowOrder;
          sessionStorage.setItem('petlife_pending_order', JSON.stringify(orderData));
          sessionStorage.setItem('petlife_last_order', JSON.stringify(orderData));
        }

        // Redirigir al cliente a la página de pago seguro
        window.location.href = paymentRes.redirectUrl;
      } else {
        setErrorMessage(
          paymentRes.error ||
            'No se pudo conectar con el portal de Webpay Plus. Por favor verifica tus datos o intenta nuevamente.'
        );
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión con la pasarela de pagos.');
      setIsProcessing(false);
    }
  };

  const handleManualDownloadReceipt = () => {
    if (confirmedOrder) {
      downloadOrderReceiptPDF(confirmedOrder);
    }
  };

  // =========================================================================
  // VIEW: CONFIRMACIÓN EXITOSA A PANTALLA COMPLETA
  // =========================================================================
  if (confirmedOrder) {
    const whatsappUrl = buildWhatsAppCoordinationUrl({
      orderNumber: confirmedOrder.orderNumber,
      customerName: confirmedOrder.customerName,
      total: confirmedOrder.total,
      customerAddress: confirmedOrder.customerAddress,
      customerCity: confirmedOrder.customerCity,
    });

    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          {/* Header con Check de Pago Aprobado */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce-short">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pago Aprobado con Éxito vía Webpay Plus</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#061F3D] mt-2">
                ¡Muchas Gracias por tu Compra!
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Orden N°:{' '}
                <span className="font-mono font-black text-[#FF5200] text-base">
                  {confirmedOrder.orderNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Banner de Descarga Automática de Comprobante PDF */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 space-y-3 text-left shadow-2xs">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#061F3D]">
                    Comprobante de Pago Electrónico
                  </h3>
                  {autoDownloadNotice && (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Descargado automáticamente ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tu comprobante oficial en formato PDF ya se ha generado y descargado a tu dispositivo. También puedes volver a descargarlo en cualquier momento.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleManualDownloadReceipt}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-sky-300 text-sky-800 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-2xs transition-all cursor-pointer hover:shadow-xs"
              >
                <Download className="w-4 h-4 text-sky-600" />
                <span>Descargar Comprobante PDF (Reimprimir)</span>
              </button>
            </div>
          </div>

          {/* BOTÓN Y TARJETA DESTACADA: COORDINAR ENVÍO POR WHATSAPP (+56 9 8253 5868) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-[#25D366] to-emerald-600 text-white shadow-lg space-y-3.5 text-center relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black tracking-wider uppercase backdrop-blur-xs">
                Paso Final • Coordinación Inmediata
              </span>
              <h2 className="text-lg sm:text-xl font-black">
                ¿Deseas coordinar la entrega de tu pedido?
              </h2>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-lg mx-auto leading-relaxed">
                Escríbenos directamente a nuestro WhatsApp oficial para agendar el día y horario exacto de despacho con nuestro equipo.
              </p>
            </div>

            <div className="relative z-10 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2.5 w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-emerald-800 font-black text-sm sm:text-base shadow-md hover:shadow-xl transition-all transform active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                <span>Coordinar Despacho por WhatsApp (+56 9 8253 5868)</span>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </a>
            </div>

            <p className="text-[11px] text-emerald-100 relative z-10">
              Número directo: <strong>+56 9 8253 5868</strong> • Atención rápida de Lunes a Domingo
            </p>
          </div>

          {/* Resumen detallado del pedido */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs sm:text-sm text-slate-600 space-y-3">
            <div className="flex justify-between font-bold text-[#061F3D] pb-2 border-b border-slate-200">
              <span>Monto total pagado:</span>
              <span className="text-lg text-[#FF5200] font-black">
                {formatPrice(confirmedOrder.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Método de pago:</span>
              <span className="font-bold text-slate-800">
                Webpay Plus (Débito, Crédito, Prepago)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dirección de despacho:</span>
              <span className="font-bold text-slate-800 text-right">
                {confirmedOrder.customerAddress}
                {confirmedOrder.customerCity ? `, ${confirmedOrder.customerCity}` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Confirmación enviada a:</span>
              <span className="font-bold text-slate-800">{confirmedOrder.customerEmail}</span>
            </div>
            {confirmedOrder.customerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono de contacto:</span>
                <span className="font-bold text-slate-800">{confirmedOrder.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Artículos comprados */}
          {confirmedOrder.items && confirmedOrder.items.length > 0 && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Productos Comprados ({confirmedOrder.items.length})
              </span>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">
                        {item.quantity}x {item.name}
                      </span>
                      {item.weightOrSize && (
                        <span className="text-[11px] text-slate-400 block">
                          Formato: {item.weightOrSize}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-slate-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de Retorno a Tienda */}
          <div className="pt-2 text-center">
            <button
              onClick={onNavigateToHome}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#061F3D] hover:bg-[#0a2a52] text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center space-x-2"
            >
              <span>Volver a la Tienda Principal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: FORMULARIO CHECKOUT A PANTALLA COMPLETA
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-24 animate-fade-in">
      {/* Top Header / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-8 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            {onNavigateToHome && (
              <button
                onClick={onNavigateToHome}
                className="flex items-center cursor-pointer mr-1 hover:opacity-90 transition-opacity"
                title="Ir a inicio PetLife"
              >
                <Logo className="h-8 sm:h-9 w-auto" />
              </button>
            )}
            <button
              onClick={onNavigateToCart}
              className="p-2 rounded-xl text-slate-500 hover:text-[#061F3D] hover:bg-slate-100 transition-colors flex items-center space-x-1 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Carrito</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-black text-[#FF5200] uppercase tracking-wider">
              Checkout Seguro
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold">
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-black">
                ✓
              </span>
              <span>Carrito</span>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center space-x-1.5 text-[#FF5200]">
              <span className="w-5 h-5 rounded-full bg-[#FF5200] text-white text-[10px] flex items-center justify-center font-black">
                2
              </span>
              <span>Despacho y Pago</span>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-black">
                3
              </span>
              <span>Confirmación</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#061F3D]">
            Finalizar Compra
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Completa tus datos de envío para procesar tu orden de forma rápida y segura mediante Webpay Plus.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Formulario de Despacho (Limpio, sin tarjeta de pasarela) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                  <h2 className="text-base font-black text-[#061F3D]">
                    Datos de Contacto y Despacho
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Carolina Morales"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Correo Electrónico (para confirmación y comprobante) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="carolina@ejemplo.cl"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Teléfono Celular *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+56 9 8253 5868"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Dirección de Entrega (Calle, Número, Depto) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Ej: Av. Apoquindo 4800, Depto 1002"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Comuna / Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder="Las Condes, Santiago"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Región
                      </label>
                      <select
                        value={customerRegion}
                        onChange={(e) => setCustomerRegion(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm"
                      >
                        <option value="Región Metropolitana">Región Metropolitana</option>
                        <option value="Valparaíso">Región de Valparaíso</option>
                        <option value="Biobío">Región del Biobío</option>
                        <option value="Coquimbo">Región de Coquimbo</option>
                        <option value="Otras Regiones">Otras Regiones</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Instrucciones de Entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Ej: Dejar en conserjería o tocar timbre de la izquierda"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-[#FF5200] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-[#061F3D]">
                    Resumen del Pedido
                  </h3>
                  <button
                    type="button"
                    onClick={onNavigateToCart}
                    className="text-xs font-bold text-[#FF5200] hover:underline"
                  >
                    Editar Carrito
                  </button>
                </div>

                {/* Items in order */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center space-x-2.5 max-w-[200px] sm:max-w-[240px]">
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="w-10 h-10 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-bold text-[#061F3D] block truncate">{product.name}</span>
                          <span className="text-[10px] text-slate-400">Cant: {quantity} • {formatPrice(product.price)} c/u</span>
                        </div>
                      </div>
                      <span className="font-black text-[#061F3D] shrink-0">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-700">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Despacho a domicilio:</span>
                    </span>
                    <span>
                      {shippingCost === 0 ? (
                        <strong className="text-emerald-600">¡Gratis!</strong>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-sm font-black text-[#061F3D]">Total a Pagar:</span>
                    <span className="text-2xl font-black text-[#FF5200]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Submit Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Conectando con Webpay Plus...</span>
                    </>
                  ) : (
                    <span>Pagar con Webpay Plus {formatPrice(totalAmount)}</span>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Al confirmar, serás redirigido de forma segura para pagar con Webpay Plus. Descargarás tu comprobante automáticamente.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
