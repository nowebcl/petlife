import { useState, type FC } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Truck,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import type { Product } from '../data/products.ts';
import { formatPrice } from '../data/products.ts';
import { submitOrder, type OrderItem } from '../services/pocketbase.ts';
import { createWebpayTransaction } from '../services/transbank.ts';
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
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    total: number;
    email: string;
    address: string;
    city: string;
  } | null>(null);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shippingCost = cartSubtotal >= 30000 || cartItems.length === 0 ? 0 : 2990;
  const totalAmount = cartSubtotal + shippingCost;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim()) {
      setErrorMessage('Por favor completa todos los datos obligatorios de despacho.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Tu carrito está vacío.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const items: OrderItem[] = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      weightOrSize: item.product.weightOrSize,
      imageUrl: item.product.imageUrl,
    }));

    try {
      const buyOrder = `PL-${Date.now().toString().slice(-6)}`;

      // 1. Iniciar transacción Transbank Webpay Plus
      const tbkResult = await createWebpayTransaction({
        buyOrder,
        sessionId: `SES-${Date.now()}`,
        amount: totalAmount,
        returnUrl: window.location.origin + '/transbank-return',
      });

      // 2. Registrar pedido en la base de datos real de PocketBase
      const orderRes = await submitOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: `${customerAddress.trim()} (${customerRegion})`,
        customerCity: customerCity.trim(),
        customerNotes: customerNotes.trim(),
        items,
        subtotal: cartSubtotal,
        shippingCost,
        total: totalAmount,
        paymentMethod: 'Webpay Plus Transbank',
        transbankToken: tbkResult.token,
      });

      if (orderRes.success && orderRes.order) {
        const ordNumber = orderRes.order.orderNumber || buyOrder;
        setConfirmedOrder({
          orderNumber: ordNumber,
          total: totalAmount,
          email: customerEmail.trim(),
          address: customerAddress.trim(),
          city: customerCity.trim(),
        });
        onOrderSuccess(ordNumber);
      } else {
        setErrorMessage(orderRes.error || 'Error al procesar el pedido.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión');
    } finally {
      setIsProcessing(false);
    }
  };

  // =========================================================================
  // VIEW: CONFIRMACIÓN EXITOSA A PANTALLA COMPLETA
  // =========================================================================
  if (confirmedOrder) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
              Pago y Pedido Registrado
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#061F3D] mt-2">
              ¡Muchas Gracias por tu Compra!
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Orden N°:{' '}
              <span className="font-mono font-black text-[#FF5200]">
                {confirmedOrder.orderNumber}
              </span>
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs sm:text-sm text-slate-600 space-y-3">
            <div className="flex justify-between font-bold text-[#061F3D] pb-2 border-b border-slate-200">
              <span>Monto total pagado:</span>
              <span className="text-lg text-[#FF5200] font-black">{formatPrice(confirmedOrder.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Método de pago:</span>
              <span className="font-bold text-slate-800">Webpay Plus Transbank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dirección de entrega:</span>
              <span className="font-bold text-slate-800">{confirmedOrder.address}, {confirmedOrder.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Confirmación enviada a:</span>
              <span className="font-bold text-slate-800">{confirmedOrder.email}</span>
            </div>
          </div>

          <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80 text-xs text-[#061F3D] flex items-center space-x-3 text-left">
            <span className="text-2xl">🚚</span>
            <div>
              <strong className="block font-bold">Tu pedido ya está siendo preparado en nuestra bodega.</strong>
              <span className="text-slate-500 text-[11px]">
                Recibirás actualizaciones de despacho en tiempo real a tu correo electrónico.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToHome}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-2"
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
            Completa tus datos de envío para procesar tu orden de forma rápida y segura.
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
            {/* Left 7 Columns: Shipping Form & Payment Selection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Contacto y Envío */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5200] flex items-center justify-center font-black text-sm">
                    1
                  </div>
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
                        Correo Electrónico (para confirmación) *
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

              {/* Card 2: Método de Pago */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5200] flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <h2 className="text-base font-black text-[#061F3D]">
                    Método de Pago Seguro
                  </h2>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#FF5200] bg-[#FFF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#FF5200]/30 flex items-center justify-center text-[#FF5200] shrink-0 shadow-2xs">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-[#061F3D] block">
                        Webpay Plus (Transbank)
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Tarjetas de Débito (Redcompra), Crédito y Prepago en Chile
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black shrink-0 self-start sm:self-auto">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Conexión Cifrada SSL</span>
                  </span>
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
                      <span>Conectando con Transbank...</span>
                    </>
                  ) : (
                    <span>Pagar con Webpay Plus {formatPrice(totalAmount)}</span>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Al confirmar, serás redirigido de forma segura para completar tu pago con Transbank.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
