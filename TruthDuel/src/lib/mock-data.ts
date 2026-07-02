import { Bet, User, Activity, LeaderboardEntry } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  username: 'cryptoking',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  walletAddress: '0x71C...3f21',
  balance: 1250.50
};

export const MOCK_BETS: Bet[] = [
  {
    id: 'b1',
    description: 'ETH will hit $5,000 before July 1st, 2024',
    category: 'Crypto',
    mode: 'MUTUAL',
    creator: { id: 'u2', username: 'vitalik_fan', avatar: 'https://picsum.photos/seed/user2/100/100', walletAddress: '0x123...abc', balance: 100 },
    stakeAmount: 500,
    challengerStake: 500,
    totalPool: 1000,
    expiryDate: '2024-07-01T00:00:00Z',
    status: 'ACTIVE',
    createdAt: '2024-01-01T12:00:00Z'
  },
  {
    id: 'b2',
    description: 'Arsenal will win the Premier League 23/24 season',
    category: 'Sports',
    mode: 'CONSENSUS',
    creator: { id: 'u3', username: 'gunner4life', avatar: 'https://picsum.photos/seed/user3/100/100', walletAddress: '0x456...def', balance: 50 },
    stakeAmount: 100,
    totalPool: 4500,
    expiryDate: '2024-05-20T00:00:00Z',
    status: 'ACTIVE',
    createdAt: '2024-02-15T10:00:00Z',
    forPool: { amount: 3000, participants: 42 },
    againstPool: { amount: 1500, participants: 28 }
  },
  {
    id: 'b3',
    description: 'BTC reaches $100k by end of year',
    category: 'Crypto',
    mode: 'MUTUAL',
    creator: MOCK_USER,
    stakeAmount: 250,
    totalPool: 250,
    expiryDate: '2024-12-31T23:59:59Z',
    status: 'AWAITING_CHALLENGER',
    createdAt: '2024-03-20T15:00:00Z'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', message: 'ETH bet settled - @chidera wins 20 GEN ✓', status: 'WIN', timestamp: '2 mins ago' },
  { id: 'a2', message: 'Arsenal vs Chelsea - @emmanuel loses 50 GEN ✗', status: 'LOSS', timestamp: '5 mins ago' },
  { id: 'a3', message: 'BTC $100k bet - awaiting settlement ⏳', status: 'PENDING', timestamp: '10 mins ago' }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: { id: 'l1', username: 'whale_master', avatar: 'https://picsum.photos/seed/l1/100/100', walletAddress: '0x111...111', balance: 0 }, won: 142, lost: 30, winRate: 82.5, volume: 45000, biggestWin: 12000 },
  { rank: 2, user: { id: 'l2', username: 'oracle_vision', avatar: 'https://picsum.photos/seed/l2/100/100', walletAddress: '0x222...222', balance: 0 }, won: 98, lost: 12, winRate: 89.1, volume: 32000, biggestWin: 8000 },
  { rank: 3, user: { id: 'l3', username: 'sports_guru', avatar: 'https://picsum.photos/seed/l3/100/100', walletAddress: '0x333...333', balance: 0 }, won: 215, lost: 80, winRate: 72.8, volume: 28000, biggestWin: 4500 }
];