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

export type ViewMode = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'admin';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
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

    // Keyboard shortcut: Ctrl + Alt + A toggles Admin Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'home' : 'admin'));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCatalog = (category: string = 'todos', query: string = '') => {
    setCatalogCategory(category);
    setCatalogSearchQuery(query);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCart = () => {
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
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
    <div className="min-h-screen w-full flex flex-col justify-between selection:bg-[#FF5200] selection:text-white relative bg-[#F8FAFC]">
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
                  onClick={handleNavigateToAdmin}
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
        </>
      )}
    </div>
  );
}
