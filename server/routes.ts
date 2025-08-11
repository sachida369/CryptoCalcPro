import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationHistorySchema, insertCryptoPricesSchema } from "@shared/schema";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

// Top 100 cryptocurrencies mapping (CoinGecko IDs)
const CRYPTO_ID_MAP: Record<string, string> = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  tether: "tether",
  "binance-coin": "binancecoin",
  solana: "solana",
  "usd-coin": "usd-coin",
  xrp: "ripple",
  dogecoin: "dogecoin",
  cardano: "cardano",
  avalanche: "avalanche-2",
  "shiba-inu": "shiba-inu",
  "chainlink": "chainlink",
  "bitcoin-cash": "bitcoin-cash",
  polkadot: "polkadot",
  polygon: "matic-network",
  litecoin: "litecoin",
  "wrapped-bitcoin": "wrapped-bitcoin",
  "dai": "dai",
  "uniswap": "uniswap",
  "ethereum-classic": "ethereum-classic",
  "stellar": "stellar",
  "filecoin": "filecoin",
  "cosmos": "cosmos",
  "algorand": "algorand",
  "vechain": "vechain",
  "hedera": "hedera-hashgraph",
  "internet-computer": "internet-computer",
  "the-sandbox": "the-sandbox",
  "decentraland": "decentraland",
  "theta": "theta-token",
  "elrond": "elrond-erd-2",
  "ftx-token": "ftx-token",
  "aave": "aave",
  "axie-infinity": "axie-infinity",
  "eos": "eos",
  "tezos": "tezos",
  "flow": "flow",
  "pancakeswap": "pancakeswap-token",
  "klaytn": "klay-token",
  "bitcoin-sv": "bitcoin-cash-sv",
  "fantom": "fantom",
  "compound": "compound-governance-token",
  "maker": "maker",
  "neo": "neo",
  "kucoin": "kucoin-shares",
  "celsius": "celsius-degree-token",
  "waves": "waves",
  "amp": "amp-token",
  "helium": "helium",
  "terra-luna": "terra-luna",
  "near": "near",
  "thorchain": "thorchain",
  "monero": "monero",
  "iota": "iota",
  "kusama": "kusama",
  "zcash": "zcash",
  "dash": "dash",
  "enjin": "enjincoin",
  "sushi": "sushi",
  "yearn-finance": "yearn-finance",
  "chiliz": "chiliz",
  "harmony": "harmony",
  "curve": "curve-dao-token",
  "1inch": "1inch",
  "quant": "quant-network",
  "gala": "gala",
  "immutable-x": "immutable-x",
  "loopring": "loopring",
  "basic-attention": "basic-attention-token",
  "zilliqa": "zilliqa",
  "decred": "decred",
  "mina": "mina-protocol",
  "ocean": "ocean-protocol",
  "livepeer": "livepeer",
  "raydium": "raydium",
  "serum": "serum",
  "celo": "celo",
  "omg": "omisego",
  "arweave": "arweave",
  "ren": "republic-protocol",
  "nervos": "nervos-network",
  "icon": "icon",
  "qtum": "qtum",
  "theta-fuel": "theta-fuel",
  "ravencoin": "ravencoin",
  "digibyte": "digibyte",
  "bittorrent": "bittorrent-2",
  "pirate-chain": "pirate-chain",
  "golem": "golem",
  "storj": "storj",
  "civic": "civic",
  "status": "status",
  "syscoin": "syscoin",
  "stacks": "blockstack",
  "verge": "verge",
  "wax": "wax",
  "ankr": "ankr",
  "fetch-ai": "fetch-ai",
  "nano": "nano",
  "holo": "holo",
  "request": "request-network",
  "polymath": "polymath"
};

// Rate limiting for CoinGecko API (free tier: 5-10 calls per minute)
class RateLimiter {
  private lastCall = 0;
  private minInterval = 6000; // 6 seconds between calls for safety

  async waitForNextCall() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastCall = Date.now();
  }
}

const rateLimiter = new RateLimiter();

export async function registerRoutes(app: Express): Promise<Server> {
  // Get live crypto prices
  app.get("/api/prices", async (req, res) => {
    try {
      const { currency = "usd" } = req.query;
      const cryptoIds = Object.values(CRYPTO_ID_MAP).join(",");
      
      // Rate limiting to prevent API abuse
      await rateLimiter.waitForNextCall();
      
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${cryptoIds}&vs_currencies=${currency}&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const prices = [];
      
      // Update storage and format response
      for (const [cryptoKey, coinGeckoId] of Object.entries(CRYPTO_ID_MAP)) {
        const priceData = data[coinGeckoId];
        if (priceData) {
          const price = priceData[currency as string];
          const change24h = priceData[`${currency}_24h_change`];
          
          const cryptoPrice = await storage.updateCryptoPrice({
            cryptocurrency: cryptoKey,
            price: price.toString(),
            currency: currency as string,
            change24h: change24h ? change24h.toString() : null
          });
          
          prices.push({
            cryptocurrency: cryptoKey,
            price: parseFloat(cryptoPrice.price),
            currency: cryptoPrice.currency,
            change24h: cryptoPrice.change24h ? parseFloat(cryptoPrice.change24h) : 0,
            lastUpdated: cryptoPrice.lastUpdated
          });
        }
      }
      
      res.json(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      res.status(500).json({ error: "Failed to fetch crypto prices" });
    }
  });

  // Get specific crypto price
  app.get("/api/prices/:crypto", async (req, res) => {
    try {
      const { crypto } = req.params;
      const { currency = "usd" } = req.query;
      
      const coinGeckoId = CRYPTO_ID_MAP[crypto];
      if (!coinGeckoId) {
        return res.status(404).json({ error: "Cryptocurrency not supported" });
      }
      
      // Rate limiting to prevent API abuse
      await rateLimiter.waitForNextCall();
      
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinGeckoId}&vs_currencies=${currency}&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const priceData = data[coinGeckoId];
      
      if (!priceData) {
        return res.status(404).json({ error: "Price data not found" });
      }
      
      const price = priceData[currency as string];
      const change24h = priceData[`${currency}_24h_change`];
      
      const cryptoPrice = await storage.updateCryptoPrice({
        cryptocurrency: crypto,
        price: price.toString(),
        currency: currency as string,
        change24h: change24h ? change24h.toString() : null
      });
      
      res.json({
        cryptocurrency: crypto,
        price: parseFloat(cryptoPrice.price),
        currency: cryptoPrice.currency,
        change24h: cryptoPrice.change24h ? parseFloat(cryptoPrice.change24h) : 0,
        lastUpdated: cryptoPrice.lastUpdated
      });
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      res.status(500).json({ error: "Failed to fetch crypto price" });
    }
  });

  // Get historical price data
  app.get("/api/prices/:crypto/history", async (req, res) => {
    try {
      const { crypto } = req.params;
      const { currency = "usd", days = "30" } = req.query;
      
      const coinGeckoId = CRYPTO_ID_MAP[crypto];
      if (!coinGeckoId) {
        return res.status(404).json({ error: "Cryptocurrency not supported" });
      }
      
      // Rate limiting to prevent API abuse
      await rateLimiter.waitForNextCall();
      
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinGeckoId}/market_chart?vs_currency=${currency}&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format price history data
      const priceHistory = data.prices.map((price: [number, number]) => ({
        timestamp: price[0],
        price: price[1],
        date: new Date(price[0]).toISOString()
      }));
      
      res.json({
        cryptocurrency: crypto,
        currency,
        prices: priceHistory
      });
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // Save calculation
  app.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertCalculationHistorySchema.parse(req.body);
      const calculation = await storage.createCalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      console.error("Error saving calculation:", error);
      res.status(400).json({ error: "Invalid calculation data" });
    }
  });

  // Get calculations by user
  app.get("/api/calculations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const calculations = await storage.getCalculationsByUser(userId);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
