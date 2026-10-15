import type { FC } from 'react';

export const Logo: FC<{ className?: string }> = ({ className = 'h-14 sm:h-16 md:h-20' }) => {
  return (
    <div className={`flex items-center select-none group cursor-pointer ${className}`}>
      <img
        src="/logo.webp"
        onError={(e) => {
          if (e.currentTarget.dataset.failed) return;
          e.currentTarget.dataset.failed = "true";
          e.currentTarget.src = '/logo.png';
        }}
        alt="PetLife STORE"
        fetchPriority="high"
        decoding="sync"
        className="h-full w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(13,34,64,0.18)] group-hover:scale-105 group-active:scale-95 transition-transform duration-200"
      />
    </div>
  );
};
