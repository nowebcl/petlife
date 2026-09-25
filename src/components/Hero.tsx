import { useState, type FC, type MouseEvent, type TouchEvent } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { TitleSparkles } from './Decorations.tsx';

interface HeroProps {
  onBuyClick: () => void;
  onExploreCategories: () => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const Hero: FC<HeroProps> = ({
  onBuyClick,
  onExploreCategories,
}) => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  // Spawn ONLY hearts when clicking with mouse or tapping with finger
  const triggerHeartBurst = (clientX: number, clientY: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const newHearts: FloatingHeart[] = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: clickX + (Math.random() * 40 - 20),
      y: clickY - 10 - (i * 12),
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      );
    }, 1200);
  };

  const handlePointerDown = (e: MouseEvent<HTMLDivElement>) => {
    triggerHeartBurst(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      triggerHeartBurst(touch.clientX, touch.clientY, e.currentTarget);
    }
  };

  return (
    <section className="relative w-full flex-1 flex flex-col justify-end select-none overflow-hidden">

      {/* ========================================================= */}
      {/* 1. MOBILE HERO VIEW (Matches media_1790297970888.jpg)     */}
      {/* ========================================================= */}
      <div className="md:hidden w-full flex-1 flex flex-col justify-between pt-4 pb-0 text-center z-20">

        {/* Text & CTAs Container (padded) */}
        <div className="w-full px-4 flex flex-col items-center">
          {/* Mobile Headline (Centered with side decorations) */}
          <div className="relative mb-2 flex flex-col items-center">
            <h1 className="text-[38px] sm:text-[44px] font-black tracking-tight leading-[1.05] text-[#061F3D]">
              Todo para
            </h1>

            <div className="relative inline-flex items-center justify-center mt-0.5">
              {/* Left Cyan Speed / Splash Strokes */}
              <div className="absolute -left-9 sm:-left-11 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-1 select-none pointer-events-none">
                <span className="w-5 h-2 bg-[#37BFEA] rounded-full -rotate-12 transform" />
                <span className="w-4 h-2 bg-[#37BFEA] rounded-full rotate-3 transform mr-1" />
              </div>

              {/* Word "tu mascota" in vibrant orange (Matches media_1790297970888.jpg) */}
              <span className="text-[44px] sm:text-[52px] font-black tracking-tight text-[#FF5200] leading-none whitespace-nowrap">
                tu mascota
              </span>

              {/* Right Orange Heart + Accent Stroke */}
              <div className="absolute -right-9 sm:-right-11 top-1/2 -translate-y-1/2 flex flex-col items-center select-none pointer-events-none">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5200] fill-current transform rotate-[18deg]"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <svg
                  className="w-4 h-2 text-[#FF5200] mt-0.5 ml-2"
                  viewBox="0 0 16 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M2 2 C6 5 10 5 14 3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile Subtitle (Centered, exact wording from media_1790297970888.jpg) */}
          <p className="text-sm font-semibold text-[#061F3D] max-w-[280px] mx-auto leading-snug mb-5">
            Alimentos, accesorios y cuidados
            <br />
            para una vida más feliz.
          </p>

          {/* Mobile CTA Buttons (Stacked vertically - Matches media_1790297970888.jpg) */}
          <div className="relative w-full max-w-[270px] mx-auto flex flex-col space-y-3 mb-2">
            {/* Button 1: Comprar ahora → */}
            <button
              onClick={onBuyClick}
              className="w-full py-3.5 px-6 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Comprar ahora</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Button 2: Ver categorías → */}
            <button
              onClick={onExploreCategories}
              className="w-full py-3 px-6 rounded-full bg-white text-[#061F3D] border-2 border-[#061F3D] font-bold text-sm active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Ver categorías</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Pets Image - Full Width Edge-to-Edge using ALL space (Matches media_1790297970888.jpg) */}
        <div className="w-full mt-auto -mb-1 flex justify-center items-end select-none overflow-hidden">
          <div
            onMouseDown={handlePointerDown}
            onTouchStart={handleTouchStart}
            className="relative w-full cursor-pointer select-none"
            title="Tócame con el dedo ❤️"
          >
            <img
              src="/Imagen de ChatGPT 24 sept 2026, 08_30_21 p.m.png"
              onError={(e) => {
                e.currentTarget.src = '/mobile-pets.png';
              }}
              alt="Perro y gato en cama tejida"
              fetchPriority="high"
              className="w-full h-auto object-contain select-none scale-[1.08] sm:scale-100 origin-bottom"
            />

            {/* Floating Hearts only */}
            {hearts.map((h) => (
              <div
                key={h.id}
                className="absolute pointer-events-none text-2xl animate-heart-rise z-40 select-none"
                style={{
                  left: `${h.x}px`,
                  top: `${h.y}px`,
                }}
              >
                ❤️
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP HERO VIEW (Full Wide Landscape Layout)        */}
      {/* ========================================================= */}
      <div className="hidden md:flex relative w-full flex-1 flex-col justify-center px-6 md:px-12 lg:px-16 pt-4 pb-8 md:pb-14 lg:pb-16 select-none overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center relative z-20">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-6 z-20 max-w-xl text-left py-2">
            {/* Tagline */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-6 h-[3px] bg-[#FF5200] rounded-full" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#637792]">
                Amor en cada etapa
              </span>
            </div>

            {/* Main Headline */}
            <div className="relative mb-3 sm:mb-4">
              <h1 className="text-4xl md:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.04] text-[#061F3D]">
                Todo para
                <br />
                <span className="relative inline-block text-[#FF5200]">
                  tu mascota
                  {/* Decorative Sparkles / Whiskers Top Right */}
                  <span className="absolute -top-3 -right-10 sm:-top-5 sm:-right-14 transform scale-90 sm:scale-100">
                    <TitleSparkles className="w-10 h-8 sm:w-14 sm:h-10" />
                  </span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#637792] max-w-md sm:max-w-lg mb-7 sm:mb-9 leading-relaxed">
              Alimentos, accesorios y cuidados de calidad para una vida más feliz junto a ellos.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
              <button
                onClick={onBuyClick}
                className="group inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#FF5200] text-white font-bold text-base sm:text-lg shadow-orange-glow hover:bg-[#FF6508] hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Comprar ahora</span>
                <ChevronRight className="w-5 h-5 ml-1.5 stroke-[2.5] transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCategories}
                className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/90 hover:bg-[#061F3D] text-[#061F3D] hover:text-white border-2 border-[#061F3D] font-bold text-base sm:text-lg hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <span>Ver categorías</span>
                <ChevronRight className="w-5 h-5 ml-1.5 stroke-[2.5] transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Pets: Imagen de ChatGPT 24 sept 2026, 05_43_28 p.m.png */}
        <div className="absolute bottom-0 right-0 w-[58%] xl:w-[60.5%] max-w-[1000px] z-10 pointer-events-none">
          <div
            onMouseDown={handlePointerDown}
            onTouchStart={handleTouchStart}
            className="relative w-full cursor-pointer animate-pet-float-minimal pointer-events-auto select-none"
            title="Tócame para enviar amor ❤️"
          >
            <img
              src="/Imagen de ChatGPT 24 sept 2026, 05_43_28 p.m.png"
              onError={(e) => {
                e.currentTarget.src = '/pets-cutout.png';
              }}
              alt="Perro Golden Retriever y Gato atigrado sonriendo juntos"
              fetchPriority="high"
              className="w-full h-auto object-contain select-none"
            />

            {/* Floating Hearts only */}
            {hearts.map((h) => (
              <div
                key={h.id}
                className="absolute pointer-events-none text-2xl sm:text-3xl animate-heart-rise z-40 select-none"
                style={{
                  left: `${h.x}px`,
                  top: `${h.y}px`,
                }}
              >
                ❤️
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
