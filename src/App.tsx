import { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductsSection, type Product } from './components/ProductsSection.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { ShoppingBag, CheckCircle2, X, Trash2, ArrowRight } from 'lucide-react';
import { Logo } from './components/Logo.tsx';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`¡Añadiste "${product.name}" al carrito! 🐕✨`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleScrollToProducts = () => {
    const el = document.getElementById('productos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    showToast(`Buscando: "${query}" 🔍`);
    handleScrollToProducts();
  };

  const handleFavoritesClick = () => {
    showToast('¡Guarda tus productos favoritos en PetLife! ❤️');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start selection:bg-[#FF5200] selection:text-white relative bg-[#F8FAFC] pb-14 md:pb-0">
      {/* Top Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 bg-[#061F3D] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center space-x-2.5 sm:space-x-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw] sm:max-w-md">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-1 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section Container (covers 100% full canvas with responsive mobile/desktop backgrounds) */}
      <div className="w-full min-h-[100dvh] sm:min-h-screen hero-canvas-bg flex flex-col justify-between relative overflow-x-hidden">
        {/* Main Navigation inside the Hero Canvas */}
        <Navbar
          cartCount={cartCount}
          onOpenCart={() => setIsCartModalOpen(true)}
          onSearch={handleSearch}
        />

        {/* Hero Section */}
        <main className="w-full flex-1 flex flex-col justify-end">
          <Hero
            onBuyClick={handleScrollToProducts}
            onExploreCategories={handleScrollToProducts}
          />
        </main>
      </div>

      {/* Products Section with Minimal Sidebar / Horizontal Mobile Chips */}
      <ProductsSection onAddToCart={handleAddToCart} />

      {/* Minimal Clean Footer */}
      <footer className="w-full bg-[#061F3D] text-white py-8 sm:py-12 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center space-x-3">
            <Logo className="h-8 sm:h-12" />
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-[#637792]">
            <button onClick={handleScrollToProducts} className="hover:text-white transition-colors">
              Alimentos
            </button>
            <button onClick={handleScrollToProducts} className="hover:text-white transition-colors">
              Snacks & Premios
            </button>
            <button onClick={handleScrollToProducts} className="hover:text-white transition-colors">
              Higiene
            </button>
            <a href="#" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>

          <p className="text-[11px] sm:text-xs text-[#637792] text-center sm:text-right">
            © {new Date().getFullYear()} PetLife Store. Todo para tu mascota.
          </p>
        </div>
      </footer>

      {/* Native App-Style Bottom Navigation Bar (Mobile only) */}
      <BottomNavBar
        cartCount={cartCount}
        onOpenCart={() => setIsCartModalOpen(true)}
        onScrollToTop={handleScrollToTop}
        onScrollToProducts={handleScrollToProducts}
        onFavoritesClick={handleFavoritesClick}
      />

      {/* Shopping Cart Drawer / Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setIsCartModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2.5 sm:p-3 bg-[#FFF2EA] text-[#FF5200] rounded-2xl">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#061F3D]">Tu Carrito</h3>
                <p className="text-[11px] sm:text-xs text-slate-500">{cartCount} artículo(s)</p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 sm:py-12 text-center text-slate-500">
                <div className="text-3xl sm:text-4xl mb-2">🛍️</div>
                <p className="text-sm sm:text-base font-bold text-[#061F3D]">Tu carrito está vacío</p>
                <p className="text-xs mt-1 text-slate-400">
                  ¡Explora el catálogo de alimentos y consiente a tu mascota!
                </p>
                <button
                  onClick={() => {
                    setIsCartModalOpen(false);
                    handleScrollToProducts();
                  }}
                  className="mt-4 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#FF5200] text-white text-xs font-bold shadow-orange-glow hover:bg-[#FF6508] transition-colors"
                >
                  Ver productos
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 sm:space-y-3 pr-1">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2.5 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center space-x-2.5 sm:space-x-3">
                      <div className="text-xl sm:text-2xl p-1.5 sm:p-2 bg-white rounded-xl shadow-xs">
                        {product.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#061F3D] max-w-[150px] sm:max-w-[200px] truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-slate-400 mt-0.5">
                          <span>${product.price.toFixed(2)} c/u</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-600">Cant: {quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="font-black text-xs sm:text-sm text-[#061F3D]">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="p-1 sm:p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">Subtotal:</span>
                  <span className="text-xl sm:text-2xl font-black text-[#061F3D]">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCartItems([]);
                    setIsCartModalOpen(false);
                    showToast('¡Gracias por tu compra! Tu pedido está en camino 🚚🐾');
                  }}
                  className="w-full py-3.5 sm:py-4 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-bold text-xs sm:text-sm text-center shadow-orange-glow transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceder al pago</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
