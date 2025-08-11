import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { formatCurrency } from "@/lib/calculations";

interface CryptoPriceData {
  cryptocurrency: string;
  price: number;
  currency: string;
  change_24h?: number;
}

interface CyberpunkDataGridProps {
  prices: CryptoPriceData[];
  isDark: boolean;
}

export const CyberpunkDataGrid: React.FC<CyberpunkDataGridProps> = ({ prices, isDark }) => {
  const [animatedPrices, setAnimatedPrices] = useState<Record<string, number>>({});
  const [flashingCrypto, setFlashingCrypto] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (prices.length > 0) {
      const newAnimatedPrices: Record<string, number> = {};
      const newFlashing = new Set<string>();

      prices.forEach(price => {
        const oldPrice = animatedPrices[price.cryptocurrency];
        newAnimatedPrices[price.cryptocurrency] = price.price;
        
        if (oldPrice && oldPrice !== price.price) {
          newFlashing.add(price.cryptocurrency);
        }
      });

      setAnimatedPrices(newAnimatedPrices);
      setFlashingCrypto(newFlashing);

      // Clear flashing effect after animation
      const timeout = setTimeout(() => {
        setFlashingCrypto(new Set());
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [prices]);

  const getRandomBinaryString = (length: number) => {
    return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('');
  };

  const getCryptoIcon = (crypto: string) => {
    const icons: Record<string, string> = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      solana: '◎',
      cardano: '₳',
      ripple: '✕',
      dogecoin: 'Ð',
      polygon: '⬟',
      litecoin: 'Ł'
    };
    return icons[crypto] || '●';
  };

  const topCryptos = prices.slice(0, 8);

  return (
    <div className="relative">
      {/* Matrix-style background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-xs opacity-20 ${isDark ? 'text-neon-green' : 'text-green-500'} font-mono animate-matrix-rain`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          >
            {getRandomBinaryString(40)}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCryptos.map((price) => {
          const isFlashing = flashingCrypto.has(price.cryptocurrency);
          const isPositive = (price.change_24h || 0) >= 0;
          
          return (
            <div
              key={price.cryptocurrency}
              className={`
                relative group overflow-hidden rounded-xl p-4 transition-all duration-500
                ${isDark ? 'bg-black/60' : 'bg-white/60'} 
                backdrop-blur-xl border-2 
                ${isFlashing 
                  ? 'border-neon-cyan animate-pulse-glow' 
                  : 'border-gray-700/50 hover:border-neon-cyan/50'
                }
                hover:scale-105 hover:shadow-2xl hover:shadow-neon-cyan/20
              `}
            >
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Corner decorations */}
              <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-neon-cyan/60" />
              <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-neon-purple/60" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-neon-blue/60" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-neon-green/60" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl text-neon-cyan animate-pulse-glow">
                      {getCryptoIcon(price.cryptocurrency)}
                    </span>
                    <span className="text-sm font-mono uppercase tracking-wider text-neon-cyan">
                      {price.cryptocurrency.replace('-', ' ')}
                    </span>
                  </div>
                  <Activity className="w-4 h-4 text-neon-green animate-pulse" />
                </div>
                
                {/* Price */}
                <div className="mb-2">
                  <div className={`text-2xl font-bold font-mono ${
                    isFlashing ? 'animate-pulse-glow text-neon-cyan' : 'text-white'
                  }`}>
                    {formatCurrency(price.price, price.currency)}
                  </div>
                </div>
                
                {/* Change */}
                {price.change_24h !== undefined && (
                  <div className="flex items-center space-x-1">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-neon-green" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-neon-red" />
                    )}
                    <span className={`text-sm font-mono ${
                      isPositive ? 'text-neon-green' : 'text-neon-red'
                    }`}>
                      {isPositive ? '+' : ''}{price.change_24h.toFixed(2)}%
                    </span>
                  </div>
                )}
                
                {/* Pulse indicator */}
                <div className="absolute top-2 right-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isFlashing ? 'bg-neon-cyan animate-ping' : 'bg-neon-green animate-pulse'
                  }`} />
                </div>
              </div>
              
              {/* Scanning line effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
            </div>
          );
        })}
      </div>
      
      {/* Status bar */}
      <div className={`mt-6 p-3 rounded-lg ${isDark ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-md border border-neon-cyan/30`}>
        <div className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="text-neon-green">LIVE</span>
            </div>
            <div className="text-gray-400">
              {new Date().toLocaleTimeString()} UTC
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-neon-cyan" />
            <span className="text-neon-cyan">MARKET FEED</span>
          </div>
        </div>
      </div>
    </div>
  );
};