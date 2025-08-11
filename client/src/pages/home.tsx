import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CryptoLogo } from "@/components/crypto-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalculatorForm } from "@/components/calculator-form";
import { ResultsPanel } from "@/components/results-panel";
import { PriceChart } from "@/components/price-chart";
import { SocialShare } from "@/components/social-share";
import { AnimatedBackground } from "@/components/animated-background";
import { FuturisticLogo, CryptoTextLogo } from "@/components/futuristic-logo";
import { HolographicCard } from "@/components/holographic-card";
import { CyberpunkDataGrid } from "@/components/cyberpunk-data-grid";
import { useCryptoPrices, useCryptoPrice, useCryptoPriceHistory } from "@/hooks/use-crypto-prices";
import { calculateProfitLoss } from "@/lib/calculations";
import { CalculationInput, CalculationResults } from "@/types/crypto";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, TrendingUp, BarChart3, Globe, Zap, Share2, Search } from 'lucide-react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [calculationInput, setCalculationInput] = useState<CalculationInput | null>(null);

  const { data: allPrices } = useCryptoPrices(selectedCurrency);
  const { data: currentPrice } = useCryptoPrice(selectedCrypto, selectedCurrency);
  const { data: priceHistory } = useCryptoPriceHistory(selectedCrypto, selectedCurrency, 30);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleCalculate = (input: CalculationInput) => {
    const results = calculateProfitLoss(input);
    setCalculationResults(results);
    setCalculationInput(input);
    setSelectedCrypto(input.cryptocurrency);
    setSelectedCurrency(input.currency);
  };

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-all duration-300 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary text-white' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900'
    }`}>
      {/* Animated Background */}
      <AnimatedBackground isDark={isDark} />
      <Helmet>
        <title>Free Crypto Profit Calculator 2025 - Track 100+ Cryptocurrencies ROI | Real-Time Investment Calculator</title>
        <meta name="description" content="Calculate cryptocurrency profits & ROI for 100+ coins including Bitcoin, Ethereum, Solana. Free real-time crypto investment calculator with DCA strategy, portfolio tracking & live market data." />
        <meta name="keywords" content="crypto profit calculator, bitcoin calculator, cryptocurrency ROI calculator, investment profit tracker, DCA calculator, crypto portfolio analyzer, real-time crypto prices, cryptocurrency investment calculator, bitcoin profit tracker, ethereum calculator, altcoin calculator" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Sachida" />
        <meta name="language" content="en" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Free Crypto Profit Calculator 2025 - 100+ Cryptocurrencies" />
        <meta property="og:description" content="Calculate cryptocurrency profits & ROI for Bitcoin, Ethereum, Solana and 100+ coins. Real-time prices, DCA strategies, portfolio tracking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CryptoCalc Pro" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CryptoCalcPro" />
        <meta name="twitter:creator" content="@Sachida" />
        <meta name="twitter:title" content="Free Crypto Profit Calculator - 100+ Cryptocurrencies" />
        <meta name="twitter:description" content="Calculate cryptocurrency profits & ROI with real-time data for Bitcoin, Ethereum, Solana and 100+ coins." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#00D4FF" />
        <meta name="msapplication-TileColor" content="#00D4FF" />
        <meta name="application-name" content="CryptoCalc Pro" />
        <meta name="apple-mobile-web-app-title" content="CryptoCalc Pro" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Schema Markup */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CryptoCalc Pro - Crypto Profit Calculator",
          "description": "Advanced cryptocurrency investment calculator with real-time data for 100+ cryptocurrencies",
          "url": typeof window !== 'undefined' ? window.location.href : '',
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Real-time cryptocurrency prices",
            "Profit/Loss calculation",
            "ROI percentage tracking",
            "DCA strategy analysis",
            "Portfolio management",
            "100+ supported cryptocurrencies",
            "Multi-currency support"
          ],
          "screenshot": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
        })}
        </script>
      </Helmet>

      {/* Header */}
      <header className="relative z-50 glass-dark backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <FuturisticLogo size={40} animated={true} />
              <CryptoTextLogo size="md" />
            </div>
            
            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#calculator" className="hover:text-neon-cyan transition-colors duration-300">Calculator</a>
              <a href="#features" className="hover:text-neon-cyan transition-colors duration-300">Features</a>
              <a href="#blog" className="hover:text-neon-cyan transition-colors duration-300">Blog</a>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              
              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden glass hover:bg-white/20 border border-white/20">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080")' }}
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-dark-primary/80 to-dark-secondary/60' 
            : 'bg-gradient-to-r from-white/80 to-gray-100/60'
        }`} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue bg-clip-text text-transparent animate-pulse">
              Free Crypto Profit Calculator 2025
            </h1>
            <h2 className={`text-xl md:text-2xl mb-8 leading-relaxed font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Calculate Bitcoin, Ethereum & 100+ Cryptocurrency Profits with Real-Time Market Data, ROI Tracking & DCA Analysis
            </h2>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={scrollToCalculator}
                className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-2xl hover:shadow-neon-cyan/50 transition-all duration-300 transform hover:scale-105 text-white"
              >
                Start Calculating Now
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-4 glass hover:bg-white/20 border-white/20 transition-all duration-300"
              >
                View Demo
              </Button>
            </div>
            
            {/* Feature Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <HolographicCard glowColor="cyan" animated={true} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-cyan text-neon-glow animate-pulse-glow">100+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cryptocurrencies</div>
                </CardContent>
              </HolographicCard>
              <HolographicCard glowColor="green" animated={true} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-green text-neon-glow animate-pulse-glow">Real-time</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Live Prices</div>
                </CardContent>
              </HolographicCard>
              <HolographicCard glowColor="purple" animated={true} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-purple text-neon-glow animate-pulse-glow">Advanced</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Analytics</div>
                </CardContent>
              </HolographicCard>
              <HolographicCard glowColor="amber" animated={true} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-amber text-neon-glow animate-pulse-glow">Free</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Forever</div>
                </CardContent>
              </HolographicCard>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator */}
      <section id="calculator" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Cryptocurrency Investment Calculator
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calculator Input Panel */}
            <div className="lg:col-span-2">
              <CalculatorForm onCalculate={handleCalculate} />
            </div>
            
            {/* Results Panel */}
            <div>
              <ResultsPanel 
                results={calculationResults || undefined}
                livePrice={currentPrice}
                cryptocurrency={selectedCrypto}
                currency={selectedCurrency}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chart Visualization */}
      {priceHistory && priceHistory.prices.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neon-cyan">Portfolio Analytics</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Price Chart */}
              <PriceChart 
                data={priceHistory.prices}
                cryptocurrency={selectedCrypto}
                currency={selectedCurrency}
              />
              
              {/* Social Share */}
              <div>
                {calculationResults && calculationInput && (
                  <SocialShare 
                    results={calculationResults}
                    cryptocurrency={calculationInput.cryptocurrency}
                    currency={calculationInput.currency}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live Market Data Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue bg-clip-text text-transparent text-neon-glow">
              Live Cryptocurrency Market Data
            </h2>
            <p className={`text-lg leading-relaxed max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Real-time price tracking and market analysis for the top cryptocurrencies with advanced cyberpunk visualization
            </p>
          </div>
          
          <CyberpunkDataGrid prices={allPrices || []} isDark={isDark} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Comprehensive Crypto Investment Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Real-time Data */}
            <HolographicCard glowColor="cyan" animated={true}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-cyan text-neon-glow">Real-Time Cryptocurrency Prices</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Live cryptocurrency prices for 100+ coins including Bitcoin, Ethereum, Solana updated every 30 seconds via secure CoinGecko API connections.
                </p>
              </CardContent>
            </HolographicCard>
            
            {/* Feature 2: Multiple Calculations */}
            <HolographicCard glowColor="purple" animated={true}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-purple text-neon-glow">Advanced Investment Calculation Modes</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Profit/Loss tracking, Future ROI projections, Dollar Cost Averaging (DCA) strategy analysis, and comprehensive cryptocurrency portfolio management.
                </p>
              </CardContent>
            </HolographicCard>
            
            {/* Feature 3: Multi-currency Support */}
            <HolographicCard glowColor="green" animated={true}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-neon-cyan rounded-xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-green text-neon-glow">Multi-currency</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Support for USD, EUR, GBP, INR and more with automatic conversion rates and regional formatting.
                </p>
              </CardContent>
            </HolographicCard>
            
            {/* Feature 4: Advanced Analytics */}
            <HolographicCard glowColor="amber" animated={true}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-amber to-neon-red rounded-xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-amber text-neon-glow">Advanced Analytics</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Interactive charts, profit projections, risk analysis, and comprehensive investment performance metrics.
                </p>
              </CardContent>
            </HolographicCard>
            
            {/* Feature 5: Social Sharing */}
            <HolographicCard glowColor="red" animated={true}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-red to-neon-purple rounded-xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-red text-neon-glow">Complete Social Media Sharing</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Share your crypto profit results across 8+ platforms including Twitter, Facebook, LinkedIn, WhatsApp, Telegram, Reddit, Discord, and Email.
                </p>
              </CardContent>
            </HolographicCard>
            
            {/* Feature 6: SEO Optimized */}
            <HolographicCard glowColor="blue" animated={true}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-blue text-neon-glow">SEO Optimized</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Search engine optimized with meta tags, schema markup, and Core Web Vitals optimization for maximum visibility.
                </p>
              </CardContent>
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Cryptocurrency Calculator Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className={`glass rounded-xl p-6 backdrop-blur-sm ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/30'
            } border`}>
              <h3 className="text-xl font-semibold mb-3 text-neon-cyan">How to Calculate Bitcoin Profit?</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Enter your Bitcoin purchase price, quantity, and current Bitcoin price. Our calculator instantly shows your profit/loss, ROI percentage, and total return value.
              </p>
            </div>
            
            <div className={`glass rounded-xl p-6 backdrop-blur-sm ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/30'
            } border`}>
              <h3 className="text-xl font-semibold mb-3 text-neon-purple">What is DCA Strategy in Crypto?</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Dollar Cost Averaging (DCA) involves regular purchases regardless of price. Our DCA calculator shows how consistent investing reduces volatility risk and improves long-term returns.
              </p>
            </div>
            
            <div className={`glass rounded-xl p-6 backdrop-blur-sm ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/30'
            } border`}>
              <h3 className="text-xl font-semibold mb-3 text-neon-green">Which Cryptocurrencies Does the Calculator Support?</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Our calculator supports 100+ cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Cardano (ADA), Polygon (MATIC), and all major altcoins with real-time pricing.
              </p>
            </div>
            
            <div className={`glass rounded-xl p-6 backdrop-blur-sm ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/30'
            } border`}>
              <h3 className="text-xl font-semibold mb-3 text-neon-amber">How Accurate Are the Price Data Sources?</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                We use CoinGecko API for real-time cryptocurrency prices, ensuring accurate and up-to-date market data from major exchanges worldwide, updated every 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t backdrop-blur-md py-8 ${
        isDark ? 'glass-dark border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <CryptoLogo size={32} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                © 2025 Sachida – All Rights Reserved
              </span>
            </div>
            
            {/* Quick Links */}
            <div className={`flex items-center space-x-6 text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <a href="#calculator" className="hover:text-neon-cyan transition-colors">Calculator</a>
              <a href="#features" className="hover:text-neon-cyan transition-colors">Features</a>
              <a href="#blog" className="hover:text-neon-cyan transition-colors">Blog</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Privacy</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Terms</a>
            </div>
          </div>
          
          {/* Additional Footer Info */}
          <div className={`mt-6 pt-6 border-t text-center text-xs ${
            isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'
          }`}>
            <p>
              Cryptocurrency prices are subject to high market risk and price volatility. 
              You should only invest in products that you are familiar with and understand the associated risks. 
              Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
