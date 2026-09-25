import type { FC } from 'react';

// Floating 3D Heart with speed marks
export const FloatingHeart: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
    {/* Speed lines */}
    <div className="absolute -top-3 -left-4 w-3 h-1.5 bg-[#FF6A00] rounded-full rotate-[-45deg] opacity-90" />
    <div className="absolute -top-5 left-1 w-4 h-1.5 bg-[#FF6A00] rounded-full rotate-[-15deg] opacity-90" />
    <div className="absolute -top-3 right-0 w-3 h-1.5 bg-[#FF6A00] rounded-full rotate-[35deg] opacity-90" />

    {/* Heart SVG */}
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="filter drop-shadow-[0_8px_16px_rgba(255,87,34,0.4)]"
    >
      <defs>
        <linearGradient id="heartGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7733" />
          <stop offset="50%" stopColor="#FF5500" />
          <stop offset="100%" stopColor="#E63900" />
        </linearGradient>
      </defs>
      <path
        d="M32 54.5C32 54.5 9 40.5 9 24C9 15.5 15.5 9 24 9C28.8 9 31.8 11.8 32 12C32.2 11.8 35.2 9 40 9C48.5 9 55 15.5 55 24C55 40.5 32 54.5 32 54.5Z"
        fill="url(#heartGrad)"
      />
      {/* Glossy Highlight */}
      <path
        d="M20 15C16 18 15 23 15 25"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  </div>
);

// Floating Dog Bone Badge with white outline
export const FloatingBoneBadge: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative inline-block select-none ${className}`}>
    <svg
      width="120"
      height="85"
      viewBox="0 0 120 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform rotate-[30deg] filter drop-shadow-[0_12px_24px_rgba(255,140,0,0.45)]"
    >
      <defs>
        <linearGradient id="boneGrad" x1="10" y1="10" x2="110" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA611" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>

      {/* Outer White Glow / Border */}
      <path
        d="M 32 18 C 24 18 18 24 18 32 C 18 36 20 39 23 42 C 20 45 18 48 18 52 C 18 60 24 66 32 66 C 37 66 41 63 43 59 L 77 59 C 79 63 83 66 88 66 C 96 66 102 60 102 52 C 102 48 100 45 97 42 C 100 39 102 36 102 32 C 102 24 96 18 88 18 C 83 18 79 21 77 25 L 43 25 C 41 21 37 18 32 18 Z"
        fill="#FFFFFF"
      />

      {/* Main Bone Shape */}
      <path
        d="M 33 22 C 27 22 22 27 22 33 C 22 36.5 24 39.5 26.5 42 C 24 44.5 22 47.5 22 51 C 22 57 27 62 33 62 C 37 62 40.5 59.5 42 56 L 78 56 C 79.5 59.5 83 62 87 62 C 93 62 98 57 98 51 C 98 47.5 96 44.5 93.5 42 C 96 39.5 98 36.5 98 33 C 98 27 93 22 87 22 C 83 22 79.5 24.5 78 28 L 42 28 C 40.5 24.5 37 22 33 22 Z"
        fill="url(#boneGrad)"
      />

      {/* Inner highlight */}
      <path
        d="M 46 34 L 74 34"
        stroke="#FFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  </div>
);

// Floating Cyan Paw Print
export const FloatingPaw: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative inline-block select-none opacity-85 ${className}`}>
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="filter drop-shadow-[0_6px_12px_rgba(56,182,255,0.3)]"
    >
      <defs>
        <linearGradient id="pawGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6FD4FF" />
          <stop offset="100%" stopColor="#38B6FF" />
        </linearGradient>
      </defs>
      {/* Central Pad */}
      <path
        d="M 30 24 C 20 24 16 35 18 44 C 20 51 26 53 30 53 C 34 53 40 51 42 44 C 44 35 40 24 30 24 Z"
        fill="url(#pawGrad)"
      />
      {/* 4 Toes */}
      <ellipse cx="14" cy="22" rx="5.5" ry="7.5" transform="rotate(-25 14 22)" fill="url(#pawGrad)" />
      <ellipse cx="24" cy="13" rx="5.5" ry="8" transform="rotate(-8 24 13)" fill="url(#pawGrad)" />
      <ellipse cx="36" cy="13" rx="5.5" ry="8" transform="rotate(8 36 13)" fill="url(#pawGrad)" />
      <ellipse cx="46" cy="22" rx="5.5" ry="7.5" transform="rotate(25 46 22)" fill="url(#pawGrad)" />
    </svg>
  </div>
);

// Decorative strokes/sparkles around title
export const TitleSparkles: FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 50 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M 8 30 C 12 20 20 12 30 6"
      stroke="#FF5A00"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 28 32 C 34 24 40 18 46 14"
      stroke="#FF5A00"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 2 16 C 5 10 9 6 15 2"
      stroke="#FF5A00"
      strokeWidth="3.5"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);
