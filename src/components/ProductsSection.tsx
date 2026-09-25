import { useState, useMemo, type FC } from 'react';
import {
  Star,
  Search,
  SlidersHorizontal,
  Dog,
  Cat,
  Cookie,
  HeartPulse,
  Gamepad2,
  Check,
  Plus,
  Heart,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: 'perros' | 'gatos' | 'snacks' | 'higiene' | 'juguetes';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  weightOrSize: string;
  icon: string;
  bgGradient: string;
  description: string;
  imageUrl: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'NutriPet Pro Adult - Salmón & Arroz',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 62.90,
    originalPrice: 74.00,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Más vendido',
    weightOrSize: '15 kg',
    icon: '🐕',
    bgGradient: 'from-amber-500/10 to-orange-500/10 text-orange-600',
    description: 'Fórmula balanceada con omega 3 y 6 para pelaje brillante.',
    imageUrl: '/product-dog-food.jpg',
  },
  {
    id: 'prod-2',
    name: 'Felina Gourmet Pouch - Salmón & Atún',
    category: 'gatos',
    categoryLabel: 'Gatos',
    price: 21.50,
    originalPrice: 26.00,
    rating: 4.8,
    reviewsCount: 89,
    badge: 'Recomendado',
    weightOrSize: '12 x 85g',
    icon: '🐱',
    bgGradient: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
    description: 'Trozos tiernos en salsa con taurina y vitaminas para una digestión óptima.',
    imageUrl: '/product-cat-food.jpg',
  },
  {
    id: 'prod-3',
    name: 'MaxiPuppy Growth - Pollo Orgánico',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 68.00,
    originalPrice: 79.99,
    rating: 5.0,
    reviewsCount: 65,
    badge: 'Orgánico',
    weightOrSize: '12 kg',
    icon: '🦴',
    bgGradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
    description: 'Formulado para cachorros en crecimiento activo y defensas fuertes.',
    imageUrl: '/product-puppy-food.jpg',
  },
  {
    id: 'prod-4',
    name: 'DentalChew Huesitos Pro-Dientes Clorofila',
    category: 'snacks',
    categoryLabel: 'Snacks',
    price: 14.20,
    rating: 4.9,
    reviewsCount: 340,
    badge: 'Dental',
    weightOrSize: 'x10 un.',
    icon: '🦷',
    bgGradient: 'from-orange-500/10 to-amber-500/10 text-orange-600',
    description: 'Reduce el sarro y mantiene un aliento fresco de forma 100% natural.',
    imageUrl: '/product-dental.jpg',
  },
  {
    id: 'prod-5',
    name: 'Royal Cat Urinary Care Especial',
    category: 'gatos',
    categoryLabel: 'Gatos',
    price: 54.00,
    rating: 4.9,
    reviewsCount: 115,
    weightOrSize: '7.5 kg',
    icon: '🐟',
    bgGradient: 'from-indigo-500/10 to-blue-500/10 text-indigo-600',
    description: 'Cuidado específico para el tracto urinario con minerales balanceados.',
    imageUrl: '/product-urinary.jpg',
  },
  {
    id: 'prod-6',
    name: 'Churu Puré Atún & Pollo Cremoso',
    category: 'snacks',
    categoryLabel: 'Snacks',
    price: 18.90,
    originalPrice: 22.50,
    rating: 5.0,
    reviewsCount: 420,
    badge: 'Favorito',
    weightOrSize: 'x20 tubos',
    icon: '🍗',
    bgGradient: 'from-rose-500/10 to-orange-500/10 text-rose-600',
    description: 'Snack cremoso de alta hidratación que todos los gatos adoran.',
    imageUrl: '/product-churu.jpg',
  },
  {
    id: 'prod-7',
    name: 'Shampoo Natural Avena & Aloe Suave',
    category: 'higiene',
    categoryLabel: 'Salud',
    price: 16.50,
    rating: 4.8,
    reviewsCount: 98,
    weightOrSize: '500 ml',
    icon: '🛁',
    bgGradient: 'from-teal-500/10 to-emerald-500/10 text-teal-600',
    description: 'pH neutro para pieles sensibles, calma el picor y deja aroma fresco.',
    imageUrl: '/product-shampoo.jpg',
  },
  {
    id: 'prod-8',
    name: 'Juguete Pelota & Cuerda Resistente',
    category: 'juguetes',
    categoryLabel: 'Juguetes',
    price: 18.99,
    originalPrice: 24.00,
    rating: 4.7,
    reviewsCount: 74,
    badge: 'Interactivo',
    weightOrSize: 'Medium',
    icon: '🎾',
    bgGradient: 'from-purple-500/10 to-indigo-500/10 text-purple-600',
    description: 'Rebotes y cuerda reforzada para horas de juego activo y salud dental.',
    imageUrl: '/product-toy.jpg',
  },
  {
    id: 'prod-9',
    name: 'NutriPet Senior 7+ - Cordero & Camote',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 59.90,
    rating: 4.8,
    reviewsCount: 82,
    weightOrSize: '14 kg',
    icon: '🐑',
    bgGradient: 'from-amber-500/10 to-yellow-500/10 text-amber-700',
    description: 'Bajo en grasas y rico en condroitina para articulaciones.',
    imageUrl: '/product-senior.jpg',
  },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: LayoutGrid, count: 9 },
  { id: 'perros', label: 'Perros', icon: Dog, count: 3 },
  { id: 'gatos', label: 'Gatos', icon: Cat, count: 2 },
  { id: 'higiene', label: 'Salud', icon: HeartPulse, count: 4 },
  { id: 'snacks', label: 'Snacks', icon: Cookie, count: 2 },
  { id: 'juguetes', label: 'Juguetes', icon: Gamepad2, count: 1 },
];

interface ProductsSectionProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

export const ProductsSection: FC<ProductsSectionProps> = ({
  onAddToCart,
  onToggleFavorite,
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
              setSelectedCategory('todos');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-[#37BFEA] hover:text-[#0284C7] flex items-center space-x-0.5 active:scale-95 transition-all"
          >
            <span>Ver todo</span>
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
        <div className="flex items-center space-x-2.5 mb-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-full text-xs text-[#061F3D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5200] focus:bg-white transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Destacados Sort Button (Matches media_1790293110059.png) */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                const modes: Array<'featured' | 'price-asc' | 'price-desc' | 'rating'> = [
                  'featured',
                  'price-asc',
                  'price-desc',
                  'rating',
                ];
                const nextIndex = (modes.indexOf(sortBy) + 1) % modes.length;
                setSortBy(modes[nextIndex]);
              }}
              className="flex items-center space-x-1.5 bg-white border border-slate-200/90 rounded-full px-3.5 py-2 text-xs font-bold text-[#061F3D] hover:bg-slate-50 active:scale-95 transition-all shadow-xs cursor-pointer select-none"
            >
              <span>
                {sortBy === 'featured'
                  ? 'Destacados'
                  : sortBy === 'price-asc'
                  ? 'Menor precio'
                  : sortBy === 'price-desc'
                  ? 'Mayor precio'
                  : 'Top reseñas'}
              </span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Chips (Matches media_1790293110059.png) */}
        <div className="mb-5 -mx-4 px-4 overflow-x-auto no-scrollbar flex space-x-2 py-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
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

        {/* Product Grid (2 columns on mobile, 3 on desktop - Matches media_1790293110059.png) */}
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
              className="mt-4 px-5 py-2 rounded-full bg-[#061F3D] text-white text-xs font-bold hover:bg-[#1B3A63] transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const isAdded = addedIds[product.id];
              const isFav = favoriteIds[product.id];

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl sm:rounded-[28px] p-2 sm:p-3.5 border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Realistic Product Package Image Container with Floating Heart (Matches media_1790293110059.png) */}
                    <div className="relative w-full aspect-square rounded-xl bg-slate-50/70 p-1.5 overflow-hidden mb-2 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      {/* Floating Wishlist Heart Button Top Right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHeartToggle(product);
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-sm border border-slate-100/80 flex items-center justify-center active:scale-75 transition-all cursor-pointer"
                        aria-label="Agregar a favoritos"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav
                              ? 'fill-rose-500 text-rose-500'
                              : product.id === 'prod-2'
                              ? 'text-rose-400 stroke-[1.8]'
                              : 'text-slate-300 stroke-[1.8]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Badge or Category Label */}
                    <div className="flex items-center space-x-1.5 mb-1">
                      {product.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase bg-[#FFF2EA] text-[#FF5200] border border-orange-200/50 truncate">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-xs font-semibold text-slate-400 truncate">
                          {product.categoryLabel}
                        </span>
                      )}
                    </div>

                    {/* Product Title */}
                    <h4 className="text-xs sm:text-base font-bold text-[#061F3D] leading-snug group-hover:text-[#FF5200] transition-colors line-clamp-2">
                      {product.name}
                    </h4>

                    {/* Weight & Rating */}
                    <div className="flex items-center justify-between mt-1 text-[10px] sm:text-xs text-[#637792]">
                      <span className="font-semibold text-slate-400">{product.weightOrSize}</span>
                      <div className="flex items-center space-x-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#061F3D]">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Price & Add CTA */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-sm sm:text-lg font-black text-[#061F3D]">
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
                      onClick={() => handleAdd(product)}
                      className={`w-7 h-7 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full font-bold text-xs flex items-center justify-center space-x-1 transition-all duration-200 active:scale-80 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-[#061F3D] hover:bg-[#FF5200] text-white shadow-xs'
                      }`}
                      aria-label={`Añadir ${product.name} al carrito`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span className="hidden sm:inline text-[11px]">Listo</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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

      </div>
    </section>
  );
};
