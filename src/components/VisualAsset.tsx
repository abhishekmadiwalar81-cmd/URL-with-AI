import React, { useState } from 'react';

interface VisualAssetProps {
  type: 'paints' | 'laminates' | 'plywood' | 'chemicals' | 'hardware' | 'showroom' | 'warehouse';
  title?: string;
  subtitle?: string;
  className?: string;
  src?: string;
  alt?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

export const VisualAsset: React.FC<VisualAssetProps> = ({
  type,
  title,
  subtitle,
  className = '',
  src,
  alt = 'S S Traders Karnataka Trade Asset',
  aspectRatio = '4:3',
}) => {
  const [imgError, setImgError] = useState(false);

  const aspectClass =
    aspectRatio === '16:9'
      ? 'aspect-video'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : '';

  // If a valid src is provided and hasn't errored out, render the image with fallback
  if (src && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-stone-100 ${aspectClass} ${className}`}>
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  // Bespoke architectural SVG illustration fallback tailored to Karnataka building materials domain
  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-between p-6 select-none bg-gradient-to-br transition-all duration-300 ${
        type === 'paints'
          ? 'from-amber-950 via-stone-900 to-amber-900 text-stone-100'
          : type === 'laminates'
          ? 'from-amber-900/90 via-stone-900 to-stone-950 text-stone-100'
          : type === 'plywood'
          ? 'from-stone-900 via-amber-950 to-stone-900 text-stone-100'
          : type === 'chemicals'
          ? 'from-sky-950 via-stone-900 to-stone-950 text-stone-100'
          : type === 'hardware'
          ? 'from-zinc-900 via-stone-900 to-stone-950 text-stone-100'
          : type === 'showroom'
          ? 'from-stone-900 via-stone-800 to-stone-950 text-stone-100'
          : 'from-amber-950 via-stone-900 to-stone-950 text-stone-100'
      } ${aspectClass} ${className}`}
    >
      {/* Background Architectural Vector Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {type === 'paints' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="paintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                <path d="M 0,20 Q 20,40 40,20" fill="none" stroke="currentColor" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paintGrid)" />
          </svg>
        )}

        {type === 'laminates' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="woodGrain" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="8 4" />
                <line x1="0" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="0.8" />
                <line x1="0" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="16 4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#woodGrain)" />
          </svg>
        )}

        {type === 'plywood' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="crossGrain" width="48" height="48" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="48" height="24" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <rect x="0" y="24" width="48" height="24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#crossGrain)" />
          </svg>
        )}

        {type === 'chemicals' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexMatrix" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexMatrix)" />
          </svg>
        )}

        {(type === 'hardware' || type === 'showroom' || type === 'warehouse') && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="archGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="15" cy="15" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#archGrid)" />
          </svg>
        )}
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] tracking-wider uppercase font-mono text-stone-400">
          {type === 'paints' && 'Surface Coatings · Emulsions'}
          {type === 'laminates' && 'High-Pressure Decorative Laminates'}
          {type === 'plywood' && 'IS:710 Marine Grade BWP'}
          {type === 'chemicals' && 'Integral Waterproofing & Admixtures'}
          {type === 'hardware' && 'Trade Tools & Secure Storage'}
          {type === 'showroom' && 'Trade Counter & Showroom'}
          {type === 'warehouse' && 'Wholesale Distribution Hub'}
        </span>
        <span className="text-[10px] font-mono text-amber-400/80 bg-stone-900/60 px-2 py-0.5 rounded border border-stone-700/50">
          S S TRADERS
        </span>
      </div>

      {/* Center Iconography Graphic */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center mb-3 shadow-inner">
          {type === 'paints' && (
            <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M19 11V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7" />
              <path d="M5 11h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z" />
              <path d="M9 11V8h6v3" />
              <circle cx="12" cy="15" r="1.5" fill="currentColor" />
            </svg>
          )}

          {type === 'laminates' && (
            <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
              <path d="M15 9v12" />
            </svg>
          )}

          {type === 'plywood' && (
            <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          )}

          {type === 'chemicals' && (
            <svg className="w-7 h-7 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M10 2v7.31L4.35 19.4A2 2 0 0 0 6 22h12a2 2 0 0 0 1.65-2.6L14 9.31V2" />
              <path d="M8.5 2h7" />
              <path d="M7 16h10" />
            </svg>
          )}

          {type === 'hardware' && (
            <svg className="w-7 h-7 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          )}

          {type === 'showroom' && (
            <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-3" />
              <path d="M9 9h1" />
              <path d="M9 13h1" />
              <path d="M9 17h1" />
            </svg>
          )}

          {type === 'warehouse' && (
            <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          )}
        </div>

        {title && <h4 className="text-base font-semibold text-stone-100 tracking-tight">{title}</h4>}
        {subtitle && <p className="text-xs text-stone-400 max-w-[240px] mt-1">{subtitle}</p>}
      </div>

      {/* Bottom Technical Spec Footer */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/80 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Verified Commercial Stock</span>
        </span>
        <span className="font-mono text-stone-400">Karnataka, IN</span>
      </div>
    </div>
  );
};
