import { useQuery } from "@tanstack/react-query";
import { cryptoAPI } from "@/lib/crypto-api";
import { CryptoPriceData } from "@/types/crypto";

export function useCryptoPrices(currency: string = "usd") {
  return useQuery<CryptoPriceData[]>({
    queryKey: ["cryptoPrices", currency],
    queryFn: () => cryptoAPI.getAllPrices(currency),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000 // Consider data stale after 25 seconds
  });
}

export function useCryptoPrice(cryptocurrency: string, currency: string = "usd") {
  return useQuery<CryptoPriceData>({
    queryKey: ["cryptoPrice", cryptocurrency, currency],
    queryFn: () => cryptoAPI.getPrice(cryptocurrency, currency),
    refetchInterval: 30000,
    staleTime: 25000,
    enabled: !!cryptocurrency
  });
}

export function useCryptoPriceHistory(cryptocurrency: string, currency: string = "usd", days: number = 30) {
  return useQuery({
    queryKey: ["cryptoPriceHistory", cryptocurrency, currency, days],
    queryFn: () => cryptoAPI.getPriceHistory(cryptocurrency, currency, days),
    staleTime: 300000, // 5 minutes for historical data
    enabled: !!cryptocurrency
  });
}
