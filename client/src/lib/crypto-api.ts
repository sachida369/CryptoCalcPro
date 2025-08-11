import { CryptoPriceData, PriceHistoryData } from "@/types/crypto";

export class CryptoAPI {
  private baseUrl = "/api";

  async getAllPrices(currency: string = "usd"): Promise<CryptoPriceData[]> {
    const response = await fetch(`${this.baseUrl}/prices?currency=${currency}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`);
    }
    return response.json();
  }

  async getPrice(cryptocurrency: string, currency: string = "usd"): Promise<CryptoPriceData> {
    const response = await fetch(`${this.baseUrl}/prices/${cryptocurrency}?currency=${currency}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${cryptocurrency}: ${response.statusText}`);
    }
    return response.json();
  }

  async getPriceHistory(
    cryptocurrency: string, 
    currency: string = "usd", 
    days: number = 30
  ): Promise<PriceHistoryData> {
    const response = await fetch(
      `${this.baseUrl}/prices/${cryptocurrency}/history?currency=${currency}&days=${days}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch price history for ${cryptocurrency}: ${response.statusText}`);
    }
    return response.json();
  }
}

export const cryptoAPI = new CryptoAPI();
