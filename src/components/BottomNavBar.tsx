import { useState, type FC } from 'react';
import { Home, LayoutGrid, ShoppingBag, Heart } from 'lucide-react';

interface BottomNavBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollToTop: () => void;
  onScrollToProducts: () => void;
  onFavoritesClick: () => void;
  activeTab?: 'inicio' | 'catalogo' | 'carrito' | 'favoritos';
  onSelectTab?: (tab: 'inicio' | 'catalogo' | 'carrito' | 'favoritos') => void;
}

export const BottomNavBar: FC<BottomNavBarProps> = ({
  cartCount,
  onOpenCart,
  onScrollToTop,
  onScrollToProducts,
  onFavoritesClick,
  activeTab: activeTabProp,
  onSelectTab,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'inicio' | 'catalogo' | 'carrito' | 'favoritos'>('inicio');
  const activeTab = activeTabProp !== undefined ? activeTabProp : internalActiveTab;

  const handleTabClick = (tab: 'inicio' | 'catalogo' | 'carrito' | 'favoritos') => {
    setInternalActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
    if (tab === 'inicio') onScrollToTop();
    if (tab === 'catalogo') onScrollToProducts();
    if (tab === 'carrito') onOpenCart();
    if (tab === 'favoritos') onFavoritesClick();
  };

  return (
    <nav
      aria-label="Navegación móvil inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl border-t border-slate-200/90 px-6 pt-2 pb-2.5 flex items-center justify-between shadow-[0_-8px_30px_rgba(6,31,61,0.08)] select-none safe-area-bottom"
    >
      {/* Home / Inicio */}
      <button
        onClick={() => handleTabClick('inicio')}
        className={`flex flex-col items-center justify-center p-1.5 transition-all active:scale-90 cursor-pointer ${
          activeTab === 'inicio' ? 'text-[#FF5200]' : 'text-slate-400 hover:text-[#061F3D]'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'inicio' ? 'stroke-[2.5] fill-[#FF5200]' : 'stroke-[2]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'inicio' ? 'font-black text-[#FF5200]' : 'font-bold text-slate-500'}`}>
          Inicio
        </span>
      </button>

      {/* Catálogo / Productos */}
      <button
        onClick={() => handleTabClick('catalogo')}
        className={`flex flex-col items-center justify-center p-1.5 transition-all active:scale-90 cursor-pointer ${
          activeTab === 'catalogo' ? 'text-[#FF5200]' : 'text-slate-400 hover:text-[#061F3D]'
        }`}
      >
        <LayoutGrid className={`w-5 h-5 ${activeTab === 'catalogo' ? 'stroke-[2.5] fill-[#FF5200]' : 'stroke-[2]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'catalogo' ? 'font-black text-[#FF5200]' : 'font-bold text-slate-500'}`}>
          Catálogo
        </span>
      </button>

      {/* Carrito con badge dinámico */}
      <button
        onClick={() => handleTabClick('carrito')}
        className={`flex flex-col items-center justify-center p-1.5 transition-all active:scale-90 cursor-pointer relative ${
          activeTab === 'carrito' ? 'text-[#FF5200]' : 'text-slate-400 hover:text-[#061F3D]'
        }`}
      >
        <div className="relative">
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'carrito' ? 'stroke-[2.5] fill-[#FF5200]' : 'stroke-[2]'}`} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 bg-[#FF5200] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'carrito' ? 'font-black text-[#FF5200]' : 'font-bold text-slate-500'}`}>
          Carrito
        </span>
      </button>

      {/* Favoritos */}
      <button
        onClick={() => handleTabClick('favoritos')}
        className={`flex flex-col items-center justify-center p-1.5 transition-all active:scale-90 cursor-pointer ${
          activeTab === 'favoritos' ? 'text-[#FF5200]' : 'text-slate-400 hover:text-[#061F3D]'
        }`}
      >
        <Heart className={`w-5 h-5 ${activeTab === 'favoritos' ? 'stroke-[2.5] fill-[#FF5200]' : 'stroke-[2]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'favoritos' ? 'font-black text-[#FF5200]' : 'font-bold text-slate-500'}`}>
          Favoritos
        </span>
      </button>
    </nav>
  );
};
