import { type User, type InsertUser, type CalculationHistory, type InsertCalculationHistory, type CryptoPrices, type InsertCryptoPrices } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCalculation(calculation: InsertCalculationHistory): Promise<CalculationHistory>;
  getCalculationsByUser(userId: string): Promise<CalculationHistory[]>;
  updateCryptoPrice(cryptoPrice: InsertCryptoPrices): Promise<CryptoPrices>;
  getCryptoPrice(cryptocurrency: string, currency: string): Promise<CryptoPrices | undefined>;
  getAllCryptoPrices(): Promise<CryptoPrices[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calculations: Map<string, CalculationHistory>;
  private cryptoPrices: Map<string, CryptoPrices>;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.cryptoPrices = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCalculation(insertCalculation: InsertCalculationHistory): Promise<CalculationHistory> {
    const id = randomUUID();
    const calculation: CalculationHistory = { 
      ...insertCalculation,
      userId: insertCalculation.userId || null,
      id,
      createdAt: new Date()
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getCalculationsByUser(userId: string): Promise<CalculationHistory[]> {
    return Array.from(this.calculations.values()).filter(
      (calc) => calc.userId === userId
    );
  }

  async updateCryptoPrice(insertCryptoPrice: InsertCryptoPrices): Promise<CryptoPrices> {
    const key = `${insertCryptoPrice.cryptocurrency}_${insertCryptoPrice.currency}`;
    const existing = this.cryptoPrices.get(key);
    const id = existing?.id || randomUUID();
    const cryptoPrice: CryptoPrices = {
      ...insertCryptoPrice,
      currency: insertCryptoPrice.currency || "usd",
      id,
      lastUpdated: new Date()
    };
    this.cryptoPrices.set(key, cryptoPrice);
    return cryptoPrice;
  }

  async getCryptoPrice(cryptocurrency: string, currency: string): Promise<CryptoPrices | undefined> {
    const key = `${cryptocurrency}_${currency}`;
    return this.cryptoPrices.get(key);
  }

  async getAllCryptoPrices(): Promise<CryptoPrices[]> {
    return Array.from(this.cryptoPrices.values());
  }
}

export const storage = new MemStorage();
