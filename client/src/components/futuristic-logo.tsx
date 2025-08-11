import React from 'react';

interface FuturisticLogoProps {
  size?: number;
  animated?: boolean;
}

export const FuturisticLogo: React.FC<FuturisticLogoProps> = ({ size = 40, animated = true }) => {
  return (
    <div className={`relative ${animated ? 'group' : ''}`} style={{ width: size, height: size }}>
      {/* Outer Ring */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={`absolute inset-0 ${animated ? 'group-hover:animate-spin-slow' : ''}`}
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="1"
          className="drop-shadow-neon-cyan"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Inner Hexagon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={`absolute inset-0 ${animated ? 'group-hover:animate-spin-reverse' : ''}`}
      >
        <polygon
          points="20,6 30,13 30,27 20,34 10,27 10,13"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          className="drop-shadow-neon-purple"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Crystal */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={`absolute inset-0 ${animated ? 'group-hover:animate-pulse' : ''}`}
      >
        <polygon
          points="20,12 26,16 26,24 20,28 14,24 14,16"
          fill="url(#gradient3)"
          className="drop-shadow-neon-blue"
        />
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Glow Effect */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
      )}
    </div>
  );
};

// Alternative Text-based Logo
export const CryptoTextLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="relative group">
      <span className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue bg-clip-text text-transparent group-hover:animate-pulse`}>
        CryptoCalc
      </span>
      <span className={`${sizeClasses[size]} font-light bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent ml-1`}>
        Pro
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 blur-xl group-hover:blur-2xl transition-all duration-300 -z-10" />
    </div>
  );
};