import { useState, type FC, type FormEvent } from 'react';
import { Search, ShoppingCart, X } from 'lucide-react';
import { Logo } from './Logo.tsx';

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

  return (
    <header className="w-full pt-2 sm:pt-4 md:pt-6 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto relative z-30">
      <nav className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 shadow-pill border border-slate-100/80 flex items-center justify-between transition-all duration-300">
        {/* Left: Brand Logo (Untouched, same position and style) */}
        <div className="flex items-center pl-0.5 sm:pl-1 shrink-0">
          <button
            onClick={() => handleTabChange('Inicio')}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF5200] rounded-full cursor-pointer bg-transparent border-0 p-0"
            aria-label="Ir a inicio PetLife"
          >
            <Logo className="h-10 sm:h-14 md:h-16 lg:h-[72px] w-auto -my-1 sm:-my-2.5 md:-my-3.5" />
          </button>
        </div>

        {/* Center: Elongated Search Bar ("Busca tu producto") */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 mx-2 sm:mx-6 md:mx-10 max-w-2xl"
        >
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca tu producto"
              className="w-full pl-8 sm:pl-11 pr-8 sm:pr-10 py-1.5 sm:py-2.5 md:py-3 bg-slate-100/60 hover:bg-slate-100/90 focus:bg-white text-xs sm:text-sm md:text-[15px] font-medium text-[#061F3D] placeholder:text-slate-400/60 focus:placeholder:text-slate-400/80 border border-slate-200/70 focus:border-[#FF5200] rounded-full outline-none transition-all duration-200 shadow-inner focus:shadow-xs focus:ring-2 focus:ring-[#FF5200]/20"
            />
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-400/70 absolute left-2.5 sm:left-4 pointer-events-none" />
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

        {/* Right: Solamente el carrito (No servicios, no nosotros) */}
        <div className="flex items-center shrink-0 pr-0.5 sm:pr-1">
          <button
            onClick={onOpenCart}
            aria-label={`Carrito de compras con ${cartCount} productos`}
            className="relative p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-slate-100 active:scale-95 transition-all duration-200 flex items-center justify-center text-[#061F3D] focus:outline-none cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] px-1 bg-[#FF5200] text-white text-[10px] sm:text-[11px] font-black rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-50 duration-200">
                {cartCount}
              </span>
            )}
            {cartCount === 0 && (
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
