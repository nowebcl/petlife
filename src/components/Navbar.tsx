import { useState, type FC, type FormEvent } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Logo } from './Logo.tsx';

interface NavbarProps {
  cartCount: number;
  onOpenCart?: () => void;
  onSearch?: (query: string) => void;
}

export const Navbar: FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onSearch,
}) => {
  const [activeTab, setActiveTab] = useState('Inicio');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['Inicio', 'Productos', 'Servicios', 'Nosotros', 'Contacto'];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <header className="w-full pt-2 sm:pt-4 md:pt-6 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto relative z-30">
      {/* ======================================================== */}
      {/* MOBILE TOP BAR (Exactly matching media_1790293110059.png) */}
      {/* ======================================================== */}
      <nav className="md:hidden bg-white rounded-3xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 flex items-center justify-between transition-all">
        {/* Left: Brand Logo (Restored Previous Illustrated Logo) */}
        <div className="flex items-center cursor-pointer select-none pl-1">
          <Logo className="h-11 sm:h-12 w-auto -my-1.5" />
        </div>

        {/* Right Actions: Search button, Cart with badge, Hamburger Menu */}
        <div className="flex items-center space-x-2">
          {/* Search Toggle / Input */}
          <div className="relative">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 -top-2 bg-white shadow-xl rounded-full pl-3 pr-1 py-1 flex items-center border border-slate-200 z-50 w-56 animate-in fade-in zoom-in-95 duration-200"
              >
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-xs outline-none bg-transparent text-[#061F3D] placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="p-1 text-white bg-[#FF5200] hover:bg-[#FF6508] rounded-full transition-colors"
                >
                  <Search className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Buscar productos"
                className="w-9 h-9 rounded-full bg-slate-100/90 text-[#061F3D] hover:bg-slate-200 active:scale-90 transition-all flex items-center justify-center focus:outline-none"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}
          </div>

          {/* Cart Button with circular orange badge */}
          <button
            onClick={onOpenCart}
            aria-label={`Carrito de compras con ${cartCount} productos`}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#061F3D] hover:bg-slate-100 active:scale-90 transition-all"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-0.5 bg-[#FF5200] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#061F3D] hover:bg-slate-100 active:scale-90 transition-all"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* DESKTOP TOP BAR (Wide navigation pill)                   */}
      {/* ======================================================== */}
      <nav className="hidden md:flex bg-white/95 backdrop-blur-md rounded-full px-6 md:px-8 py-2.5 md:py-3 shadow-pill border border-slate-100/80 items-center justify-between transition-all duration-300">
        {/* Left: Brand Logo */}
        <div className="flex items-center pl-1 sm:pl-2">
          <a href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF5200] rounded-full">
            <Logo className="h-14 sm:h-16 md:h-20 lg:h-[76px] -my-2.5 sm:-my-4" />
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="flex items-center space-x-7 text-[15px]">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative py-1 font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-[#061F3D]'
                    : 'text-[#637792] hover:text-[#061F3D]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF5200] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions (Search, Cart) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar productos"
            className="w-10 h-10 rounded-full bg-[#EAF9FD] text-[#061F3D] hover:bg-[#D4F3FB] active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none"
          >
            <Search className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`Carrito de compras con ${cartCount} productos`}
            className="relative p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all duration-200 flex items-center justify-center text-[#061F3D] focus:outline-none"
          >
            <ShoppingCart className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF5200] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white/98 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    isActive
                      ? 'bg-[#FFF2EA] text-[#FF5200]'
                      : 'text-[#637792] hover:bg-slate-50 hover:text-[#061F3D]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
