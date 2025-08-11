import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'blue' | 'green' | 'amber' | 'red';
  animated?: boolean;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  animated = true 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const glowColors = {
    cyan: 'shadow-neon-cyan/50 border-neon-cyan/30',
    purple: 'shadow-neon-purple/50 border-neon-purple/30',
    blue: 'shadow-neon-blue/50 border-neon-blue/30',
    green: 'shadow-neon-green/50 border-neon-green/30',
    amber: 'shadow-neon-amber/50 border-neon-amber/30',
    red: 'shadow-neon-red/50 border-neon-red/30'
  };

  return (
    <div 
      className={`relative group ${animated ? 'transform transition-all duration-300 hover:scale-105' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Reflection */}
      {animated && isHovered && (
        <div 
          className="absolute inset-0 opacity-30 rounded-xl pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}
        />
      )}
      
      {/* Main Card */}
      <Card className={`
        relative glass-dark backdrop-blur-xl border-2 transition-all duration-300
        ${animated ? `hover:${glowColors[glowColor]} hover:shadow-2xl` : ''}
        ${className}
      `}>
        {/* Animated Border Gradient */}
        {animated && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-shimmer" />
        )}
        
        {/* Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan/60 rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-neon-purple/60 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-neon-blue/60 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-neon-green/60 rounded-br" />
        
        {children}
      </Card>
      
      {/* Outer Glow */}
      {animated && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-blue/10 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10`} />
      )}
    </div>
  );
};