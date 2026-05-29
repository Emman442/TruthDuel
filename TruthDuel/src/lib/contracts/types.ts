export interface UserProfile {

  username: string
  wallet_address: string
  total_bets: number
  total_won: number
  total_lost: number
  total_volume: number
  joined_at: string;
}

export interface ConsensusParticipant {
  wallet_address: string
  side: string
  stake_gen: number
}

export interface MutualBet {
  bet_id: string
  creator: string
  challenger: string
  description: string
  category: string
  creator_stake: number
  challenger_stake: number
  expiry_timestamp: number
  status: string
  created_at: string
} 
 

export interface ConsensusBet {
    bet_id: string
    creator: string
    description: string
    category: string
    creator_side: string
    for_pool: number
    against_pool: number
    min_stake: number
    expiry_timestamp: number  
    status: string
    created_at: string
    participants: [ConsensusParticipant]
    settlement: SettlementResult
    totalPool: number
}

export interface SettlementResult {
  bet_id: string
  verdict: string
  reasoning: string
  sources: string[]
}


export interface TransactionReceipt {
    status: string;
    hash: string;
    blockNumber?: number;
    [key: string]: any;
}