import { GOODS } from '../database/goods.js';
import { Good, BuyResult, SellResult } from './types';

/**
 * Continuous pricing function P(S) per good definition.
 * Returns the price of a single unit given current stock S, scaled by city population.
 */
export function pricePerUnit(goodDef: Good, currentStock: number, totalPopulation: number = 1000): number {
  const { pMin, pMax, sMin, sMax } = goodDef;
  const scale = totalPopulation / 1000;
  const scaledMin = sMin * scale;
  const scaledMax = sMax * scale;

  if (currentStock <= scaledMin) return pMax;
  if (currentStock >= scaledMax) return pMin;
  return pMax - ((currentStock - scaledMin) / (scaledMax - scaledMin)) * (pMax - pMin);
}

/**
 * Calculate total cost to buy Q units: sum of marginal prices as stock decreases.
 * The market's stock is simulated downward unit-by-unit to get the real cost.
 */
export function totalBuyCost(goodDef: Good, currentStock: number, quantity: number, totalPopulation: number = 1000): { total: number; endStock: number } {
  let simStock = currentStock;
  let total = 0;
  for (let i = 0; i < quantity; i++) {
    const unitPrice = pricePerUnit(goodDef, simStock, totalPopulation);
    total += unitPrice;
    simStock -= 1;
  }
  return { total, endStock: simStock };
}

/**
 * Calculate total revenue to sell Q units: sum of marginal prices as stock increases.
 */
export function totalSellRevenue(goodDef: Good, currentStock: number, quantity: number, totalPopulation: number = 1000): { total: number; endStock: number } {
  let simStock = currentStock;
  let total = 0;
  for (let i = 0; i < quantity; i++) {
    const unitPrice = pricePerUnit(goodDef, simStock, totalPopulation);
    total += unitPrice;
    simStock += 1;
  }
  return { total, endStock: simStock };
}

/**
 * Market holding inventory for one good in a city.
 */
export class MarketGood {
  goodId: string;
  stock: number;

  constructor(goodId: string) {
    this.goodId = goodId;
    this.stock = 0;
  }
}

/**
 * City market - container of all traded goods with dynamic pricing.
 */
export class Market {
  goods: Record<string, { stock: number }>;
  city?: any;

  constructor(city?: any) {
    this.city = city;
    this.goods = {};
    const popFactor = city ? city.totalPopulation / 1000 : 1;
    for (const g of (GOODS as unknown as Good[])) {
      const initial = (g.sMin * popFactor) + Math.floor(Math.random() * ((g.sMax - g.sMin) * popFactor) * 0.3);
      this.goods[g.id] = { stock: initial };
    }
  }

  get totalPopulation(): number {
    return this.city ? this.city.totalPopulation : 1000;
  }

  getPrice(goodId: string): number {
    const g = (GOODS as unknown as Good[]).find(x => x.id === goodId);
    if (!g) return 0;
    return pricePerUnit(g, this.goods[goodId]?.stock ?? 0, this.totalPopulation);
  }

  quoteBuy(goodId: string, quantity: number): BuyResult | null {
    const g = (GOODS as unknown as Good[]).find(x => x.id === goodId);
    if (!g) return null;
    const entry = this.goods[goodId];
    if (!entry || entry.stock < quantity) return null;
    const result = totalBuyCost(g, entry.stock, quantity, this.totalPopulation);
    return { cost: result.total, quantity };
  }

  quoteSell(goodId: string, quantity: number): SellResult | null {
    const g = (GOODS as unknown as Good[]).find(x => x.id === goodId);
    if (!g) return null;
    const entry = this.goods[goodId];
    if (!entry) return null;
    const result = totalSellRevenue(g, entry.stock, quantity, this.totalPopulation);
    return { revenue: result.total, quantity };
  }

  buy(goodId: string, quantity: number): BuyResult | null {
    const g = (GOODS as unknown as Good[]).find(x => x.id === goodId);
    if (!g) return null;
    const entry = this.goods[goodId];
    if (!entry || entry.stock < quantity) return null;
    const result = totalBuyCost(g, entry.stock, quantity, this.totalPopulation);
    entry.stock = result.endStock;
    return { cost: result.total, quantity };
  }

  sell(goodId: string, quantity: number): SellResult | null {
    const g = (GOODS as unknown as Good[]).find(x => x.id === goodId);
    if (!g) return null;
    const entry = this.goods[goodId];
    if (!entry) return null;
    const result = totalSellRevenue(g, entry.stock, quantity, this.totalPopulation);
    entry.stock = result.endStock;
    return { revenue: result.total, quantity };
  }

  addStock(goodId: string, amount: number): void {
    if (!this.goods[goodId]) this.goods[goodId] = { stock: 0 };
    this.goods[goodId].stock += amount;
  }

  removeStock(goodId: string, amount: number): boolean {
    if (!this.goods[goodId]) return false;
    if (this.goods[goodId].stock < amount) return false;
    this.goods[goodId].stock -= amount;
    return true;
  }

  /**
   * Removes as much stock as possible up to the requested amount.
   * Returns the actual amount removed.
   */
  removeStockPartial(goodId: string, amount: number): number {
    if (!this.goods[goodId]) return 0;
    const current = this.goods[goodId].stock;
    const removed = Math.min(current, amount);
    this.goods[goodId].stock -= removed;
    return removed;
  }
}
