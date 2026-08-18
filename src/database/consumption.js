// Goods consumption per 1000 population per week
export const CONSUMPTION_RATES = {
  poor: {
    bread: 30,
    fish: 15,
    beer: 20,
    grain: 10,
    candles: 3,
    pottery: 2,
  },
  middle: {
    bread: 15,
    meat: 10,
    beer: 25,
    cloth: 3,
    candles: 5,
    wine: 5,
    pottery: 4,
    honey: 2,
  },
  rich: {
    bread: 5,
    meat: 15,
    wine: 20,
    cloth: 8,
    candles: 10,
    honey: 5,
    wax: 3,
    pottery: 2,
  },
};

export function calculateDemand(popPoor, popMiddle, popRich, scale = 1000) {
  const demand = {};
  const classes = [
    { pop: popPoor, rates: CONSUMPTION_RATES.poor },
    { pop: popMiddle, rates: CONSUMPTION_RATES.middle },
    { pop: popRich, rates: CONSUMPTION_RATES.rich },
  ];
  for (const cls of classes) {
    for (const [goodId, rate] of Object.entries(cls.rates)) {
      demand[goodId] = (demand[goodId] || 0) + (cls.pop / scale) * rate;
    }
  }
  return demand;
}