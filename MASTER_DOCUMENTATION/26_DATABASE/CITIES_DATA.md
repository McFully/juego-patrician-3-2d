# Cities Database

List of all cities in the Hanseatic League simulation, including their geographical coordinates, maritime characteristics, and starting population metrics.

| ID | Name | Coordinates (X, Y) | Draft | Prod. Level | Poor | Middle | Wealthy | Beggars | Total Pop |
|----|------|-------------------|-------|-------------|------|--------|---------|---------|-----------|
| lubeck | Lübeck | (600, 350) | Deep | High | 800 | 400 | 200 | 100 | 1500 |
| hamburg | Hamburg | (550, 380) | Deep | High | 700 | 350 | 180 | 90 | 1320 |
| bremen | Bremen | (520, 410) | Deep | Medium | 600 | 300 | 150 | 80 | 1130 |
| rostock | Rostock | (630, 360) | Deep | Medium | 500 | 250 | 120 | 70 | 940 |
| stralsund | Stralsund | (660, 370) | Deep | Medium | 450 | 220 | 100 | 65 | 835 |
| gdansk | Gdańsk | (720, 380) | Deep | High | 750 | 380 | 180 | 95 | 1405 |
| visby | Visby | (700, 320) | Deep | Medium | 400 | 200 | 100 | 50 | 750 |
| riga | Riga | (780, 340) | Deep | Medium | 500 | 250 | 120 | 70 | 940 |
| reval | Reval | (800, 330) | Deep | Low | 350 | 170 | 80 | 50 | 650 |
| novgorod | Novgorod | (850, 310) | Shallow | High | 900 | 450 | 220 | 120 | 1690 |
| ladoga | Ladoga | (850, 290) | Shallow | Low | 300 | 150 | 70 | 40 | 560 |
| bergen | Bergen | (480, 280) | Deep | High | 600 | 300 | 150 | 80 | 1130 |
| oslo | Oslo | (500, 300) | Deep | Medium | 400 | 200 | 100 | 55 | 755 |
| torsberg | Tønsberg | (520, 310) | Deep | Low | 250 | 120 | 60 | 35 | 465 |
| kopenhagen | Kopenhagen | (620, 400) | Deep | Medium | 550 | 270 | 130 | 75 | 1025 |
| malmo | Malmö | (650, 400) | Deep | Low | 350 | 170 | 80 | 45 | 645 |
| stettin | Stettin | (690, 390) | Deep | Medium | 450 | 220 | 110 | 60 | 840 |
| torun | Toruń | (740, 400) | Shallow | Medium | 400 | 200 | 100 | 55 | 755 |
| elbing | Elbing | (750, 390) | Deep | Medium | 350 | 170 | 80 | 45 | 645 |
| koln | Köln | (480, 460) | Shallow | High | 850 | 420 | 200 | 110 | 1580 |
| magdeburg | Magdeburg | (550, 440) | Deep | Medium | 500 | 250 | 120 | 65 | 935 |
| bristol | Bristol | (350, 450) | Deep | Medium | 500 | 250 | 120 | 70 | 940 |
| london | London | (380, 440) | Deep | High | 800 | 400 | 200 | 100 | 1500 |
| bruges | Bruges | (430, 470) | Deep | High | 700 | 350 | 180 | 90 | 1320 |

### Production Rules
- **Regional Multiplier:** Efficiency is affected by the city's production level.
    - High: 1.15x
    - Medium: 1.00x
    - Low: 0.75x
- **Shallow Cities:** Only Snaikka and Crayer can enter cities marked as "Shallow" (Novgorod, Ladoga, Toruń, Köln).
