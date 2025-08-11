// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  calculations;
  cryptoPrices;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.calculations = /* @__PURE__ */ new Map();
    this.cryptoPrices = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createCalculation(insertCalculation) {
    const id = randomUUID();
    const calculation = {
      ...insertCalculation,
      userId: insertCalculation.userId || null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.calculations.set(id, calculation);
    return calculation;
  }
  async getCalculationsByUser(userId) {
    return Array.from(this.calculations.values()).filter(
      (calc) => calc.userId === userId
    );
  }
  async updateCryptoPrice(insertCryptoPrice) {
    const key = `${insertCryptoPrice.cryptocurrency}_${insertCryptoPrice.currency}`;
    const existing = this.cryptoPrices.get(key);
    const id = existing?.id || randomUUID();
    const cryptoPrice = {
      ...insertCryptoPrice,
      currency: insertCryptoPrice.currency || "usd",
      id,
      lastUpdated: /* @__PURE__ */ new Date()
    };
    this.cryptoPrices.set(key, cryptoPrice);
    return cryptoPrice;
  }
  async getCryptoPrice(cryptocurrency, currency) {
    const key = `${cryptocurrency}_${currency}`;
    return this.cryptoPrices.get(key);
  }
  async getAllCryptoPrices() {
    return Array.from(this.cryptoPrices.values());
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var calculationHistory = pgTable("calculation_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  cryptocurrency: text("cryptocurrency").notNull(),
  investmentAmount: decimal("investment_amount", { precision: 20, scale: 8 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 20, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  currency: text("currency").notNull().default("usd"),
  calculationType: text("calculation_type").notNull(),
  // profit-loss, future-projection, dca, portfolio
  results: jsonb("results").notNull(),
  // Store calculation results
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var cryptoPrices = pgTable("crypto_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cryptocurrency: text("cryptocurrency").notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull().default("usd"),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertCalculationHistorySchema = createInsertSchema(calculationHistory).omit({
  id: true,
  createdAt: true
});
var insertCryptoPricesSchema = createInsertSchema(cryptoPrices).omit({
  id: true,
  lastUpdated: true
});

// server/routes.ts
var COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
var CRYPTO_ID_MAP = {
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
var RateLimiter = class {
  lastCall = 0;
  minInterval = 6e3;
  // 6 seconds between calls for safety
  async waitForNextCall() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastCall = Date.now();
  }
};
var rateLimiter = new RateLimiter();
async function registerRoutes(app2) {
  app2.get("/api/prices", async (req, res) => {
    try {
      const { currency = "usd" } = req.query;
      const cryptoIds = Object.values(CRYPTO_ID_MAP).join(",");
      await rateLimiter.waitForNextCall();
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${cryptoIds}&vs_currencies=${currency}&include_24hr_change=true`
      );
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      const data = await response.json();
      const prices = [];
      for (const [cryptoKey, coinGeckoId] of Object.entries(CRYPTO_ID_MAP)) {
        const priceData = data[coinGeckoId];
        if (priceData) {
          const price = priceData[currency];
          const change24h = priceData[`${currency}_24h_change`];
          const cryptoPrice = await storage.updateCryptoPrice({
            cryptocurrency: cryptoKey,
            price: price.toString(),
            currency,
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
  app2.get("/api/prices/:crypto", async (req, res) => {
    try {
      const { crypto } = req.params;
      const { currency = "usd" } = req.query;
      const coinGeckoId = CRYPTO_ID_MAP[crypto];
      if (!coinGeckoId) {
        return res.status(404).json({ error: "Cryptocurrency not supported" });
      }
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
      const price = priceData[currency];
      const change24h = priceData[`${currency}_24h_change`];
      const cryptoPrice = await storage.updateCryptoPrice({
        cryptocurrency: crypto,
        price: price.toString(),
        currency,
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
  app2.get("/api/prices/:crypto/history", async (req, res) => {
    try {
      const { crypto } = req.params;
      const { currency = "usd", days = "30" } = req.query;
      const coinGeckoId = CRYPTO_ID_MAP[crypto];
      if (!coinGeckoId) {
        return res.status(404).json({ error: "Cryptocurrency not supported" });
      }
      await rateLimiter.waitForNextCall();
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinGeckoId}/market_chart?vs_currency=${currency}&days=${days}`
      );
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      const data = await response.json();
      const priceHistory = data.prices.map((price) => ({
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
  app2.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertCalculationHistorySchema.parse(req.body);
      const calculation = await storage.createCalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      console.error("Error saving calculation:", error);
      res.status(400).json({ error: "Invalid calculation data" });
    }
  });
  app2.get("/api/calculations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const calculations = await storage.getCalculationsByUser(userId);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
