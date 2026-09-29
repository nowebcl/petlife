import { useState, useMemo, useEffect, type FC } from 'react';
import type { Product } from '../data/products.ts';
import { ALL_CATEGORIES, formatPrice } from '../data/products.ts';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Star,
  Plus,
  Check,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react';

interface CatalogSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export const CatalogSection: FC<CatalogSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleFavorite,
  initialCategory = 'todos',
  initialSearchQuery = '',
}) => {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedPetType, setSelectedPetType] = useState<'todos' | 'perro' | 'gato'>('todos');
  const [selectedLifeStage, setSelectedLifeStage] = useState<'todas' | 'cachorro' | 'adulto' | 'senior'>('todas');
  const [priceRange, setPriceRange] = useState<'all' | 'under-20' | '20-50' | 'over-50'>('all');
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyTopRated, setOnlyTopRated] = useState<boolean>(false);

  // Layout & Sorting States
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(40);

  // Action states
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});

  // Sync initial props
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearchQuery) setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    searchQuery,
    selectedPetType,
    selectedLifeStage,
    priceRange,
    onlyDiscount,
    onlyInStock,
    onlyTopRated,
    sortBy,
    itemsPerPage,
  ]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        const matchCat = selectedCategory === 'todos' || p.category === selectedCategory;

        // Search Query
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          query === '' ||
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query);

        // Pet Type
        const matchPet =
          selectedPetType === 'todos' ||
          p.petType === selectedPetType ||
          p.petType === 'ambos';

        // Life Stage
        const matchStage =
          selectedLifeStage === 'todas' ||
          p.lifeStage === selectedLifeStage ||
          p.lifeStage === 'todas';

        // Price Range
        let matchPrice = true;
        if (priceRange === 'under-20') matchPrice = p.price < 20000;
        if (priceRange === '20-50') matchPrice = p.price >= 20000 && p.price <= 50000;
        if (priceRange === 'over-50') matchPrice = p.price > 50000;

        // Toggles
        const matchDiscount = !onlyDiscount || Boolean(p.originalPrice && p.originalPrice > p.price);
        const matchStock = !onlyInStock || p.inStock;
        const matchRating = !onlyTopRated || p.rating >= 4.9;

        return (
          matchCat &&
          matchSearch &&
          matchPet &&
          matchStage &&
          matchPrice &&
          matchDiscount &&
          matchStock &&
          matchRating
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // featured default
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedPetType,
    selectedLifeStage,
    priceRange,
    onlyDiscount,
    onlyInStock,
    onlyTopRated,
    sortBy,
  ]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Active filters count
  const activeFiltersCount = [
    selectedCategory !== 'todos',
    selectedPetType !== 'todos',
    selectedLifeStage !== 'todas',
    priceRange !== 'all',
    onlyDiscount,
    onlyInStock,
    onlyTopRated,
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setSelectedPetType('todos');
    setSelectedLifeStage('todas');
    setPriceRange('all');
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setOnlyTopRated(false);
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('catalogo-main');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="catalogo-main" className="w-full bg-[#F8FAFC] min-h-screen pt-4 pb-24 sm:pb-32 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Catalog Banner Header */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 mb-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-black tracking-wider uppercase text-[#FF5200] bg-[#FFF2EA] px-3.5 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tienda Oficial PetLife</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#061F3D] tracking-tight leading-tight">
              Catálogo Completo
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium">
              Explora nuestra selección completa de alimentos premium, snacks naturales, farmacia y accesorios con despacho garantizado.
            </p>
          </div>

          {/* Background Decorative Circles */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-36 -top-10 w-48 h-48 bg-cyan-100/50 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Main 2-Column Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================= */}
          {/* DESKTOP SIDEBAR FILTERS (Column 1-3)                      */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF5200]" />
                <h3 className="font-black text-sm text-[#061F3D] uppercase tracking-wider">
                  Filtros
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-[#FF5200] hover:underline cursor-pointer"
                >
                  Limpiar ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Filter 1: Categories */}
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2.5">
                Categorías
              </h4>
              <div className="space-y-1">
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF5200] text-white shadow-xs'
                          : 'text-[#061F3D] hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Pet Type (Perro / Gato) */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2.5">
                Tipo de Mascota
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'perro', label: '🐕 Perros' },
                  { id: 'gato', label: '🐱 Gatos' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedPetType(type.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedPetType === type.id
                        ? 'bg-[#061F3D] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Price Range */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2.5">
                Rango de Precio
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Cualquier precio' },
                  { id: 'under-20', label: 'Menos de $20.000' },
                  { id: '20-50', label: '$20.000 a $50.000' },
                  { id: 'over-50', label: 'Más de $50.000' },
                ].map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="price-desktop"
                      checked={priceRange === range.id}
                      onChange={() => setPriceRange(range.id as any)}
                      className="accent-[#FF5200] w-4 h-4 cursor-pointer"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 4: Quick Toggles (Stock, Discounts, Rating) */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2.5">
                Condiciones
              </h4>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                <span>🔥 Solo en oferta</span>
                <input
                  type="checkbox"
                  checked={onlyDiscount}
                  onChange={(e) => setOnlyDiscount(e.target.checked)}
                  className="accent-[#FF5200] w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                <span>📦 Solo con stock</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-[#FF5200] w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                <span>⭐ Calificación 4.9+</span>
                <input
                  type="checkbox"
                  checked={onlyTopRated}
                  onChange={(e) => setOnlyTopRated(e.target.checked)}
                  className="accent-[#FF5200] w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN CATALOG CONTENT (Column 4-12)                        */}
          {/* ========================================================= */}
          <main className="lg:col-span-9 w-full">

            {/* Toolbar: Search + Mobile Filter Trigger + Sort + View Mode */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 space-y-3.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, marca o ingrediente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-[#061F3D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5200] focus:bg-white transition-all shadow-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full bg-[#061F3D] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#FF5200] text-white text-[10px] font-black flex items-center justify-center ml-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-semibold text-slate-400">
                    Ordenar:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 text-xs font-bold text-[#061F3D] outline-none focus:ring-2 focus:ring-[#FF5200] cursor-pointer"
                  >
                    <option value="featured">Destacados / Recomendados</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor Calificados</option>
                    <option value="name-asc">Nombre (A - Z)</option>
                  </select>

                  {/* Grid vs List View Toggle */}
                  <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      aria-label="Vista cuadrícula"
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white text-[#FF5200] shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      aria-label="Vista lista"
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-white text-[#FF5200] shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Active Filter Badges Pills */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 text-[11px]">Filtros activos:</span>
                  {selectedCategory !== 'todos' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FFF2EA] text-[#FF5200] font-bold text-[11px]">
                      <span>{ALL_CATEGORIES.find((c) => c.id === selectedCategory)?.label}</span>
                      <button onClick={() => setSelectedCategory('todos')}>
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    </span>
                  )}
                  {selectedPetType !== 'todos' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      <span>{selectedPetType === 'perro' ? '🐕 Perros' : '🐱 Gatos'}</span>
                      <button onClick={() => setSelectedPetType('todos')}>
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    </span>
                  )}
                  {priceRange !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      <span>
                        {priceRange === 'under-20' ? '< $20.000' : priceRange === '20-50' ? '$20.000 - $50.000' : '> $50.000'}
                      </span>
                      <button onClick={() => setPriceRange('all')}>
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    </span>
                  )}
                  {onlyDiscount && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-[11px]">
                      <span>En oferta</span>
                      <button onClick={() => setOnlyDiscount(false)}>
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    </span>
                  )}
                  {onlyInStock && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      <span>En stock</span>
                      <button onClick={() => setOnlyInStock(false)}>
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      <span>"{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-[#FF5200] font-bold text-[11px] hover:underline ml-1 cursor-pointer"
                  >
                    Restablecer todo
                  </button>
                </div>
              )}

              {/* Result Count Summary */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  Mostrando <strong className="text-[#061F3D]">{filteredProducts.length === 0 ? 0 : startIndex + 1}</strong> a{' '}
                  <strong className="text-[#061F3D]">{endIndex}</strong> de{' '}
                  <strong className="text-[#061F3D]">{filteredProducts.length}</strong> productos
                </span>

                <div className="flex items-center space-x-1 text-slate-400">
                  <span>Por página:</span>
                  {[12, 24, 40].map((num) => (
                    <button
                      key={num}
                      onClick={() => setItemsPerPage(num)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        itemsPerPage === num ? 'bg-[#FF5200] text-white shadow-xs' : 'hover:text-[#061F3D]'
                      }`}
                    >
                      {num === 40 ? 'Todos' : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* PRODUCTS DISPLAY (GRID OR LIST)                           */}
            {/* ========================================================= */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-slate-200/80 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <h3 className="text-xl font-black text-[#061F3D] mb-1">
                  No se encontraron productos
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Intenta cambiar los términos de búsqueda o elimina algunos filtros para ver más opciones disponibles.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Limpiar filtros aplicados
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {currentProducts.map((product) => {
                  const isAdded = addedIds[product.id];
                  const isFav = favoriteIds[product.id];

                  return (
                    <article
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
                    >
                      <div>
                        {/* Realistic Product Image Box */}
                        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-slate-50/80 p-2 sm:p-3 overflow-hidden mb-2.5 flex items-center justify-center">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/product-dog-food.jpg';
                            }}
                          />

                          {/* Top Discount Badge if applicable */}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-rose-500 text-white shadow-xs">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                          )}

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHeartToggle(product);
                            }}
                            className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 shadow-sm border border-slate-100 flex items-center justify-center active:scale-75 transition-all cursor-pointer"
                            aria-label="Agregar a favoritos"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300 stroke-[1.8]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Category & Weight */}
                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-1">
                          <span className="font-bold text-[#FF5200] uppercase tracking-wider">
                            {product.categoryLabel}
                          </span>
                          <span>{product.weightOrSize}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs sm:text-sm font-bold text-[#061F3D] leading-snug group-hover:text-[#FF5200] transition-colors line-clamp-2 mb-1.5">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 text-[11px] text-slate-500 mb-2">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-extrabold text-[#061F3D]">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <div>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-sm sm:text-lg font-black text-[#061F3D]">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(product);
                          }}
                          className={`py-1.5 px-3 rounded-full font-bold text-xs flex items-center space-x-1 transition-all duration-200 active:scale-90 cursor-pointer shadow-xs ${
                            isAdded
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                              : 'bg-[#FF5200] hover:bg-[#FF6508] text-white shadow-orange-glow'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span className="text-[11px]">Listo</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span className="text-[11px]">Añadir</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-3.5">
                {currentProducts.map((product) => {
                  const isAdded = addedIds[product.id];
                  const isFav = favoriteIds[product.id];

                  return (
                    <article
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 group cursor-pointer"
                    >
                      <div className="relative w-full sm:w-40 sm:h-40 aspect-square rounded-2xl bg-slate-50 p-3 shrink-0 flex items-center justify-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHeartToggle(product);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 shadow-xs border border-slate-100 flex items-center justify-center active:scale-75 transition-all cursor-pointer"
                          aria-label="Agregar a favoritos"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300 stroke-[1.8]'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex-1 w-full text-left">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold text-[#FF5200] uppercase tracking-wider">
                            {product.categoryLabel}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400 font-semibold">{product.brand}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-[#061F3D] group-hover:text-[#FF5200] transition-colors mb-1.5">
                          {product.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-[#061F3D]">{product.rating}</span>
                          </div>
                          <span>{product.weightOrSize}</span>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <div>
                          <span className="text-xl sm:text-2xl font-black text-[#061F3D] block">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through block text-right">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(product);
                          }}
                          className={`py-2 px-5 rounded-full font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95 ${
                            isAdded
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[#FF5200] hover:bg-[#FF6508] text-white shadow-orange-glow'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>¡Añadido!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                              <span>Añadir al carrito</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ========================================================= */}
            {/* PAGINATION CONTROLS                                       */}
            {/* ========================================================= */}
            {totalPages > 1 && (
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>

                <div className="flex items-center space-x-1.5">
                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-[#061F3D] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = currentPage === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FF5200] text-white shadow-xs scale-105'
                            : 'bg-white border border-slate-200 text-[#061F3D] hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-[#061F3D] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER FILTERS MODAL                               */}
      {/* ========================================================= */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF5200]" />
                  <h3 className="font-black text-base text-[#061F3D]">Filtros</h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                  Categoría
                </h4>
                <div className="space-y-1">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                        selectedCategory === cat.id
                          ? 'bg-[#FF5200] text-white'
                          : 'text-[#061F3D] hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-70">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Pet Type */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                  Mascota
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {['todos', 'perro', 'gato'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedPetType(type as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold capitalize ${
                        selectedPetType === type
                          ? 'bg-[#061F3D] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Quick Toggles */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <label className="flex items-center justify-between font-bold text-slate-700">
                  <span>🔥 Solo en oferta</span>
                  <input
                    type="checkbox"
                    checked={onlyDiscount}
                    onChange={(e) => setOnlyDiscount(e.target.checked)}
                    className="accent-[#FF5200] w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between font-bold text-slate-700">
                  <span>📦 Solo en stock</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-[#FF5200] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center space-x-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-3 rounded-full border border-slate-300 text-xs font-bold text-slate-600"
              >
                Limpiar
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#FF5200] text-white text-xs font-black shadow-orange-glow"
              >
                Ver ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
