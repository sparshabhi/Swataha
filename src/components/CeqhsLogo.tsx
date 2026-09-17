import React from 'react';

interface CeqhsLogoProps {
  className?: string;
  size?: number; // Target height in px (defaults to 55)
  showWordmark?: boolean;
  subtitle?: string;
}

export const CeqhsLogo: React.FC<CeqhsLogoProps> = ({
  className = '',
  size = 55,
  showWordmark = false,
  subtitle = 'Living Field Journal',
}) => {
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <img
        src="https://ibb.co/8nxMTMnN"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png') {
            target.src = 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png';
          } else if (target.src !== '/ceqhs-logo.png') {
            target.src = '/ceqhs-logo.png';
          }
        }}
        alt="CEQHS Official Logo"
        style={{
          height: `${size}px`,
          width: 'auto',
          objectFit: 'contain',
          flexShrink: 0,
          borderRadius: '0',
        }}
      />

      {showWordmark && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center' }}>
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#0D1B2A]">
              CEQHS
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#EAF0EB] text-[#4A6B53]">
              Consortium
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium tracking-normal -mt-0.5">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
