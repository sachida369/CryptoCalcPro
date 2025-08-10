import React from 'react';

interface AnimatedBackgroundProps {
  isDark: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDark }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-neon-cyan' : 'bg-blue-400'
            } opacity-60 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-32 h-32 border border-neon-purple/20 rotate-45 animate-spin-slow`} />
        <div className={`absolute top-40 right-20 w-24 h-24 border border-neon-cyan/20 rotate-12 animate-pulse`} />
        <div className={`absolute bottom-40 left-20 w-40 h-40 border border-neon-blue/20 -rotate-12 animate-spin-slow`} />
        <div className={`absolute bottom-20 right-10 w-28 h-28 border border-neon-green/20 rotate-45 animate-bounce-slow`} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 rounded-full blur-xl animate-pulse`} />
        <div className={`absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 rounded-full blur-xl animate-pulse`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-neon-green/10 to-neon-amber/10 rounded-full blur-xl animate-pulse`} style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Grid Pattern */}
      <div className={`absolute inset-0 opacity-5 ${isDark ? 'bg-grid-white' : 'bg-grid-black'}`} />
    </div>
  );
};