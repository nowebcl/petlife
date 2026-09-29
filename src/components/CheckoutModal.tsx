import { useState, type FC } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Truck,
  ArrowRight,
} from 'lucide-react';
import type { Product } from '../data/products.ts';
import { formatPrice } from '../data/products.ts';
import { submitOrder, type OrderItem } from '../services/pocketbase.ts';
import { createWebpayTransaction } from '../services/transbank.ts';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartSubtotal: number;
  onOrderSuccess: (orderNumber: string) => void;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartSubtotal,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+56 9 ');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Santiago');
  const [customerNotes, setCustomerNotes] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const shippingCost = cartSubtotal >= 30000 ? 0 : 2990;
  const totalAmount = cartSubtotal + shippingCost;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim()) {
      setErrorMessage('Por favor completa todos los campos obligatorios de despacho.');
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
      // 1. Iniciar transacción Transbank Webpay Plus
      const buyOrder = `ORD-${Date.now().toString().slice(-6)}`;
      const tbkResult = await createWebpayTransaction({
        buyOrder,
        sessionId: `SES-${Date.now()}`,
        amount: totalAmount,
        returnUrl: window.location.origin + '/transbank-return',
      });

      // 2. Registrar el pedido en la base de datos real de PocketBase
      const orderRes = await submitOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
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
        const ordNum = orderRes.order.orderNumber || buyOrder;
        setConfirmedOrderNumber(ordNum);
        onOrderSuccess(ordNum);
      } else {
        setErrorMessage(orderRes.error || 'Error al procesar el pedido. Intenta nuevamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#061F3D]/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrderNumber ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[#061F3D] mb-1">
              ¡Pedido Registrado con Éxito!
            </h3>
            <p className="text-sm font-semibold text-slate-500 mb-4">
              N° de Orden:{' '}
              <span className="font-mono font-black text-[#FF5200]">
                {confirmedOrderNumber}
              </span>
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 space-y-2 mb-6">
              <div className="flex justify-between font-bold text-[#061F3D]">
                <span>Total a pagar:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-semibold text-slate-700">Webpay Plus Transbank</span>
              </div>
              <div className="flex justify-between">
                <span>Despacho a:</span>
                <span className="font-semibold text-slate-700">{customerAddress}, {customerCity}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs font-semibold mb-6">
              🐾 Hemos enviado los detalles de tu compra y seguimiento a{' '}
              <strong>{customerEmail}</strong>. ¡Tu peludo te lo agradecerá!
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 cursor-pointer"
            >
              Continuar en PetLife
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-black text-[#061F3D]">
                Finalizar Compra y Despacho
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Ingresa tus datos de entrega para procesar tu orden en línea.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ejemplo@correo.cl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Teléfono Celular
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Av. Providencia 1234, Depto 402"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Comuna / Ciudad
                  </label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Santiago"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notas para el repartidor (opcional)
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Timbre casa blanca o dejar en conserjería"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-[#FF5200]"
                />
              </div>

              {/* Payment Method Badge */}
              <div className="p-3.5 rounded-2xl border border-orange-200 bg-[#FFF8F5] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center text-[#FF5200]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-[#061F3D] block">
                      Webpay Plus Transbank
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Débito (Redcompra), Crédito y Prepago
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 font-bold text-[10px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pago Seguro</span>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal productos:</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Despacho a domicilio:</span>
                  </span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-600">¡Gratis!</strong> : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#061F3D] pt-1 border-t border-slate-100">
                  <span>Total final:</span>
                  <span className="text-base text-[#FF5200]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Conectando con pasarela segura...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Pagar {formatPrice(totalAmount)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
