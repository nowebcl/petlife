import { type FC } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Package,
} from 'lucide-react';
import type { Product } from '../data/products.ts';
import { formatPrice } from '../data/products.ts';
import { Logo } from './Logo.tsx';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigateToCatalog: () => void;
  onNavigateToCheckout: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToHome?: () => void;
}

export const CartPage: FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToCatalog,
  onNavigateToCheckout,
  onSelectProduct,
  onNavigateToHome,
}) => {
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 30000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping || cartItems.length === 0 ? 0 : 2990;
  const totalAmount = cartSubtotal + shippingCost;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - cartSubtotal;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-24 animate-fade-in">
      {/* Top Header / Breadcrumb Bar */}
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
              onClick={onNavigateToCatalog}
              className="p-2 rounded-xl text-slate-500 hover:text-[#061F3D] hover:bg-slate-100 transition-colors flex items-center space-x-1 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Seguir comprando</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-black text-[#FF5200] uppercase tracking-wider">
              Mi Carrito ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} productos)
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold">
            <span className="flex items-center space-x-1.5 text-[#FF5200]">
              <span className="w-5 h-5 rounded-full bg-[#FF5200] text-white text-[10px] flex items-center justify-center font-black">
                1
              </span>
              <span>Carrito</span>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-black">
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
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm mt-8">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFF8F5] border border-[#FF5200]/20 flex items-center justify-center text-4xl mb-4 shadow-xs">
              🛍️
            </div>
            <h2 className="text-2xl font-black text-[#061F3D] mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Aún no has añadido productos a tu pedido. Revisa nuestro catálogo con alimentos, snacks y arenas sanitarias para consentir a tu mascota.
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="py-3.5 px-8 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 cursor-pointer inline-flex items-center space-x-2"
            >
              <span>Explorar Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Active Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Cart Items Table/List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="flex items-center space-x-2 text-[#061F3D]">
                    <Truck className="w-4 h-4 text-[#FF5200]" />
                    <span>
                      {isFreeShipping ? (
                        <span className="text-emerald-600">¡Genial! Tienes Envío GRATIS a domicilio</span>
                      ) : (
                        <span>
                          Agrega <strong className="text-[#FF5200]">{formatPrice(amountNeeded)}</strong> más para obtener <strong>Envío GRATIS</strong>
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-slate-400 font-black">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFreeShipping
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-[#FF5200] to-amber-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-slate-100 p-2 sm:p-0">
                  {cartItems.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-4 sm:px-6 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-center hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Product Info */}
                      <div className="w-full sm:col-span-6 flex items-center space-x-3.5">
                        <div
                          onClick={() => onSelectProduct(product)}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 p-1.5 border border-slate-200/70 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.currentTarget.src = '/product-dog-food.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#FF5200] uppercase tracking-wider block">
                            {product.categoryLabel}
                          </span>
                          <h3
                            onClick={() => onSelectProduct(product)}
                            className="text-xs sm:text-sm font-black text-[#061F3D] hover:text-[#FF5200] transition-colors cursor-pointer truncate"
                            title={product.name}
                          >
                            {product.name}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                            Formato: {product.weightOrSize || 'Estándar'}
                          </span>
                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors inline-flex items-center space-x-1 mt-1.5 cursor-pointer sm:hidden"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="hidden sm:block sm:col-span-2 text-center text-xs font-bold text-slate-600">
                        {formatPrice(product.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-full bg-slate-50 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                            title="Restar 1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center font-black text-xs text-[#061F3D]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                            title="Sumar 1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Mobile subtotal shown on right */}
                        <div className="sm:hidden text-right font-black text-sm text-[#061F3D]">
                          {formatPrice(product.price * quantity)}
                        </div>
                      </div>

                      {/* Desktop Subtotal & Trash */}
                      <div className="hidden sm:flex sm:col-span-2 items-center justify-end space-x-3">
                        <span className="font-black text-sm text-[#061F3D]">
                          {formatPrice(product.price * quantity)}
                        </span>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Bar inside items card */}
                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={onNavigateToCatalog}
                    className="text-xs font-bold text-[#FF5200] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>← Agregar más productos</span>
                  </button>

                  <button
                    onClick={onClearCart}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vaciar carrito</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Order Summary Card (Sticky) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-base font-black text-[#061F3D] border-b border-slate-100 pb-3">
                  Resumen de la Orden
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} productos):</span>
                    <span className="font-bold text-slate-700">{formatPrice(cartSubtotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Costo de despacho:</span>
                    </span>
                    <span className="font-bold">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 font-extrabold">¡Gratis!</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-sm font-black text-[#061F3D]">Total a Pagar:</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#FF5200]">
                        {formatPrice(totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        IVA Incluido
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onNavigateToCheckout}
                  className="w-full py-4 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Ir al Checkout y Pagar</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-500">
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pago protegido con Webpay Plus Transbank</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5200] shrink-0" />
                    <span>Garantía de calidad PetLife oficial</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Package className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Despacho seguro y seguimiento en línea</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
