import { describe, it, expect, beforeEach } from 'vitest';
import { PoliticalSystem } from '../../src/sim_engine/PoliticalSystem';

describe('PoliticalSystem', () => {
  let ps: PoliticalSystem;

  beforeEach(() => {
    ps = new PoliticalSystem();
  });

  it('starts at rank 0', () => {
    expect(ps.getRankIndex()).toBe(0);
    expect(ps.getRankName()).toBe('Shopkeeper');
  });

  it('checks rank up correctly', () => {
    // Rank 1 requirements: gold: 5000, reputation: 10
    ps.playerGold = 6000;
    ps.playerReputation = 15;
    const up = ps.checkRankUp();
    expect(up).toBe(true);
    expect(ps.getRankIndex()).toBe(1);
    expect(ps.getRankName()).toBe('Trader');
  });

  it('fails rank up if requirements not met', () => {
    ps.playerGold = 1000;
    ps.playerReputation = 15;
    const up = ps.checkRankUp();
    expect(up).toBe(false);
    expect(ps.getRankIndex()).toBe(0);
  });

  it('bribes councillors correctly', () => {
    ps.initCouncillors('lubeck', 5);
    ps.playerGold = 5000;
    const success = ps.bribeCouncillor('lubeck', 0, 1000);
    expect(success).toBe(true);
    expect(ps.playerGold).toBe(4000);
    expect(ps.councillors['lubeck'][0].bribed).toBe(true);
  });

  it('processes election winner based on reputation and bribes', () => {
    ps.initCouncillors('lubeck', 1);
    ps.councillors['lubeck'][0].voteWeight = 1.0;
    ps.playerRank = 4; // Councillor
    ps.reputationByCity['lubeck'] = 10;
    
    // AI votes = 1.0 * 30 = 30
    // Player votes = 10
    let result = ps.processElection('lubeck', 359);
    expect(result?.winner).toBe('ai');

    // Bribe the councillor
    ps.playerGold = 10000;
    ps.bribeCouncillor('lubeck', 0, 1000);
    // Player votes = 10 + 1.0 * 50 = 60
    // AI votes = 1.0 * 10 = 10
    result = ps.processElection('lubeck', 359);
    expect(result?.winner).toBe('player');
    expect(ps.playerRank).toBe(6); // Promoted to Lord Mayor
  });
});
