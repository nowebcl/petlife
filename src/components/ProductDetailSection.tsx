import { useState, type FC } from 'react';
import { formatPrice, type Product } from '../data/products.ts';
import {
  Star,
  ShoppingCart,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';

interface ProductDetailSectionProps {
  product: Product;
  allProducts: Product[];
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, quantity?: number, variantId?: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart?: () => void;
}

export const ProductDetailSection: FC<ProductDetailSectionProps> = ({
  product,
  allProducts,
  onBackToCatalog,
  onAddToCart,
  onSelectProduct,
  onOpenCart,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'nutricion' | 'guia' | 'opiniones'>('descripcion');
  const [isAddedAnimation, setIsAddedAnimation] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Price calculations based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice
    : product.originalPrice;
  const hasDiscount = Boolean(currentOriginalPrice && currentOriginalPrice > currentPrice);
  const discountPercent = hasDiscount && currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  // Related products from the same category or petType
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.petType === product.petType))
    .slice(0, 4);

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, selectedVariant?.id);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1400);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity, selectedVariant?.id);
    if (onOpenCart) {
      onOpenCart();
    }
  };

  return (
    <section className="w-full bg-[#F8FAFC] min-h-screen pt-4 pb-20 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 mb-4 sm:mb-6 border-b border-slate-200/60">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button
              onClick={onBackToCatalog}
              className="hover:text-[#FF5200] transition-colors flex items-center space-x-1"
            >
              <span>Inicio</span>
            </button>
            <span>/</span>
            <button
              onClick={onBackToCatalog}
              className="hover:text-[#FF5200] transition-colors"
            >
              <span>Catálogo</span>
            </button>
            <span>/</span>
            <span className="capitalize text-slate-400">{product.categoryLabel}</span>
            <span>/</span>
            <span className="text-[#061F3D] font-bold truncate max-w-[140px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#061F3D] bg-white border border-slate-200 px-3.5 py-1.5 rounded-full hover:bg-slate-50 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al catálogo</span>
          </button>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-100 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Main Image Box */}
              <div className="relative w-full aspect-square max-w-[500px] rounded-2xl sm:rounded-3xl bg-slate-50/80 p-6 flex items-center justify-center border border-slate-100/90 overflow-hidden group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = product.imageUrl;
                  }}
                />

                {/* Badges Overlay (Discount only if applicable) */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs">
                      -{discountPercent}% OFF
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 shadow-sm border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer"
                  aria-label="Guardar en favoritos"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400 stroke-[1.8]'
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnails Gallery */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="flex items-center space-x-3 mt-4 overflow-x-auto no-scrollbar py-1">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1 bg-slate-50 border-2 transition-all overflow-hidden cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#FF5200] shadow-sm scale-105'
                          : 'border-slate-200/80 hover:border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Purchase Action */}
            <div className="lg:col-span-6 flex flex-col justify-start text-left">
              {/* Brand & Stock Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5200]">
                  {product.brand}
                </span>

                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600">
                    En Stock ({product.stockCount} disponibles)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#061F3D] tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Reviews Bar */}
              <div className="flex items-center space-x-3 mb-5">
                <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-xs text-[#061F3D]">{product.rating}</span>
                  <span className="text-slate-400 text-xs">/ 5.0</span>
                </div>
                <span className="text-xs font-semibold text-[#637792]">
                  {product.reviewsCount} opiniones verificadas
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-400">SKU: {product.sku}</span>
              </div>

              {/* Price Banner */}
              <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-100 mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="flex items-baseline space-x-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#061F3D]">
                      {formatPrice(currentPrice)}
                    </span>
                    {currentOriginalPrice && (
                      <span className="text-base sm:text-lg text-slate-400 line-through">
                        {formatPrice(currentOriginalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#637792] font-medium block mt-0.5">
                    Impuestos incluidos. Envío calculado en el checkout.
                  </span>
                </div>

                {hasDiscount && currentOriginalPrice && (
                  <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    Ahorras {formatPrice(currentOriginalPrice - currentPrice)}
                  </div>
                )}
              </div>

              {/* Variants Selector (Weight / Presentation) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Selecciona presentación / tamaño:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF5200] bg-[#FFF8F5] shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#FF5200]' : 'text-[#061F3D]'}`}>
                              {v.weightOrSize}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5200]" />}
                          </div>
                          <span className="text-xs font-extrabold text-slate-700 block mt-1">
                            {formatPrice(v.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & CTAs */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  {/* Quantity Counter */}
                  <div className="inline-flex items-center border-2 border-slate-200 rounded-full bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full bg-white text-[#061F3D] font-bold text-base flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-sm text-[#061F3D]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      disabled={quantity >= product.stockCount}
                      className="w-8 h-8 rounded-full bg-white text-[#061F3D] font-bold text-base flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCartClick}
                    className={`flex-1 py-3.5 px-6 rounded-full font-black text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer shadow-orange-glow active:scale-95 ${
                      isAddedAnimation
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : 'bg-[#FF5200] hover:bg-[#FF6508] text-white'
                    }`}
                  >
                    {isAddedAnimation ? (
                      <>
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>¡Añadido al carrito!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                        <span>Añadir al carrito</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary Direct Buy Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 rounded-full bg-[#061F3D] hover:bg-[#0B2A52] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Comprar ahora (Pago Rápido)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Store Guarantees Banner */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <Truck className="w-5 h-5 text-[#FF5200] mx-auto mb-1 stroke-[2]" />
                  <span className="text-[11px] font-bold text-[#061F3D] block">Despacho 24-48h</span>
                  <span className="text-[10px] text-slate-400">Todo el país</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-[#37BFEA] mx-auto mb-1 stroke-[2]" />
                  <span className="text-[11px] font-bold text-[#061F3D] block">Pago Seguro</span>
                  <span className="text-[10px] text-slate-400">Tarjetas y Webpay</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <RotateCcw className="w-5 h-5 text-emerald-500 mx-auto mb-1 stroke-[2]" />
                  <span className="text-[11px] font-bold text-[#061F3D] block">30 Días Garantía</span>
                  <span className="text-[10px] text-slate-400">Devolución fácil</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Nutrition, Feeding Guide, Reviews) */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-100 mb-12">
          {/* Tabs Navigation Header */}
          <div className="flex items-center space-x-2 sm:space-x-4 border-b border-slate-200 overflow-x-auto no-scrollbar pb-3 mb-6">
            <button
              onClick={() => setActiveTab('descripcion')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'descripcion'
                  ? 'bg-[#061F3D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#061F3D] bg-slate-50'
              }`}
            >
              Descripción & Beneficios
            </button>

            {product.ingredients && (
              <button
                onClick={() => setActiveTab('nutricion')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'nutricion'
                    ? 'bg-[#061F3D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#061F3D] bg-slate-50'
                }`}
              >
                Ingredientes & Análisis
              </button>
            )}

            {product.feedingGuide && (
              <button
                onClick={() => setActiveTab('guia')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'guia'
                    ? 'bg-[#061F3D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#061F3D] bg-slate-50'
                }`}
              >
                Guía de Raciones
              </button>
            )}

            <button
              onClick={() => setActiveTab('opiniones')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'opiniones'
                  ? 'bg-[#061F3D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#061F3D] bg-slate-50'
              }`}
            >
              Opiniones ({product.reviewsCount})
            </button>
          </div>

          {/* Tab 1: Description & Key Benefits */}
          {activeTab === 'descripcion' && (
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#061F3D] mb-3">
                  ¿Por qué elegir {product.name}?
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {product.longDescription || product.description}
                </p>
              </div>

              {product.benefits && product.benefits.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-[#061F3D] uppercase tracking-wider mb-3">
                    Beneficios Principales Comprobados:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Ingredients & Nutritional Analysis */}
          {activeTab === 'nutricion' && (
            <div className="space-y-6 text-left">
              {product.ingredients && (
                <div>
                  <h3 className="text-lg font-black text-[#061F3D] mb-2">Ingredientes 100% Declarados:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.nutritionalAnalysis && (
                <div>
                  <h3 className="text-lg font-black text-[#061F3D] mb-3">Tabla Nutricional Garantizada:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(product.nutritionalAnalysis).map(([key, val], idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block">{key}</span>
                        <span className="text-sm font-black text-[#061F3D] block mt-0.5">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Feeding Guide */}
          {activeTab === 'guia' && product.feedingGuide && (
            <div className="text-left">
              <h3 className="text-lg font-black text-[#061F3D] mb-2">
                Guía de Alimentación Diaria Recomendada
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Porciones calculadas para mascotas con actividad física moderada. Mantén siempre agua fresca y limpia a su disposición.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-[#061F3D] font-bold">
                      <th className="p-3 rounded-l-xl">Peso de la Mascota</th>
                      <th className="p-3 rounded-r-xl">Cantidad Diaria Recomendada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.feedingGuide.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-700">{row.weight}</td>
                        <td className="p-3 font-extrabold text-[#FF5200]">{row.dailyAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Customer Reviews */}
          {activeTab === 'opiniones' && (
            <div className="text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                <div>
                  <h4 className="text-base font-black text-[#061F3D]">Valoración Global</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-black text-sm text-[#061F3D]">{product.rating} de 5</span>
                    <span className="text-xs text-slate-400">({product.reviewsCount} reseñas)</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('¡Gracias por tu interés! Próximamente podrás enviar tu reseña con foto.')}
                  className="px-4 py-2 rounded-full bg-[#061F3D] text-white text-xs font-bold hover:bg-[#1B3A63] transition-colors cursor-pointer self-start sm:self-center"
                >
                  Escribir una opinión
                </button>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs sm:text-sm text-[#061F3D]">{rev.author}</span>
                        {rev.verified && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">
                            Compra Verificada
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    {rev.petType && (
                      <span className="text-[11px] font-semibold text-[#FF5200] block">
                        🐾 {rev.petType}
                      </span>
                    )}

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Aún no hay comentarios detallados para este producto. ¡Sé el primero en opinar!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#061F3D]">
                  También te podría gustar
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Productos recomendados para acompañar este cuidado
                </p>
              </div>
              <button
                onClick={onBackToCatalog}
                className="text-xs font-bold text-[#FF5200] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Ver catálogo completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-xl bg-slate-50 p-2 overflow-hidden mb-2">
                      <img
                        src={rel.imageUrl}
                        alt={rel.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#FF5200] uppercase tracking-wider block">
                      {rel.categoryLabel}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#061F3D] line-clamp-2 mt-0.5 group-hover:text-[#FF5200] transition-colors">
                      {rel.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-sm font-black text-[#061F3D]">
                      {formatPrice(rel.price)}
                    </span>
                    <span className="text-[10px] font-bold text-[#061F3D] bg-slate-100 hover:bg-[#FF5200] hover:text-white px-2 py-1 rounded-full transition-colors">
                      Ver detalle
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
