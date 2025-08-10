import { CalculationInput, CalculationResults, DCAEntry } from "@/types/crypto";

export function calculateProfitLoss(input: CalculationInput): CalculationResults {
  const { investmentAmount, purchasePrice, currentPrice } = input;
  
  const coinAmount = investmentAmount / purchasePrice;
  const currentValue = coinAmount * currentPrice;
  const profitLoss = currentValue - investmentAmount;
  const roiPercentage = (profitLoss / investmentAmount) * 100;
  
  return {
    totalProfit: profitLoss,
    roiPercentage,
    initialInvestment: investmentAmount,
    currentValue,
    profitLoss,
    coinAmount
  };
}

export function calculateFutureProjection(
  input: CalculationInput, 
  targetPrice: number
): CalculationResults {
  const { investmentAmount, purchasePrice } = input;
  
  const coinAmount = investmentAmount / purchasePrice;
  const futureValue = coinAmount * targetPrice;
  const profitLoss = futureValue - investmentAmount;
  const roiPercentage = (profitLoss / investmentAmount) * 100;
  
  return {
    totalProfit: profitLoss,
    roiPercentage,
    initialInvestment: investmentAmount,
    currentValue: futureValue,
    profitLoss,
    coinAmount
  };
}

export function calculateDCA(
  entries: DCAEntry[],
  currentPrice: number
): CalculationResults {
  const totalInvestment = entries.reduce((sum, entry) => sum + entry.investment, 0);
  const totalCoins = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const averagePrice = totalInvestment / totalCoins;
  const currentValue = totalCoins * currentPrice;
  const profitLoss = currentValue - totalInvestment;
  const roiPercentage = (profitLoss / totalInvestment) * 100;
  
  return {
    totalProfit: profitLoss,
    roiPercentage,
    initialInvestment: totalInvestment,
    currentValue,
    profitLoss,
    coinAmount: totalCoins
  };
}

export function generateDCAEntries(
  monthlyInvestment: number,
  startDate: Date,
  endDate: Date,
  priceHistory: Array<{ date: string; price: number }>
): DCAEntry[] {
  const entries: DCAEntry[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    // Find closest price data for this date
    const dateStr = current.toISOString().split('T')[0];
    const priceData = priceHistory.find(p => p.date.startsWith(dateStr)) || 
                     priceHistory[0]; // fallback to first price
    
    if (priceData) {
      const amount = monthlyInvestment / priceData.price;
      const totalValue = entries.reduce((sum, e) => sum + e.total, 0) + (amount * priceData.price);
      const totalInvestment = entries.reduce((sum, e) => sum + e.investment, 0) + monthlyInvestment;
      
      entries.push({
        date: dateStr,
        investment: monthlyInvestment,
        price: priceData.price,
        amount,
        total: totalValue,
        profit: totalValue - totalInvestment
      });
    }
    
    // Move to next month
    current.setMonth(current.getMonth() + 1);
  }
  
  return entries;
}

export function formatCurrency(amount: number, currency: string): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    usd: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    eur: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    gbp: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
    inr: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
  };
  
  return formatters[currency.toLowerCase()]?.format(amount) || `$${amount.toFixed(2)}`;
}

export function formatPercentage(percentage: number): string {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
}
