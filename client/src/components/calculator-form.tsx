import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculationInput, SUPPORTED_CRYPTOS, SUPPORTED_CURRENCIES } from "@/types/crypto";
import { useCryptoPrice } from "@/hooks/use-crypto-prices";

interface CalculatorFormProps {
  onCalculate: (input: CalculationInput) => void;
  isLoading?: boolean;
}

type CalculationType = 'profit-loss' | 'future-projection' | 'dca' | 'portfolio';

export function CalculatorForm({ onCalculate, isLoading = false }: CalculatorFormProps) {
  const [calculationType, setCalculationType] = useState<CalculationType>('profit-loss');
  const [cryptocurrency, setCryptocurrency] = useState('bitcoin');
  const [currency, setCurrency] = useState('usd');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Default to 1 month ago
    return date.toISOString().split('T')[0];
  });

  const { data: currentPriceData, isLoading: isPriceLoading } = useCryptoPrice(cryptocurrency, currency);

  // Update purchase price when crypto or currency changes
  useEffect(() => {
    if (currentPriceData && !purchasePrice) {
      setPurchasePrice(currentPriceData.price.toString());
    }
  }, [currentPriceData, purchasePrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!investmentAmount || !purchasePrice || !currentPriceData) return;

    const input: CalculationInput = {
      cryptocurrency,
      investmentAmount: parseFloat(investmentAmount),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: currentPriceData.price,
      purchaseDate,
      currency,
      calculationType
    };

    onCalculate(input);
  };

  const calculationModes = [
    { id: 'profit-loss', name: 'Profit/Loss', icon: TrendingUp, description: 'Calculate current profit or loss' },
    { id: 'future-projection', name: 'Future ROI', icon: BarChart3, description: 'Project future returns' },
    { id: 'dca', name: 'DCA Strategy', icon: Calculator, description: 'Dollar-cost averaging analysis' },
    { id: 'portfolio', name: 'Portfolio', icon: PieChart, description: 'Portfolio management' }
  ];

  return (
    <div className="space-y-6">
      {/* Calculation Mode Selector */}
      <Card className="glass-dark">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neon-cyan">Calculation Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {calculationModes.map(mode => {
              const Icon = mode.icon;
              const isActive = calculationType === mode.id;
              return (
                <Button
                  key={mode.id}
                  variant={isActive ? "default" : "outline"}
                  className={`p-4 h-auto flex-col gap-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30' 
                      : 'glass hover:bg-white/10 border-white/20'
                  }`}
                  onClick={() => setCalculationType(mode.id as CalculationType)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{mode.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Calculator Form */}
      <Card className="glass-dark">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cryptocurrency and Currency Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="crypto-select" className="text-gray-300">Cryptocurrency</Label>
                <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
                  <SelectTrigger 
                    id="crypto-select"
                    className="glass-dark border border-gray-600 bg-dark-tertiary text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-tertiary border-gray-600">
                    {SUPPORTED_CRYPTOS.map(crypto => (
                      <SelectItem key={crypto.id} value={crypto.id} className="text-white hover:bg-white/10">
                        {crypto.name} ({crypto.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency-select" className="text-gray-300">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger 
                    id="currency-select"
                    className="glass-dark border border-gray-600 bg-dark-tertiary text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-tertiary border-gray-600">
                    {SUPPORTED_CURRENCIES.map(curr => (
                      <SelectItem key={curr.id} value={curr.id} className="text-white hover:bg-white/10">
                        {curr.name} ({curr.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Investment Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="investment-amount" className="text-gray-300">Investment Amount</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  placeholder="1000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="glass-dark border border-gray-600 bg-dark-tertiary text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-price" className="text-gray-300">Purchase Price</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  placeholder="50000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="glass-dark border border-gray-600 bg-dark-tertiary text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Date and Current Price */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purchase-date" className="text-gray-300">Purchase Date</Label>
                <Input
                  id="purchase-date"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="glass-dark border border-gray-600 bg-dark-tertiary text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-price" className="text-gray-300">Current Price</Label>
                <div className="relative">
                  <Input
                    id="current-price"
                    type="number"
                    placeholder="Loading..."
                    value={currentPriceData?.price || ''}
                    className="glass-dark border border-gray-600 bg-dark-tertiary text-white pr-10"
                    readOnly
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        isPriceLoading ? 'bg-yellow-500 animate-pulse' : 'bg-neon-green animate-pulse'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <Button 
              type="submit" 
              disabled={isLoading || isPriceLoading || !investmentAmount || !purchasePrice}
              className="w-full p-4 bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-2xl hover:shadow-neon-cyan/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Calculating...
                </div>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Profit & ROI
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
