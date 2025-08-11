import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const calculationHistory = pgTable("calculation_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  cryptocurrency: text("cryptocurrency").notNull(),
  investmentAmount: decimal("investment_amount", { precision: 20, scale: 8 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 20, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  currency: text("currency").notNull().default("usd"),
  calculationType: text("calculation_type").notNull(), // profit-loss, future-projection, dca, portfolio
  results: jsonb("results").notNull(), // Store calculation results
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cryptoPrices = pgTable("crypto_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cryptocurrency: text("cryptocurrency").notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull().default("usd"),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCalculationHistorySchema = createInsertSchema(calculationHistory).omit({
  id: true,
  createdAt: true,
});

export const insertCryptoPricesSchema = createInsertSchema(cryptoPrices).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CalculationHistory = typeof calculationHistory.$inferSelect;
export type InsertCalculationHistory = z.infer<typeof insertCalculationHistorySchema>;
export type CryptoPrices = typeof cryptoPrices.$inferSelect;
export type InsertCryptoPrices = z.infer<typeof insertCryptoPricesSchema>;
