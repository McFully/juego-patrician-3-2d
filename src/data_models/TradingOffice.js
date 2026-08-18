export class TradingOffice {
  constructor(cityId) {
    this.cityId = cityId;
    this.built = false;
    this.managerHired = false;
    this.autoBuyRules = {};
    this.autoSellRules = {};
    this.reserves = {};
    this.storageLimit = 5000;
    this.storageUsed = 0;
    this.inventory = {};
    this.budget = 0;
  }

  static BUILD_COST = { bricks: 60, timber: 20, tools: 10 };

  canBuild(playerInventory) {
    for (const [goodId, amount] of Object.entries(TradingOffice.BUILD_COST)) {
      if ((playerInventory[goodId] || 0) < amount) return false;
    }
    return true;
  }

  setAutoBuyRule(goodId, maxPrice, maxQuantity) {
    this.autoBuyRules[goodId] = { maxPrice, maxQuantity, active: true };
  }

  setAutoSellRule(goodId, minPrice, maxQuantity) {
    this.autoSellRules[goodId] = { minPrice, maxQuantity, active: true };
  }

  setReserve(goodId, amount) {
    this.reserves[goodId] = amount;
  }

  processDailyTrade(market) {
    if (!this.managerHired || !this.built) return;

    // Auto-buy
    for (const [goodId, rule] of Object.entries(this.autoBuyRules)) {
      if (!rule.active) continue;
      const currentPrice = market.getPrice(goodId);
      if (currentPrice <= rule.maxPrice) {
        const reserve = this.reserves[goodId] || 0;
        const currentStock = this.inventory[goodId] || 0;
        const canBuy = Math.min(rule.maxQuantity, this.storageLimit - this.storageUsed, this.budget / currentPrice);
        const toBuy = Math.max(0, canBuy - reserve + currentStock);
        if (toBuy > 0) {
          const result = market.buy(goodId, Math.floor(toBuy));
          if (result) {
            this.budget -= result.cost;
            this.inventory[goodId] = (this.inventory[goodId] || 0) + result.quantity;
            this.storageUsed += result.quantity;
          }
        }
      }
    }

    // Auto-sell
    for (const [goodId, rule] of Object.entries(this.autoSellRules)) {
      if (!rule.active) continue;
      const currentPrice = market.getPrice(goodId);
      if (currentPrice >= rule.minPrice && (this.inventory[goodId] || 0) > (this.reserves[goodId] || 0)) {
        const available = this.inventory[goodId] - (this.reserves[goodId] || 0);
        const toSell = Math.min(rule.maxQuantity, available);
        if (toSell > 0) {
          const result = market.sell(goodId, Math.floor(toSell));
          if (result) {
            this.budget += result.revenue;
            this.inventory[goodId] -= result.quantity;
            this.storageUsed -= result.quantity;
          }
        }
      }
    }
  }
}