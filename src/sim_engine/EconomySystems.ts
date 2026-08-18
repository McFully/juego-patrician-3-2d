import { Player } from '../data_models/Player';
import { Ship } from '../data_models/Ship';
import { City } from './City';

export interface Loan {
  id: number;
  amount: number;
  originalAmount: number;
  interestRate: number;
  weeksRemaining: number;
  totalToRepay: number;
}

export interface Captain {
  id: string;
  name: string;
  sailing: number;
  trading: number;
  combat: number;
  salary: number;
}

/**
 * MoneyLender: Logic for taking loans (with interest) and calculating weekly debt.
 */
export class MoneyLender {
  loans: Loan[];
  nextLoanId: number;

  constructor() {
    this.loans = []; // Array of { id, amount, interestRate, weeksRemaining, originalAmount }
    this.nextLoanId = 1;
  }

  takeLoan(amount: number, weeks: number, rankIndex: number): Loan {
    // Interest rate depends on rank and duration. Higher rank = lower interest.
    const baseRate = 0.05 + (weeks * 0.005);
    const rankDiscount = rankIndex * 0.005;
    const interestRate = Math.max(0.02, baseRate - rankDiscount);

    const loan: Loan = {
      id: this.nextLoanId++,
      amount: amount,
      originalAmount: amount,
      interestRate: interestRate,
      weeksRemaining: weeks,
      totalToRepay: amount * (1 + interestRate)
    };
    this.loans.push(loan);
    return loan;
  }

  repayLoan(loanId: number, player: Player): boolean {
    const index = this.loans.findIndex(l => l.id === loanId);
    if (index === -1) return false;
    const loan = this.loans[index];
    if (player.gold >= loan.totalToRepay) {
      player.gold -= loan.totalToRepay;
      this.loans.splice(index, 1);
      return true;
    }
    return false;
  }

  processWeekly(player: Player): { loanId: number; amount: number; type: string }[] {
    const weeklyPayments: { loanId: number; amount: number; type: string }[] = [];
    for (let i = this.loans.length - 1; i >= 0; i--) {
      const loan = this.loans[i];
      loan.weeksRemaining--;
      
      if (loan.weeksRemaining <= 0) {
        // Automatic repayment attempt at the end of the term
        if (player.gold >= loan.totalToRepay) {
          player.gold -= loan.totalToRepay;
          weeklyPayments.push({ loanId: loan.id, amount: loan.totalToRepay, type: 'full' });
          this.loans.splice(i, 1);
        } else {
          // Penalty for not being able to repay
          const penalty = loan.totalToRepay * 0.1;
          player.gold -= penalty;
          loan.totalToRepay += penalty;
          loan.weeksRemaining = 1; // Give one more week with penalty
          weeklyPayments.push({ loanId: loan.id, amount: penalty, type: 'penalty' });
        }
      } else {
        // Just interest payment? Or maybe Patrician 3 style is full payment at end.
        // Let's go with interest payment weekly.
        // const interestPayment = (loan.originalAmount * loan.interestRate) / loan.weeksRemaining;
        // In many games it's just one lump sum. Let's stick to lump sum at end for simplicity
        // but maybe a weekly small "service fee".
      }
    }
    return weeklyPayments;
  }
}

/**
 * Tavern: Logic for hiring sailors (crew) and generating random captains.
 */
export class Tavern {
  sailorsAvailable: number;
  captains: Captain[];
  lastRefreshDay: number;

  constructor() {
    this.sailorsAvailable = 20 + Math.floor(Math.random() * 50);
    this.captains = [];
    this.lastRefreshDay = 0;
  }

  refresh(totalDays: number): void {
    if (totalDays - this.lastRefreshDay >= 7) {
      this.sailorsAvailable = 20 + Math.floor(Math.random() * 50);
      this.generateCaptains();
      this.lastRefreshDay = totalDays;
    }
  }

  generateCaptains(): void {
    const names = ["Erik", "Hans", "Klaus", "Olaf", "Jürgen", "Dieter", "Sven", "Lars"];
    const surnames = ["Nielsen", "Müller", "Schmidt", "Fischer", "Weber", "Wagner", "Becker"];
    
    this.captains = [];
    const count = Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      this.captains.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
        sailing: 1 + Math.floor(Math.random() * 5),
        trading: 1 + Math.floor(Math.random() * 5),
        combat: 1 + Math.floor(Math.random() * 5),
        salary: 100 + Math.floor(Math.random() * 200)
      });
    }
  }

  hireSailors(count: number, ship: Ship, player: Player): number {
    const toHire = Math.min(count, this.sailorsAvailable, ship.crewMax - ship.crew);
    if (toHire <= 0) return 0;
    
    const cost = toHire * 5; // 5 gold per sailor hiring fee
    if (player.gold < cost) return 0;

    player.gold -= cost;
    ship.crew += toHire;
    this.sailorsAvailable -= toHire;
    return toHire;
  }

  hireCaptain(captainId: string, ship: Ship, player: Player): boolean {
    const index = this.captains.findIndex(c => c.id === captainId);
    if (index === -1) return false;
    const captain = this.captains[index];
    
    if (player.gold < 500) return false; // Hiring fee

    player.gold -= 500;
    (ship as any).captain = captain; // Explicitly adding captain to ship if not typed
    this.captains.splice(index, 1);
    return true;
  }
}

/**
 * Cathedral: Logic for donations (increasing reputation) and checking upgrade status.
 */
export class Cathedral {
  totalDonated: number;
  upgradeLevel: number; // 0: Chapel, 1: Church, 2: Cathedral

  constructor() {
    this.totalDonated = 0;
    this.upgradeLevel = 0; // 0: Chapel, 1: Church, 2: Cathedral
  }

  donate(amount: number, player: Player, city: City): number {
    if (player.gold < amount) return 0;
    
    player.gold -= amount;
    this.totalDonated += amount;
    
    // Increase reputation: 1 rep point per 1000 gold donated (scaled)
    const repIncrease = amount / 1000;
    player.reputationByCity[city.id] = (player.reputationByCity[city.id] || 50) + repIncrease;
    
    return repIncrease;
  }

  getUpgradeRequirement(nextLevel: number): { pop: number; gold: number } | null {
    const requirements = [
      { pop: 2000, gold: 10000 }, // To Church
      { pop: 10000, gold: 50000 } // To Cathedral
    ];
    return requirements[nextLevel] || null;
  }

  checkUpgrade(city: City): boolean {
    const req = this.getUpgradeRequirement(this.upgradeLevel);
    if (!req) return false;
    
    if (city.totalPopulation >= req.pop && city.cityChest >= req.gold) {
      this.upgradeLevel++;
      city.cityChest -= req.gold;
      return true;
    }
    return false;
  }
}
