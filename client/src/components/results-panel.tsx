import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResults, CryptoPriceData } from "@/types/crypto";
import { formatCurrency, formatPercentage } from "@/lib/calculations";

interface ResultsPanelProps {
  results?: CalculationResults;
  livePrice?: CryptoPriceData;
  cryptocurrency: string;
  currency: string;
  isLoading?: boolean;
}

export function ResultsPanel({ 
  results, 
  livePrice, 
  cryptocurrency, 
  currency,
  isLoading = false 
}: ResultsPanelProps) {
  const isPositive = results ? results.totalProfit >= 0 : false;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-dark animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-8 bg-gray-600 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Price Display */}
      <Card className="glass-dark">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neon-cyan">Live Price Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">{cryptocurrency.toUpperCase()}</span>
            <span className="text-white font-semibold">
              {livePrice ? formatCurrency(livePrice.price, currency) : "Loading..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">24h Change</span>
            <span 
              className={`font-semibold flex items-center gap-1 ${
                livePrice && livePrice.change24h >= 0 ? 'text-neon-green' : 'text-neon-red'
              }`}
            >
              {livePrice && livePrice.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {livePrice ? formatPercentage(livePrice.change24h) : "0.00%"}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {livePrice ? new Date(livePrice.lastUpdated).toLocaleString() : "Never"}
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      <Card className="glass-dark">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neon-cyan">Calculation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results ? (
            <>
              {/* Total Profit */}
              <div className={`p-4 rounded-xl border ${
                isPositive 
                  ? 'bg-gradient-to-r from-neon-green/20 to-emerald-500/20 border-neon-green/30' 
                  : 'bg-gradient-to-r from-neon-red/20 to-red-500/20 border-neon-red/30'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <div className="text-sm text-gray-300">Total Profit/Loss</div>
                </div>
                <div className={`text-2xl font-bold ${isPositive ? 'text-neon-green' : 'text-neon-red'}`}>
                  {formatCurrency(results.totalProfit, currency)}
                </div>
              </div>

              {/* ROI Percentage */}
              <div className={`p-4 rounded-xl border ${
                isPositive 
                  ? 'bg-gradient-to-r from-neon-purple/20 to-violet-500/20 border-neon-purple/30'
                  : 'bg-gradient-to-r from-neon-red/20 to-red-500/20 border-neon-red/30'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4" />
                  <div className="text-sm text-gray-300">ROI Percentage</div>
                </div>
                <div className={`text-2xl font-bold ${isPositive ? 'text-neon-purple' : 'text-neon-red'}`}>
                  {formatPercentage(results.roiPercentage)}
                </div>
              </div>

              {/* Investment Summary */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-400">Initial Investment</div>
                  <div className="font-semibold">{formatCurrency(results.initialInvestment, currency)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Current Value</div>
                  <div className="font-semibold">{formatCurrency(results.currentValue, currency)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Coin Amount</div>
                  <div className="font-semibold">{results.coinAmount.toFixed(8)} {cryptocurrency.toUpperCase()}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter your investment details to see results</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AdSense Ad Space */}
      <Card className="glass-dark">
        <CardContent className="p-6">
          <div className="text-center text-gray-500 text-sm mb-4">Advertisement</div>
          <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
            <span className="text-gray-600">Google AdSense</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
