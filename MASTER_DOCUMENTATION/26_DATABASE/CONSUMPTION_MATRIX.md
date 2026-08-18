# Consumption Matrix

Weekly consumption of goods per 1000 citizens of each social class.

| Good | Poor | Middle | Wealthy |
|------|------|--------|---------|
| Beer | 20 | 25 | 0 |
| Fish | 15 | 0 | 0 |
| Meat | 0 | 10 | 15 |
| Bread | 30 | 15 | 5 |
| Grain | 10 | 0 | 0 |
| Wool | 0 | 0 | 0 |
| Cloth | 0 | 3 | 8 |
| Wine | 0 | 5 | 20 |
| Timber | 0 | 0 | 0 |
| Iron | 0 | 0 | 0 |
| Salt | 0 | 0 | 0 |
| Honey | 0 | 2 | 5 |
| Wax | 0 | 0 | 3 |
| Hemp | 0 | 0 | 0 |
| Ropes | 0 | 0 | 0 |
| Tar | 0 | 0 | 0 |
| Bricks | 0 | 0 | 0 |
| Tools | 0 | 0 | 0 |
| Candles | 3 | 5 | 10 |
| Pottery | 2 | 4 | 2 |

### Demand Calculation
The total daily demand for a good in a city is calculated as:
$Demand = \sum_{class} \frac{Population_{class}}{1000} \times Rate_{class} \div 7$
