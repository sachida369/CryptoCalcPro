import React from 'react';

interface CryptoLogoProps {
  size?: number;
  className?: string;
}

export function CryptoLogo({ size = 40, className = "" }: CryptoLogoProps) {
  return (
    <div 
      className={`rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 2L13 8H18L15 12L16 18L12 15L8 18L9 12L6 8H11L12 2Z" 
          fill="white"
          className="drop-shadow-md"
        />
      </svg>
    </div>
  );
}
