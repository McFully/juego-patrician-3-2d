/**
 * Forced Auction System (Subasta Forzada).
 * Allows player to buy competitor buildings via guild interface.
 * Requires guild influence and reputation.
 */

export interface AuctionTarget {
  ownerId: string;
  buildingId: string;
  buildingType: string;
  cityId: string;
  baseValue: number;
}

export interface Bid {
  bidder: string;
  amount: number;
  turn: number;
}

export interface Auction {
  target: AuctionTarget;
  startingBid: number;
  currentBid: number;
  highestBidder: string | null;
  bids: Bid[];
  phase: 'open' | 'counter_bid' | 'closed';
  turnsLeft: number;
}

export interface AuctionResult {
  winner: string | null;
  finalBid: number;
  target: AuctionTarget;
}

export class ForcedAuction {
  guildId: string;
  currentAuction: Auction | null;
  auctionHistory: AuctionResult[];

  constructor(guildId: string) {
    this.guildId = guildId;
    this.currentAuction = null;
    this.auctionHistory = [];
  }

  /**
   * Initiate a forced auction on a competitor's building.
   * @param target — { ownerId, buildingId, buildingType, cityId, baseValue }
   */
  initiateAuction(target: AuctionTarget, playerReputation: number, cityReputation: number): Auction {
    const basePrice = target.baseValue || 5000;
    const repModifier = 1.0 + (playerReputation - cityReputation) * 0.01;
    const startingBid = Math.ceil(basePrice * repModifier);

    this.currentAuction = {
      target,
      startingBid,
      currentBid: startingBid,
      highestBidder: null,
      bids: [],
      phase: 'open', // open, counter_bid, closed
      turnsLeft: 3,
    };

    return this.currentAuction;
  }

  /**
   * Player places a bid.
   */
  placeBid(playerId: string, amount: number): { success: boolean; reason?: string; currentBid?: number } {
    if (!this.currentAuction || this.currentAuction.phase === 'closed') {
      return { success: false, reason: 'No active auction' };
    }

    if (amount <= this.currentAuction.currentBid) {
      return { success: false, reason: `Bid must exceed $${this.currentAuction.currentBid}` };
    }

    this.currentAuction.currentBid = amount;
    this.currentAuction.highestBidder = playerId;
    this.currentAuction.bids.push({ bidder: playerId, amount, turn: this.currentAuction.turnsLeft });

    // AI may counter-bid
    if (Math.random() < 0.4) {
      this.currentAuction.phase = 'counter_bid';
    }

    return { success: true, currentBid: amount };
  }

  /**
   * AI counter-bid.
   */
  resolveCounterBid(): number | null {
    if (!this.currentAuction || this.currentAuction.phase !== 'counter_bid') return null;

    const aiBid = this.currentAuction.currentBid + Math.ceil(
      this.currentAuction.currentBid * (0.05 + Math.random() * 0.15)
    );

    this.currentAuction.currentBid = aiBid;
    this.currentAuction.highestBidder = 'ai';
    this.currentAuction.bids.push({ bidder: 'ai', amount: aiBid, turn: this.currentAuction.turnsLeft });
    this.currentAuction.phase = 'open';

    return aiBid;
  }

  /**
   * Close auction — highest bidder wins.
   */
  closeAuction(): AuctionResult | null {
    if (!this.currentAuction) return null;

    const result: AuctionResult = {
      winner: this.currentAuction.highestBidder,
      finalBid: this.currentAuction.currentBid,
      target: this.currentAuction.target,
    };

    this.auctionHistory.push(result);
    this.currentAuction = null;
    return result;
  }

  /**
   * Check if player has enough guild influence to force an auction.
   */
  static canForceAuction(playerRank: number, cityReputation: number): boolean {
    // Must be at least Councillor (rank 4) with reputation > 40
    return playerRank >= 4 && cityReputation > 40;
  }
}

export class ForcedAuctionManager {
  auctions: Record<string, ForcedAuction>;

  constructor() {
    this.auctions = {}; // { cityId: ForcedAuction }
  }

  getAuction(cityId: string): ForcedAuction {
    if (!this.auctions[cityId]) {
      this.auctions[cityId] = new ForcedAuction(cityId);
    }
    return this.auctions[cityId];
  }

  processDaily(): void {
    for (const [, auction] of Object.entries(this.auctions)) {
      if (auction.currentAuction && auction.currentAuction.phase !== 'closed') {
        auction.currentAuction.turnsLeft--;
        if (auction.currentAuction.phase === 'counter_bid') {
          auction.resolveCounterBid();
        }
        if (auction.currentAuction.turnsLeft <= 0) {
          auction.closeAuction();
        }
      }
    }
  }
}
