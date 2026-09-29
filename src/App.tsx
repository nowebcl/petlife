import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductsSection } from './components/ProductsSection.tsx';
import { CatalogSection } from './components/CatalogSection.tsx';
import { ProductDetailSection } from './components/ProductDetailSection.tsx';
import { PRODUCTS_DATABASE, type Product, formatPrice } from './data/products.ts';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { ShoppingBag, CheckCircle2, X, Trash2, ArrowRight } from 'lucide-react';
import { Logo } from './components/Logo.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { fetchAllProducts } from './services/pocketbase.ts';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<string>('todos');

  // Live products from PocketBase database (falls back to local database)
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATABASE);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

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

  const refreshProducts = async () => {
    try {
      const live = await fetchAllProducts();
      if (live && live.length > 0) {
        setProducts(live);
      }
    } catch (err) {
      console.error('Error fetching live products from PocketBase:', err);
    }
  };

  useEffect(() => {
    refreshProducts();

    // Keyboard shortcut: Ctrl + Alt + A opens Admin Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const addQty = quantity > 0 ? quantity : 1;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      }
      return [...prev, { product, quantity: addQty }];
    });
    showToast(`¡Añadiste ${addQty > 1 ? `${addQty}x ` : ''}"${product.name}" al carrito! 🐕✨`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCatalog = (category: string = 'todos', query: string = '') => {
    setCatalogCategory(category);
    setCatalogSearchQuery(query);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    handleNavigateToCatalog('todos', query);
  };

  const handleSelectTab = (tab: string) => {
    if (tab === 'Inicio') {
      handleNavigateToHome();
    } else if (tab === 'Productos') {
      handleNavigateToCatalog();
    } else {
      showToast(`Sección ${tab}: ¡Próximamente disponible! 🐾`);
    }
  };

  const handleFavoritesClick = () => {
    showToast('¡Guarda tus productos favoritos en PetLife! ❤️');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start selection:bg-[#FF5200] selection:text-white relative bg-[#F8FAFC] pb-16 md:pb-0">
      {/* Top Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 bg-[#061F3D] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center space-x-2.5 sm:space-x-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw] sm:max-w-md">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-1 shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: HOME VIEW (HERO CANVAS + FEATURED PRODUCTS)       */}
      {/* ======================================================== */}
      {currentView === 'home' && (
        <>
          {/* Hero Section Container (covers 100% full canvas with approved layout) */}
          <div className="w-full min-h-[100dvh] sm:min-h-screen hero-canvas-bg flex flex-col justify-between relative overflow-x-hidden">
            {/* Main Navigation inside the Hero Canvas */}
            <Navbar
              cartCount={cartCount}
              onOpenCart={() => setIsCartModalOpen(true)}
              onSearch={handleSearch}
              activeTab="Inicio"
              onSelectTab={handleSelectTab}
            />

            {/* Hero Section */}
            <main className="w-full flex-1 flex flex-col justify-end">
              <Hero
                onBuyClick={() => handleNavigateToCatalog()}
                onExploreCategories={() => handleNavigateToCatalog()}
              />
            </main>
          </div>

          {/* Featured Products Section with direct navigation to singular product & catalog */}
          <ProductsSection
            products={products}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onSelectProduct={handleSelectProduct}
            onViewAll={() => handleNavigateToCatalog()}
          />
        </>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: COMPLETE CATALOG SECTION (PLP WITH ADVANCED FILTERS) */}
      {/* ======================================================== */}
      {currentView === 'catalog' && (
        <>
          {/* Top Sticky Header for Catalog */}
          <div className="w-full bg-[#061F3D] py-2 sm:py-3 shadow-md sticky top-0 z-40">
            <Navbar
              cartCount={cartCount}
              onOpenCart={() => setIsCartModalOpen(true)}
              onSearch={handleSearch}
              activeTab="Productos"
              onSelectTab={handleSelectTab}
            />
          </div>

          {/* Full Catalog Component */}
          <CatalogSection
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onToggleFavorite={() => handleFavoritesClick()}
            initialCategory={catalogCategory}
            initialSearchQuery={catalogSearchQuery}
          />
        </>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: SINGULAR PRODUCT DETAIL VIEW (PDP)               */}
      {/* ======================================================== */}
      {currentView === 'product' && selectedProduct && (
        <>
          {/* Top Sticky Header for Product Detail */}
          <div className="w-full bg-[#061F3D] py-2 sm:py-3 shadow-md sticky top-0 z-40">
            <Navbar
              cartCount={cartCount}
              onOpenCart={() => setIsCartModalOpen(true)}
              onSearch={handleSearch}
              activeTab="Productos"
              onSelectTab={handleSelectTab}
            />
          </div>

          {/* Singular Product View */}
          <ProductDetailSection
            product={selectedProduct}
            allProducts={products}
            onBackToCatalog={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={(product, quantity) => handleAddToCart(product, quantity)}
            onSelectProduct={handleSelectProduct}
            onOpenCart={() => setIsCartModalOpen(true)}
          />
        </>
      )}

      {/* Global Minimal Clean Footer */}
      <footer className="w-full bg-[#061F3D] text-white py-8 sm:py-12 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div
            onClick={handleNavigateToHome}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <Logo className="h-8 sm:h-12" />
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-[#637792]">
            <button
              onClick={() => handleNavigateToCatalog('perros')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Alimentos
            </button>
            <button
              onClick={() => handleNavigateToCatalog('snacks')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Snacks & Premios
            </button>
            <button
              onClick={() => handleNavigateToCatalog('higiene')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Higiene
            </button>
            <button
              onClick={() => handleNavigateToCatalog()}
              className="hover:text-white transition-colors cursor-pointer font-bold text-[#FF5200]"
            >
              Catálogo Completo
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center space-x-1.5 text-slate-400 hover:text-white text-xs font-bold bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60"
              title="Panel de Administración (o presiona Ctrl+Alt+A)"
            >
              <span>🔒</span>
              <span>Admin PetLife</span>
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-[#637792] text-center sm:text-right">
            © {new Date().getFullYear()} PetLife Store. Todo para tu mascota.
          </p>
        </div>
      </footer>

      {/* Native App-Style Bottom Navigation Bar (Mobile only) */}
      <BottomNavBar
        cartCount={cartCount}
        activeTab={currentView === 'home' ? 'inicio' : 'catalogo'}
        onOpenCart={() => setIsCartModalOpen(true)}
        onScrollToTop={handleNavigateToHome}
        onScrollToProducts={() => handleNavigateToCatalog()}
        onFavoritesClick={handleFavoritesClick}
        onSelectTab={(tab) => {
          if (tab === 'inicio') handleNavigateToHome();
          if (tab === 'catalogo') handleNavigateToCatalog();
        }}
      />

      {/* Shopping Cart Drawer / Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setIsCartModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
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
                    handleNavigateToCatalog();
                  }}
                  className="mt-4 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#FF5200] text-white text-xs font-bold shadow-orange-glow hover:bg-[#FF6508] transition-colors cursor-pointer"
                >
                  Ver catálogo completo
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 sm:space-y-3 pr-1">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2.5 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div
                      onClick={() => {
                        setIsCartModalOpen(false);
                        handleSelectProduct(product);
                      }}
                      className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-100 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/product-dog-food.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#061F3D] group-hover:text-[#FF5200] transition-colors max-w-[150px] sm:max-w-[200px] truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-slate-400 mt-0.5">
                          <span>{formatPrice(product.price)} c/u</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-600">Cant: {quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="font-black text-xs sm:text-sm text-[#061F3D]">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="p-1 sm:p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartModalOpen(false);
                    setIsCheckoutOpen(true);
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

      {/* Admin Panel Modal / Dashboard */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          onRefreshProducts={refreshProducts}
        />
      )}

      {/* Checkout & Transbank Webpay Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        cartSubtotal={cartSubtotal}
        onOrderSuccess={(orderNum) => {
          setCartItems([]);
          showToast(`¡Pedido ${orderNum} registrado con éxito! 🐾`);
        }}
      />
    </div>
  );
}
