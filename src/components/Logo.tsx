import type { FC } from 'react';

export const Logo: FC<{ className?: string }> = ({ className = 'h-14 sm:h-16 md:h-20' }) => {
  return (
    <div className={`flex items-center select-none group cursor-pointer ${className}`}>
      <img
        src="/Imagen de ChatGPT 24 sept 2026, 05_55_02 p.m.png"
        onError={(e) => {
          e.currentTarget.src = '/logo.png';
        }}
        alt="PetLife STORE"
        className="h-full w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(13,34,64,0.18)] group-hover:scale-105 group-active:scale-95 transition-transform duration-200"
      />
    </div>
  );
};
