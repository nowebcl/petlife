import { useState, useMemo, type FC } from 'react';
import {
  Star,
  Search,
  SlidersHorizontal,
  Dog,
  Cat,
  Cookie,
  HeartPulse,
  Check,
  Plus,
  Heart,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';

import { PRODUCTS_DATABASE, type Product } from '../data/products.ts';
export type { Product } from '../data/products.ts';

const PRODUCTS: Product[] = PRODUCTS_DATABASE;

const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: LayoutGrid, count: PRODUCTS.length },
  { id: 'perros', label: 'Perros', icon: Dog, count: PRODUCTS.filter((p) => p.category === 'perros').length },
  { id: 'gatos', label: 'Gatos', icon: Cat, count: PRODUCTS.filter((p) => p.category === 'gatos').length },
  { id: 'higiene', label: 'Higiene', icon: HeartPulse, count: PRODUCTS.filter((p) => p.category === 'higiene').length },
  { id: 'snacks', label: 'Roedores & Snacks', icon: Cookie, count: PRODUCTS.filter((p) => p.category === 'snacks').length },
];


interface ProductsSectionProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onViewAll?: () => void;
}

export const ProductsSection: FC<ProductsSectionProps> = ({
  onAddToCart,
  onToggleFavorite,
  onSelectProduct,
  onViewAll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      const matchCategory = selectedCategory === 'todos' || prod.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleHeartToggle = (product: Product) => {
    setFavoriteIds((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
    if (onToggleFavorite) onToggleFavorite(product);
  };

  return (
    <section id="productos" className="w-full bg-white rounded-t-[32px] sm:rounded-t-[40px] pt-7 pb-12 sm:pb-24 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] border-t border-slate-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Top Badge & Link (Matches media_1790293110059.png) */}
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-black tracking-wider uppercase text-[#FF5200] bg-[#FFF2EA] px-3 py-1 rounded-full border border-orange-200/50">
            <span>🐾</span>
            <span>TIENDA PETLIFE</span>
          </div>

          <button
            onClick={() => {
              if (onViewAll) onViewAll();
              else {
                setSelectedCategory('todos');
                setSearchQuery('');
              }
            }}
            className="text-xs font-bold text-[#FF5200] hover:text-[#FF6508] flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
          >
            <span>Ver catálogo completo</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Section Heading */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#061F3D] tracking-tight leading-tight">
            Catálogo de Alimentos & Cuidados
          </h2>
          <p className="text-[#637792] text-xs sm:text-base mt-1 max-w-xl font-medium">
            Nutrición premium, premios y accesorios seleccionados para tu mascota.
          </p>
        </div>

        {/* Search & Sort Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar productos destacados..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs sm:text-sm text-[#061F3D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5200] focus:bg-white transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3 pointer-events-none" />
          </div>

          {/* Sort Control */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="hidden sm:inline text-xs font-bold text-slate-400">
              Ordenar por:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200/90 rounded-full px-3.5 py-2 text-xs font-bold text-[#061F3D] hover:bg-slate-50 active:scale-95 transition-all shadow-xs cursor-pointer outline-none focus:ring-2 focus:ring-[#FF5200] pr-8 appearance-none"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="rating">Top reseñas</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Chips: Horizontal Scroll on Mobile, Clean Wrap on Desktop */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible no-scrollbar flex sm:flex-wrap items-center gap-2 py-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5200] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                {/* Count Pill Badge */}
                <span
                  className={`w-4 h-4 rounded-full font-black text-[10px] flex items-center justify-center ${
                    isActive
                      ? 'bg-white text-[#FF5200]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid: 2 columns on mobile, 3 on tablet, 4 on desktop (more compact & organized) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
            <div className="text-3xl mb-2">🔍</div>
            <h4 className="text-base font-bold text-[#061F3D]">No encontramos productos</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Prueba cambiando la categoría seleccionada o buscando con otros términos.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#061F3D] text-white text-xs font-bold hover:bg-[#1B3A63] transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const isAdded = addedIds[product.id];
              const isFav = favoriteIds[product.id];
              const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
              const discountPercent = hasDiscount && product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <article
                  key={product.id}
                  onClick={() => onSelectProduct?.(product)}
                  className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
                >
                  <div>
                    {/* Realistic Product Package Image Container */}
                    <div className="relative w-full aspect-square rounded-xl bg-slate-50/80 p-2 overflow-hidden mb-2 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      {/* Top Badges (Discount + Promo Badge) */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                        {hasDiscount && (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-rose-500 text-white shadow-xs">
                            -{discountPercent}% OFF
                          </span>
                        )}
                        {product.badge && (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase bg-[#FF5200] text-white shadow-xs truncate max-w-[110px]">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Floating Wishlist Heart Button Top Right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHeartToggle(product);
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-xs border border-slate-100 flex items-center justify-center active:scale-75 transition-all cursor-pointer"
                        aria-label="Agregar a favoritos"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-slate-300 stroke-[1.8]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Category Label */}
                    <div className="mb-0.5">
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FF5200] uppercase tracking-wider block truncate">
                        {product.categoryLabel}
                      </span>
                    </div>

                    {/* Product Title (Strictly fixed height for perfect grid alignment on PC) */}
                    <h4 className="text-xs sm:text-sm font-bold text-[#061F3D] leading-snug group-hover:text-[#FF5200] transition-colors line-clamp-2 h-8 sm:h-9">
                      {product.name}
                    </h4>

                    {/* Weight & Rating */}
                    <div className="flex items-center justify-between mt-1 text-[10px] sm:text-xs text-[#637792]">
                      <span className="font-semibold text-slate-400">{product.weightOrSize}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#061F3D]">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Price & Add CTA (Always aligned to bottom) */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-sm sm:text-base font-black text-[#061F3D]">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Add Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(product);
                      }}
                      className={`py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full font-bold text-xs flex items-center justify-center space-x-1 transition-all duration-200 active:scale-90 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-[#061F3D] hover:bg-[#FF5200] text-white shadow-xs'
                      }`}
                      aria-label={`Añadir ${product.name} al carrito`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span className="hidden sm:inline text-[11px]">Listo</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                          <span className="hidden sm:inline text-[11px]">Añadir</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Explore Full Catalog Button Banner */}
        <div className="mt-10 sm:mt-14 text-center bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="text-lg sm:text-xl font-black text-[#061F3D]">
              ¿Buscas más opciones para tu regalón?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Descubre más de 20 productos con filtros por etapa, tipo de mascota, marca y ofertas exclusivas.
            </p>
          </div>

          <button
            onClick={() => onViewAll?.()}
            className="shrink-0 inline-flex items-center space-x-2 px-6 sm:px-8 py-3.5 rounded-full bg-[#061F3D] hover:bg-[#FF5200] text-white font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Ver Catálogo Completo</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </section>
  );
};
