# ECONOMY FORMULAS: MATHEMATICAL SPECIFICATION

## 1. Dynamic Pricing Formula
The price of a good $g$ in city $c$ is a function of current stock $S$ and average weekly demand $D_w$.

$$Price = P_{base} \times \left( 1 + K \times \left( \frac{D_w}{S + \epsilon} - 1 \right) \right)$$

- $P_{base}$: Base price of the good.
- $K$: Elasticity constant (Higher for luxuries like Spices, lower for Grain).
- $\epsilon$: Small constant to prevent division by zero.

---

## 2. Consumption Rates
Daily consumption $C_d$ for a good $g$ is the sum of consumption from three social classes.

$$C_d = \sum_{class \in \{P, M, R\}} \frac{Pop_{class} \times Rate_{class, g}}{1000 \times 7}$$

- $Pop_{class}$: Number of citizens in the social class.
- $Rate_{class, g}$: Weekly consumption rate per 1000 citizens.

---

## 3. Production Efficiency
A factory's daily output $O_d$ depends on workforce and environment.

$$O_d = O_{base} \times \frac{Workers}{MaxWorkers} \times SeasonalFactor \times RegionalBonus$$

- $O_{base}$: Maximum daily output with 100% workers.
- $SeasonalFactor$: 1.0 in summer, can drop to 0.5 in winter for crops (Grain, Hemp).
- $RegionalBonus$: Multiplier (e.g., 1.2 for Timber in northern cities).

---

## 4. Total Transaction Cost (Summation)
For buying $Q$ units:

$$TotalCost = \sum_{i=1}^{Q} Price(S - i)$$

*Note: Since stock changes per unit bought, the price increases for every unit in the loop.*
