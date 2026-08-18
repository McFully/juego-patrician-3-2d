# Factories Database

List of all factory types, their operational requirements, and production efficiency.

| ID | Name | Max Workers | Min Workers | Construction Cost | Inputs | Outputs |
|----|------|-------------|-------------|-------------------|--------|---------|
| bakery | Panadería | 100 | 30 | 2000 Gold | 4 Grain | 20 Bread |
| brewery | Cervecería | 100 | 30 | 2000 Gold | 3 Grain, 1 Timber | 15 Beer |
| butcher | Carnicería | 80 | 30 | 2000 Gold | 2 Grain | 6 Meat |
| weaver | Telar | 80 | 30 | 2000 Gold | 3 Wool | 6 Cloth |
| carpenter | Carpintería | 60 | 30 | 2000 Gold | 4 Timber | 2 Tools |
| smelter | Fundición | 80 | 30 | 2000 Gold | 4 Iron, 2 Timber | 3 Tools |
| sawmill | Aserradero | 60 | 30 | 2000 Gold | 5 Timber | 8 Timber |
| farm | Granja de Grano | 100 | 30 | 2000 Gold | - | 12 Grain |
| vineyard | Viñedo | 80 | 30 | 2000 Gold | - | 8 Wine |
| sheep_farm | Granja Ovina | 80 | 30 | 2000 Gold | - | 10 Wool |
| hemp_farm | Plantación de Cáñamo | 70 | 30 | 2000 Gold | - | 8 Hemp |
| apiary | Colmenar | 60 | 30 | 2000 Gold | - | 5 Honey, 4 Wax |
| brickworks | Ladrillera | 100 | 30 | 2000 Gold | 2 Timber | 10 Bricks |
| saltworks | Salina | 80 | 30 | 2000 Gold | 1 Timber | 8 Salt |
| tannery | Peletería | 60 | 30 | 2000 Gold | 2 Salt | 3 Ropes |
| tarworks | Fábrica de Brea | 60 | 30 | 2000 Gold | 3 Timber | 4 Tar |
| chandler | Candelero | 50 | 30 | 2000 Gold | 2 Wax | 5 Candles |
| potter | Alfarero | 60 | 30 | 2000 Gold | 1 Timber | 6 Pottery |
| whale_fishery | Pesquería de Ballenas | 50 | 30 | 2000 Gold | 13.068 Salt, 0.603 Hemp | 12 Fish, 4 Meat |

### Efficiency Modifiers
- **Worker Efficiency:** $\frac{Current Workers}{Max Workers}$
- **Seasonal Output:**
    - Winter Months (Dec, Jan, Feb):
        - Farms: 0.67x
        - Vineyards, Hemp Farms, Apiaries: 0.50x
        - Others: 1.00x
- **Agglomeration Bonus:** Based on total factories in city:
    - $\ge$ 9 factories: 1.10x
    - $\ge$ 6 factories: 1.06x
    - $\ge$ 3 factories: 1.03x
- **Regional Multiplier:** 0.75x (Low) to 1.15x (High) based on city production level.
