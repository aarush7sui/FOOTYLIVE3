'use client';

import React from 'react';

interface TeamLogoProps {
  logo?: string;
  name: string;
  className?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({
  logo,
  name,
  className = 'h-5 w-5',
}) => {
  if (logo && (logo.startsWith('http') || logo.startsWith('/'))) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${className} object-contain inline-block flex-shrink-0`}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            const fallback = document.createElement('span');
            fallback.innerText = '⚽';
            target.parentElement.appendChild(fallback);
          }
        }}
      />
    );
  }
  return <span className="inline-block flex-shrink-0">{logo || '⚽'}</span>;
};
