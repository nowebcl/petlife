import { useState, type FC } from 'react';

export const WhatsAppIcon: FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="0"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export const FloatingWhatsApp: FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '56982535868';
  const defaultMessage = encodeURIComponent(
    '¡Hola PetLife! 🐾 Me gustaría consultar sobre sus productos y despachos.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Contacto por WhatsApp"
      className="fixed z-40 bottom-20 sm:bottom-6 left-3.5 sm:left-6 flex items-center space-x-2.5 group select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main WhatsApp Minimal Floating Button on the LEFT */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp (+56 9 8253 5868)"
        className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/30"
      >
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" />
        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-300 border border-white" />
      </a>

      {/* Minimal clean Tooltip on desktop hover */}
      <div
        className={`hidden sm:flex items-center space-x-1.5 bg-[#061F3D] text-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/60 transition-all duration-200 origin-left ${
          isHovered
            ? 'opacity-100 scale-100 translate-x-0'
            : 'opacity-0 scale-95 -translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
        <span className="text-xs font-semibold whitespace-nowrap">
          WhatsApp PetLife
        </span>
      </div>
    </aside>
  );
};
