import { useState, type FC, type FormEvent } from 'react';
import { Search, ShoppingCart, X } from 'lucide-react';
import { Logo } from './Logo.tsx';
import { WhatsAppIcon } from './FloatingWhatsApp.tsx';

interface NavbarProps {
  cartCount: number;
  onOpenCart?: () => void;
  onSearch?: (query: string) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onSearch,
  onSelectTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const whatsappUrl =
    'https://wa.me/56982535868?text=' +
    encodeURIComponent('¡Hola PetLife! 🐾 Me gustaría consultar sobre sus productos y despachos.');

  return (
    <header className="w-full pt-1.5 sm:pt-4 md:pt-6 px-2.5 sm:px-6 md:px-8 max-w-7xl mx-auto relative z-30">
      <nav className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 shadow-pill border border-slate-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 transition-all duration-300">
        
        {/* Top Row on Mobile / Left Section on Desktop */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
          {/* Brand Logo (Crisp, proportional, zero negative margin glitches) */}
          <button
            onClick={() => handleTabChange('Inicio')}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF5200] rounded-xl cursor-pointer bg-transparent border-0 p-0"
            aria-label="Ir a inicio PetLife"
          >
            <Logo className="h-8 sm:h-12 md:h-14 lg:h-16 w-auto" />
          </button>

          {/* Quick Actions (WhatsApp & Cart) visible on mobile header row */}
          <div className="flex sm:hidden items-center space-x-1.5">
            {/* WhatsApp Quick Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Chat de WhatsApp con PetLife (+56 9 8253 5868)"
              title="Escríbenos por WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label={`Carrito de compras con ${cartCount} productos`}
              className="relative p-2 rounded-full hover:bg-slate-100 active:scale-90 transition-all flex items-center justify-center text-[#061F3D] cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2]" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF5200] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Search Bar ("Busca tu producto") - Full width on mobile, elongated center on desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full sm:flex-1 sm:mx-4 md:mx-8 sm:max-w-2xl"
        >
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca tu producto"
              className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-1.5 sm:py-2.5 md:py-3 bg-slate-100/70 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm md:text-[15px] font-medium text-[#061F3D] placeholder:text-slate-400/80 focus:placeholder:text-slate-500 border border-slate-200/80 focus:border-[#FF5200] rounded-full outline-none transition-all duration-200 shadow-inner focus:shadow-xs focus:ring-2 focus:ring-[#FF5200]/20"
            />
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-400 absolute left-3 sm:left-4 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 sm:right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Right Section: Desktop only actions (WhatsApp + Shopping Cart) */}
        <div className="hidden sm:flex items-center space-x-2 shrink-0 pr-1">
          {/* WhatsApp Direct Chat Desktop */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 rounded-full text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Contactar por WhatsApp (+56 9 8253 5868)"
            title="WhatsApp: +56 9 8253 5868"
          >
            <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* Cart Button Desktop */}
          <button
            onClick={onOpenCart}
            aria-label={`Carrito de compras con ${cartCount} productos`}
            className="relative p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-slate-100 active:scale-95 transition-all duration-200 flex items-center justify-center text-[#061F3D] focus:outline-none cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] px-1 bg-[#FF5200] text-white text-[10px] sm:text-[11px] font-black rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-50 duration-200">
                {cartCount}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 min-w-[17px] sm:min-w-[18px] h-[17px] sm:h-[18px] px-0.5 bg-slate-300 text-slate-700 text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            )}
          </button>
        </div>

      </nav>
    </header>
  );
};
