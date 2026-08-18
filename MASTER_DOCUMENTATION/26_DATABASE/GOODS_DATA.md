# Goods Database

Complete list of tradable goods, including their physical properties, economic constants, and base costs.

| ID | Name | Volume Type | Units/Cargo | Min Price | Max Price | Min Stock | Max Stock | Base Cost |
|----|------|-------------|-------------|-----------|-----------|-----------|-----------|-----------|
| beer | Cerveza | Barrel | 1 | 18 | 32 | 100 | 500 | 25 |
| fish | Pescado | Barrel | 1 | 15 | 28 | 80 | 400 | 20 |
| meat | Carne | Barrel | 1 | 30 | 55 | 50 | 250 | 40 |
| bread | Pan | Barrel | 1 | 8 | 16 | 200 | 800 | 12 |
| grain | Grano | Cargo | 10 | 12 | 24 | 300 | 1200 | 18 |
| wool | Lana | Cargo | 10 | 35 | 68 | 60 | 300 | 50 |
| cloth | Telas | Cargo | 10 | 55 | 100 | 40 | 200 | 75 |
| wine | Vino | Barrel | 1 | 45 | 85 | 30 | 150 | 60 |
| timber | Madera | Cargo | 10 | 10 | 20 | 400 | 1500 | 15 |
| iron | Hierro | Cargo | 10 | 20 | 38 | 100 | 500 | 28 |
| salt | Sal | Barrel | 1 | 14 | 26 | 150 | 600 | 20 |
| honey | Miel | Barrel | 1 | 40 | 75 | 30 | 150 | 55 |
| wax | Cera | Barrel | 1 | 25 | 48 | 50 | 250 | 35 |
| hemp | Cáñamo | Cargo | 10 | 15 | 28 | 80 | 400 | 20 |
| ropes | Cuerdas | Cargo | 10 | 30 | 55 | 40 | 200 | 40 |
| tar | Brea | Barrel | 1 | 20 | 38 | 60 | 300 | 28 |
| bricks | Ladrillos | Cargo | 10 | 8 | 16 | 500 | 2000 | 12 |
| tools | Herramientas | Cargo | 10 | 50 | 95 | 30 | 150 | 70 |
| candles | Velas | Barrel | 1 | 22 | 42 | 50 | 250 | 30 |
| pottery | Alfarería | Barrel | 1 | 12 | 24 | 100 | 500 | 18 |

### Pricing Formula
Prices are calculated using a linear elasticity model based on current stock (S):
- If $S \le S_{min}$, $Price = P_{max}$
- If $S \ge S_{max}$, $Price = P_{min}$
- Otherwise: $Price = P_{max} - \frac{S - S_{min}}{S_{max} - S_{min}} \times (P_{max} - P_{min})$

### Price Elasticity Constants
The price drop per unit of stock between $S_{min}$ and $S_{max}$:
| Good | Price Drop/Unit |
|------|-----------------|
| beer | 0.035 |
| fish | 0.041 |
| meat | 0.125 |
| bread | 0.013 |
| grain | 0.013 |
| wool | 0.138 |
| cloth | 0.281 |
| wine | 0.333 |
| timber | 0.009 |
| iron | 0.045 |
| salt | 0.027 |
| honey | 0.292 |
| wax | 0.115 |
| hemp | 0.041 |
| ropes | 0.156 |
| tar | 0.075 |
| bricks | 0.005 |
| tools | 0.375 |
| candles | 0.100 |
| pottery | 0.030 |
