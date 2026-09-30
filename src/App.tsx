import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductsSection } from './components/ProductsSection.tsx';
import { CatalogSection } from './components/CatalogSection.tsx';
import { ProductDetailSection } from './components/ProductDetailSection.tsx';
import { CartPage } from './components/CartPage.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { PRODUCTS_DATABASE, type Product } from './data/products.ts';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { CheckCircle2, X } from 'lucide-react';
import { Logo } from './components/Logo.tsx';
import { fetchAllProducts } from './services/pocketbase.ts';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';

export type ViewMode = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'admin';

interface CartItem {
  product: Product;
  quantity: number;
}

const getInitialView = (): ViewMode => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || search.includes('admin')) {
    return 'admin';
  }
  if (path === '/cart' || hash === '#cart') return 'cart';
  if (
    path === '/checkout' ||
    hash === '#checkout' ||
    search.includes('flow_return') ||
    search.includes('status=') ||
    search.includes('order=')
  ) {
    return 'checkout';
  }
  if (path === '/catalog' || hash === '#catalog') return 'catalog';
  return 'home';
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(getInitialView);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<string>('todos');

  // Live products from PocketBase database (falls back to local database)
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATABASE);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4200);
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

  const updateUrl = (urlPath: string) => {
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== urlPath && window.location.hash !== `#${urlPath.replace('/', '')}`) {
        window.history.pushState(null, '', urlPath);
      }
    } catch {
      // Fallback if pushState fails
    }
  };

  useEffect(() => {
    refreshProducts();

    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || search.includes('admin')) {
        setCurrentView('admin');
      } else if (path === '/cart' || hash === '#cart') {
        setCurrentView('cart');
      } else if (
        path === '/checkout' ||
        hash === '#checkout' ||
        search.includes('flow_return') ||
        search.includes('status=') ||
        search.includes('order=')
      ) {
        setCurrentView('checkout');
      } else if (path === '/catalog' || hash === '#catalog') {
        setCurrentView('catalog');
      } else {
        setCurrentView('home');
      }
    };

    // Keyboard shortcut: Ctrl + Alt + A toggles Admin Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView((prev) => {
          if (prev === 'admin') {
            updateUrl('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return 'home';
          } else {
            updateUrl('/admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return 'admin';
          }
        });
      }
    };

    // Expose convenient global helper for owner if needed
    (window as any).petLifeAdmin = () => {
      setCurrentView('admin');
      updateUrl('/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      delete (window as any).petLifeAdmin;
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
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

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
    updateUrl('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCatalog = (category: string = 'todos', query: string = '') => {
    setCatalogCategory(category);
    setCatalogSearchQuery(query);
    setCurrentView('catalog');
    updateUrl('/catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCart = () => {
    setCurrentView('cart');
    updateUrl('/cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCheckout = () => {
    setCurrentView('checkout');
    updateUrl('/checkout');
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

  // Determine active tab for BottomNavBar
  const bottomNavActiveTab: 'inicio' | 'catalogo' | 'carrito' | 'favoritos' | undefined =
    currentView === 'home'
      ? 'inicio'
      : currentView === 'catalog'
      ? 'catalogo'
      : currentView === 'cart'
      ? 'carrito'
      : undefined;

  // Global Storefront Navigation Header (used across catalog and product views)
  const renderStickyHeader = (activeTabName: string = 'Productos') => (
    <div className="w-full bg-[#061F3D] py-2 sm:py-3 shadow-md sticky top-0 z-40">
      <Navbar
        cartCount={cartCount}
        onOpenCart={handleNavigateToCart}
        onSearch={handleSearch}
        activeTab={activeTabName}
        onSelectTab={handleSelectTab}
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#FF5200] selection:text-white relative bg-[#F8FAFC]">
      {/* Top Floating Notification Toast / Minimal Quick Cart Action */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 bg-[#061F3D]/95 backdrop-blur-md text-white pl-4 pr-2.5 sm:pl-5 sm:pr-3 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center space-x-2.5 sm:space-x-3 border border-slate-700/80 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[95vw] sm:max-w-lg">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate flex-1">{toastMessage}</span>
          <button
            onClick={() => {
              setToastMessage(null);
              handleNavigateToCart();
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white text-xs font-black shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center space-x-1.5"
          >
            <span>Ir al Carrito</span>
            <span className="text-[11px]">→</span>
          </button>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 shrink-0 cursor-pointer transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW: ADMIN PANEL (FULL SCREEN DEDICATED VIEW)           */}
      {/* ======================================================== */}
      {currentView === 'admin' ? (
        <AdminPanel
          onClose={handleNavigateToHome}
          onRefreshProducts={refreshProducts}
        />
      ) : (
        <>
          <div className="w-full flex-1 flex flex-col">
            {/* ======================================================== */}
            {/* VIEW 1: HOME VIEW (HERO CANVAS + FEATURED PRODUCTS)       */}
            {/* ======================================================== */}
            {currentView === 'home' && (
              <>
                <div className="w-full min-h-[100dvh] sm:min-h-screen hero-canvas-bg flex flex-col justify-between relative overflow-x-hidden">
                  <Navbar
                    cartCount={cartCount}
                    onOpenCart={handleNavigateToCart}
                    onSearch={handleSearch}
                    activeTab="Inicio"
                    onSelectTab={handleSelectTab}
                  />

                  <main className="w-full flex-1 flex flex-col justify-end">
                    <Hero
                      onBuyClick={() => handleNavigateToCatalog()}
                      onExploreCategories={() => handleNavigateToCatalog()}
                    />
                  </main>
                </div>

                <ProductsSection
                  products={products}
                  onAddToCart={(product) => handleAddToCart(product, 1)}
                  onSelectProduct={handleSelectProduct}
                  onViewAll={() => handleNavigateToCatalog()}
                />
              </>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: COMPLETE CATALOG SECTION (PLP FULL PAGE)         */}
            {/* ======================================================== */}
            {currentView === 'catalog' && (
              <>
                {renderStickyHeader('Productos')}
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
            {/* VIEW 3: SINGULAR PRODUCT DETAIL VIEW (PDP FULL PAGE)     */}
            {/* ======================================================== */}
            {currentView === 'product' && selectedProduct && (
              <>
                {renderStickyHeader('Productos')}
                <ProductDetailSection
                  product={selectedProduct}
                  allProducts={products}
                  onBackToCatalog={() => {
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={(product, quantity) => handleAddToCart(product, quantity)}
                  onSelectProduct={handleSelectProduct}
                  onOpenCart={handleNavigateToCart}
                />
              </>
            )}

            {/* ======================================================== */}
            {/* VIEW 4: CART FULL PAGE (NO POPUP)                        */}
            {/* ======================================================== */}
            {currentView === 'cart' && (
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onNavigateToCatalog={() => handleNavigateToCatalog()}
                onNavigateToCheckout={handleNavigateToCheckout}
                onSelectProduct={handleSelectProduct}
                onNavigateToHome={handleNavigateToHome}
              />
            )}

            {/* ======================================================== */}
            {/* VIEW 5: CHECKOUT FULL PAGE (NO POPUP)                    */}
            {/* ======================================================== */}
            {currentView === 'checkout' && (
              <CheckoutPage
                cartItems={cartItems}
                onOrderSuccess={(orderNum) => {
                  setCartItems([]);
                  showToast(`¡Pedido ${orderNum} registrado con éxito! 🐾`);
                }}
                onNavigateToCart={handleNavigateToCart}
                onNavigateToHome={handleNavigateToHome}
              />
            )}
          </div>

          {/* Global Storefront Minimal Clean Footer */}
          <footer className="w-full bg-[#061F3D] text-white pt-8 sm:pt-12 pb-28 sm:pb-12 px-4 sm:px-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-5 sm:space-y-0 sm:flex-row sm:justify-between sm:gap-6 text-center sm:text-left">
              <div
                onClick={handleNavigateToHome}
                className="flex items-center justify-center cursor-pointer select-none"
              >
                <Logo className="h-9 sm:h-12" />
              </div>

              <nav className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-[#8BA0B8]">
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
              </nav>

              <div className="flex flex-col items-center sm:items-end space-y-1 text-center sm:text-right">
                <p className="text-[11px] sm:text-xs text-[#637792]">
                  © {new Date().getFullYear()} PetLife Store. Todo para tu mascota.
                </p>
                <p className="text-[11px] sm:text-xs text-[#637792]">
                  Desarrollado por{' '}
                  <a
                    href="https://www.instagram.com/noweb.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#8BA0B8] hover:text-[#FF5200] transition-colors underline decoration-slate-700 hover:decoration-[#FF5200] underline-offset-2 cursor-pointer"
                  >
                    noweb.dev
                  </a>
                </p>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation Bar (Hidden on checkout to keep funnel clean) */}
          {currentView !== 'checkout' && (
            <BottomNavBar
              cartCount={cartCount}
              activeTab={bottomNavActiveTab}
              onOpenCart={handleNavigateToCart}
              onScrollToTop={handleNavigateToHome}
              onScrollToProducts={() => handleNavigateToCatalog()}
              onFavoritesClick={handleFavoritesClick}
              onSelectTab={(tab) => {
                if (tab === 'inicio') handleNavigateToHome();
                if (tab === 'catalogo') handleNavigateToCatalog();
                if (tab === 'carrito') handleNavigateToCart();
              }}
            />
          )}

          {/* Direct Floating WhatsApp Contact Button (+56 9 8253 5868) */}
          <FloatingWhatsApp />
        </>
      )}
    </div>
  );
}
