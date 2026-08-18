# ECONOMY SYSTEM: MARKET & TRADE

## 1. The Market Entity
Each city has a `Market` that manages its supply of 20+ goods.

### 1.1 Price Dynamics
Prices are not static. They are calculated dynamically using a **Stock-to-Demand Ratio**.
- **Base Price**: The target price when supply perfectly matches demand.
- **Price Elasticity**: Different goods (Luxury vs. Basic) have different price volatility.

### 1.2 Inventory Management
- **Stock**: Current units available for sale.
- **Consumption**: Units removed daily by the population.
- **Production**: Units added daily by local factories.

---

## 2. Trading Operations
### 2.1 Buy Operation
When a player buys:
1. The engine calculates the price of the **first unit**.
2. If buying multiple, it calculates the **marginal increase** for each subsequent unit (since stock decreases, price increases).
3. The total cost is the sum of these marginal prices.

### 2.2 Sell Operation
When a player sells:
1. The engine calculates the price for the **first unit**.
2. As units are added, the price for subsequent units **decreases**.
3. The total revenue is the sum of these marginal prices.

---

## 3. Auto-Trade Rules
Managed in the **Warehouse** and **Trading Office**.
- **Auto-Buy**: Buy from market if stock < X and price < Y.
- **Auto-Sell**: Sell to market if office_stock > X and price > Y.
- **Reserves**: Minimum units to keep in warehouse (for local factory input).

---

## 4. Supply Chains
Factories require **Input Goods** to produce **Output Goods**.
Example:
- **Foundry**: Consumes *Iron Ore* + *Timber* -> Produces *Iron Goods*.
- **Bakery**: Consumes *Grain* + *Timber* -> Produces *Beer*.
- **Salt Works**: Consumes *Timber* -> Produces *Salt*.
*(Note: Timber/Wood is the primary fuel for most Hanseatic industries.)*
