export type BetCategory = 'Crypto' | 'Sports' | 'Politics' | 'Entertainment' | 'Community' | 'Personal' | 'Other';
export type BetMode = 'MUTUAL' | 'CONSENSUS';
export type BetStatus = 'AWAITING_CHALLENGER' | 'ACTIVE' | 'AWAITING_SETTLEMENT' | 'SETTLED' | 'CANCELLED';

export interface User {
  id: string;
  username: string;
  avatar: string;
  walletAddress: string;
  balance: number;
}

export interface Bet {
  id: string;
  description: string;
  category: BetCategory;
  mode: BetMode;
  creator: User;
  challenger?: User;
  stakeAmount: number; // For Mutual, creator stake. For Consensus, initial stake.
  challengerStake?: number; // For Mutual
  totalPool: number;
  expiryDate: string;
  status: BetStatus;
  createdAt: string;
  forPool?: {
    amount: number;
    participants: number;
  };
  againstPool?: {
    amount: number;
    participants: number;
  };
  verdict?: 'FOR_WINS' | 'AGAINST_WINS' | 'DRAW';
  reasoning?: string;
  sources?: string[];
}

export interface Activity {
  id: string;
  message: string;
  status: 'WIN' | 'LOSS' | 'PENDING';
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  won: number;
  lost: number;
  winRate: number;
  volume: number;
  biggestWin: number;
}