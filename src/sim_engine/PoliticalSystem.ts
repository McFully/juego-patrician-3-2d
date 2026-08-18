import DATA from '../database/index.js';

const { RANKS, RANK_REQUIREMENTS } = DATA as any;

export interface Councillor {
  name: string;
  voteWeight: number;
  bribed: boolean;
  bribeAmount: number;
  bribeTurns: number;
}

export interface BribeRecord {
  amount: number;
  councillorIndex: number;
  turnsLeft: number;
}

/**
 * Political system: ranks, elections, reputation, bath house bribery.
 */
export class PoliticalSystem {
  playerRank: number;
  playerReputation: number;
  playerGold: number;
  reputationByCity: Record<string, number>;
  electionCycle: number;
  lastElectionMonth: number;
  councillors: Record<string, Councillor[]>;
  bathHouseBribes: Record<string, BribeRecord>;

  constructor() {
    this.playerRank = 0;
    this.playerReputation = 0;
    this.playerGold = 10000;
    this.reputationByCity = {};
    this.electionCycle = 12; // months between elections
    this.lastElectionMonth = 0;
    this.councillors = {}; // { cityId: [{ name, voteWeight, bribed }] }
    this.bathHouseBribes = {}; // { cityId: { amount, councillor, turnsLeft } }
  }

  getRankName(): string {
    return RANKS[this.playerRank] || 'Unknown';
  }

  getRankIndex(): number {
    return this.playerRank;
  }

  checkRankUp(): boolean {
    const req = RANK_REQUIREMENTS[this.playerRank + 1];
    if (!req) return false;
    if (this.playerGold >= req.gold && this.playerReputation >= req.reputation) {
      this.playerRank++;
      return true;
    }
    return false;
  }

  /**
   * Initialize councillors for a city.
   */
  initCouncillors(cityId: string, count: number = 5): void {
    const names = ['Henrik', 'Wilhelm', 'Friedrich', 'Klaus', 'Otto', 'Gustav', 'Lars', 'Erik', 'Johann', 'Matthias'];
    this.councillors[cityId] = [];
    for (let i = 0; i < count; i++) {
      this.councillors[cityId].push({
        name: names[Math.floor(Math.random() * names.length)],
        voteWeight: 0.1 + Math.random() * 0.3,
        bribed: false,
        bribeAmount: 0,
        bribeTurns: 0,
      });
    }
  }

  /**
   * Bath house: bribe a councillor for temporary vote.
   */
  bribeCouncillor(cityId: string, councillorIndex: number, amount: number): boolean {
    const councillors = this.councillors[cityId];
    if (!councillors || !councillors[councillorIndex]) return false;
    if (this.playerGold < amount) return false;

    const c = councillors[councillorIndex];
    if (c.bribed) return false;

    this.playerGold -= amount;
    c.bribed = true;
    c.bribeAmount = amount;
    c.bribeTurns = 6; // lasts 6 months
    this.bathHouseBribes[cityId] = { amount, councillorIndex, turnsLeft: 6 };
    return true;
  }

  /**
   * Process annual elections.
   * To become Lord Mayor: be Councillor (rank 4) or Patrician (rank 5)
   * and win election by reputation + bribes.
   */
  processElection(cityId: string, totalDays: number): { winner: string; votes: number; aiVotes: number } | null {
    const month = (totalDays % 360);
    // Simplified month calculation, assuming 30 days per month
    const currentMonth = Math.floor(month / 30);
    if (currentMonth !== 11) return null; // elections in December (month 11)

    const councillors = this.councillors[cityId];
    if (!councillors || councillors.length === 0) return null;

    // Calculate player's effective votes
    let playerVotes = this.reputationByCity[cityId] || 0;
    for (const c of councillors) {
      if (c.bribed && c.bribeTurns > 0) {
        playerVotes += c.voteWeight * 50;
      }
    }

    // AI opponent votes
    const aiVotes = councillors.reduce((sum, c) => sum + c.voteWeight * (c.bribed ? 10 : 30), 0);

    if (this.playerRank >= 4 && playerVotes > aiVotes) {
      this.playerRank = Math.max(this.playerRank, 6); // Lord Mayor
      return { winner: 'player', votes: playerVotes, aiVotes };
    }

    return { winner: 'ai', votes: playerVotes, aiVotes };
  }

  /**
   * Process monthly decay of bribes.
   */
  processMonthly(): void {
    for (const [, councillors] of Object.entries(this.councillors)) {
      for (const c of councillors) {
        if (c.bribed) {
          c.bribeTurns--;
          if (c.bribeTurns <= 0) {
            c.bribed = false;
            c.bribeAmount = 0;
          }
        }
      }
    }
  }

  /**
   * Check Alderman requirements:
   * 1. Must be active Lord Mayor (Rank 6)
   * 2. High approval (80+) in 12+ cities
   * 3. Complete a major expansion mission (City Founding or Monument)
   */
  canBecomeAlderman(completedMissions: { type: string }[] = []): boolean {
    if (this.playerRank < 6) return false;
    
    const highApprovalCities = Object.values(this.reputationByCity)
      .filter(rep => rep >= 80).length;
    
    const majorExpansionCompleted = completedMissions.some(m => 
      m.type === 'found_city' || m.type === 'build_wonder'
    );

    return highApprovalCities >= 12 && majorExpansionCompleted;
  }
}

export interface Mission {
  id: string;
  type: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  reputationReward: number;
}

export class MissionSystem {
  activeMissions: any[];
  completedMissions: any[];
  missionTypes: string[];

  constructor() {
    this.activeMissions = [];
    this.completedMissions = [];
    this.missionTypes = ['hunt_pirates', 'found_city', 'create_route', 'deliver_goods'];
  }

  generateMission(_world: any, _player: any): Mission | null {
    const type = this.missionTypes[Math.floor(Math.random() * this.missionTypes.length)];
    switch (type) {
      case 'hunt_pirates':
        return {
          id: `mission_${Date.now()}`,
          type: 'hunt_pirates',
          description: 'Destroy 5 pirate ships in the Baltic',
          target: 5,
          progress: 0,
          reward: 50000,
          reputationReward: 20,
        };
      case 'found_city':
        return {
          id: `mission_${Date.now()}`,
          type: 'found_city',
          description: 'Establish a new settlement with 1000 inhabitants',
          target: 1000,
          progress: 0,
          reward: 100000,
          reputationReward: 50,
        };
      case 'create_route':
        return {
          id: `mission_${Date.now()}`,
          type: 'create_route',
          description: 'Establish a land trade route between two cities',
          target: 1,
          progress: 0,
          reward: 30000,
          reputationReward: 15,
        };
      case 'deliver_goods':
        return {
          id: `mission_${Date.now()}`,
          type: 'deliver_goods',
          description: 'Deliver 100 units of grain to a starving city',
          target: 100,
          progress: 0,
          reward: 20000,
          reputationReward: 10,
        };
      default:
        return null;
    }
  }

  completeMission(missionId: string): Mission | null {
    const idx = this.activeMissions.findIndex(m => m.id === missionId);
    if (idx >= 0) {
      const mission = this.activeMissions[idx];
      this.activeMissions.splice(idx, 1);
      this.completedMissions.push(mission);
      return mission;
    }
    return null;
  }
}
