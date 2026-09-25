import { useState, type FC } from 'react';
import { Home, LayoutGrid, ShoppingBag, Heart } from 'lucide-react';

interface BottomNavBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollToTop: () => void;
  onScrollToProducts: () => void;
  onFavoritesClick: () => void;
}

export const BottomNavBar: FC<BottomNavBarProps> = ({
  cartCount,
  onOpenCart,
  onScrollToTop,
  onScrollToProducts,
  onFavoritesClick,
}) => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'catalogo' | 'carrito' | 'favoritos'>('inicio');

  const handleTabClick = (tab: 'inicio' | 'catalogo' | 'carrito' | 'favoritos') => {
    setActiveTab(tab);
    if (tab === 'inicio') onScrollToTop();
    if (tab === 'catalogo') onScrollToProducts();
    if (tab === 'carrito') onOpenCart();
    if (tab === 'favoritos') onFavoritesClick();
  };

  return (
    <nav
      aria-label="Navegación móvil inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md rounded-t-3xl border-t border-slate-100/90 px-6 py-2.5 flex items-center justify-between shadow-[0_-4px_24px_rgba(6,31,61,0.06)] select-none safe-area-bottom"
    >
      {/* Home / Inicio */}
      <button
        onClick={() => handleTabClick('inicio')}
        className={`flex flex-col items-center justify-center p-1 transition-all active:scale-90 ${
          activeTab === 'inicio' ? 'text-[#061F3D]' : 'text-[#637792] hover:text-[#061F3D]'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'inicio' ? 'stroke-[2.5] fill-[#061F3D]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-0.5 ${activeTab === 'inicio' ? 'font-black' : 'font-medium'}`}>
          Inicio
        </span>
      </button>

      {/* Catálogo / Productos */}
      <button
        onClick={() => handleTabClick('catalogo')}
        className={`flex flex-col items-center justify-center p-1 transition-all active:scale-90 ${
          activeTab === 'catalogo' ? 'text-[#061F3D]' : 'text-[#637792] hover:text-[#061F3D]'
        }`}
      >
        <LayoutGrid className={`w-5 h-5 ${activeTab === 'catalogo' ? 'stroke-[2.5] fill-[#061F3D]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-0.5 ${activeTab === 'catalogo' ? 'font-black' : 'font-medium'}`}>
          Catálogo
        </span>
      </button>

      {/* Carrito con badge dinámico */}
      <button
        onClick={() => handleTabClick('carrito')}
        className={`flex flex-col items-center justify-center p-1 transition-all active:scale-90 relative ${
          activeTab === 'carrito' ? 'text-[#061F3D]' : 'text-[#637792] hover:text-[#061F3D]'
        }`}
      >
        <div className="relative">
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'carrito' ? 'stroke-[2.5] fill-[#061F3D]' : 'stroke-[1.8]'}`} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-0.5 bg-[#FF5200] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] mt-0.5 ${activeTab === 'carrito' ? 'font-black' : 'font-medium'}`}>
          Carrito
        </span>
      </button>

      {/* Favoritos */}
      <button
        onClick={() => handleTabClick('favoritos')}
        className={`flex flex-col items-center justify-center p-1 transition-all active:scale-90 ${
          activeTab === 'favoritos' ? 'text-[#061F3D]' : 'text-[#637792] hover:text-[#061F3D]'
        }`}
      >
        <Heart className={`w-5 h-5 ${activeTab === 'favoritos' ? 'stroke-[2.5] fill-[#061F3D]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-0.5 ${activeTab === 'favoritos' ? 'font-black' : 'font-medium'}`}>
          Favoritos
        </span>
      </button>
    </nav>
  );
};

