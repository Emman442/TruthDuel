# TruthDuel

TruthDuel is an AI-powered prediction market and challenge platform built on GenLayer.

Users create predictions about future events, stake GEN, and allow GenLayer Intelligent Contracts to determine outcomes through AI consensus once the prediction expires.

Unlike traditional prediction markets that rely on centralized oracles or governance voting, TruthDuel uses Intelligent Contracts to evaluate outcomes and settle bets automatically.

---

# Features

## Mutual Bets

Mutual Bets are direct one-on-one challenges between two participants.

### Flow

1. User creates a prediction.
2. Creator stakes GEN.
3. Another user accepts the challenge and matches the stake.
4. The bet remains active until expiration.
5. Either participant can trigger settlement.
6. GenLayer validators evaluate the prediction.
7. Winner receives the pool.

### Example

> "GenLayer will launch mainnet within 24 hours."

Alice creates the bet and stakes 10 GEN.

Bob accepts and stakes 10 GEN.

Total pool: 20 GEN.

When the bet expires, the Intelligent Contract determines whether the statement became true.

---

## Consensus Bets

Consensus Bets allow multiple participants to join a prediction market.

Users choose either:

* FOR
* AGAINST

and stake GEN behind their position.

### Flow

1. User creates a prediction.
2. Creator chooses FOR or AGAINST.
3. Additional participants join either side.
4. Stakes accumulate into separate pools.
5. Settlement is triggered after expiration.
6. Intelligent Contract determines outcome.
7. Winning side receives proportional rewards.

### Example

Prediction:

> "Ethereum will reach $10,000 before January 2027."

Users join:

FOR:

* Alice: 20 GEN
* Bob: 10 GEN

AGAINST:

* Charlie: 15 GEN

Total pool:
45 GEN

If FOR wins, rewards are distributed proportionally between Alice and Bob.

---

# Intelligent Settlement

TruthDuel uses GenLayer's AI consensus mechanism for settlement.

When a prediction expires:

1. Validators independently evaluate the prediction.
2. AI generates a verdict.
3. GenLayer reaches consensus.
4. Settlement result is stored on-chain.

Possible verdicts:

```txt
for_wins
against_wins
draw
unresolved
```

Settlement data includes:

* verdict
* reasoning
* settlement timestamp
* settlement initiator
* supporting sources

---

# Contract Architecture

## User Registry

Stores all registered users.

### Data Stored

```python
User
```

Fields:

```txt
wallet_address
username
total_bets
total_won
total_lost
total_volume
```

### Functions

#### register_user()

Creates a new user profile.

#### get_user()

Returns a user by wallet address or username.

#### get_all_users()

Returns all registered users.

---

## Mutual Bet Contract Logic

Handles one-on-one prediction challenges.

### Data Model

```python
MutualBet
```

Fields:

```txt
bet_id
creator
challenger
description
category
creator_stake
challenger_stake
expiry_timestamp
status
settlement
created_at
```

### Functions

#### create_mutual_bet()

Creates a new mutual bet.

#### accept_mutual_bet()

Allows another user to join the challenge.

#### cancel_mutual_bet()

Allows creator to cancel before acceptance.

#### get_mutual_bet()

Returns a specific mutual bet.

#### get_all_mutual_bets()

Returns all mutual bets.

#### settle_mutual_bet()

Triggers AI settlement.

Updates:

* winner
* loser
* settlement details
* user statistics

---

## Consensus Bet Contract Logic

Handles many-to-many prediction markets.

### Data Model

```python
ConsensusBet
```

Fields:

```txt
bet_id
creator
description
category
creator_side
for_pool
against_pool
participants
min_stake
expiry_timestamp
status
settlement
created_at
```

### Participant Model

```python
ConsensusParticipant
```

Fields:

```txt
wallet_address
side
stake_gen
```

### Functions

#### create_consensus_bet()

Creates a prediction market.

#### join_consensus_bet()

Allows users to stake FOR or AGAINST.

#### get_consensus_bet()

Returns a specific market.

#### get_all_consensus_bets()

Returns all markets.

#### settle_consensus_bet()

Triggers AI settlement.

Calculates:

* winning side
* losing side
* proportional rewards
* settlement record

---

## Settlement System

### Data Model

```python
SettlementResult
```

Fields:

```txt
verdict
reasoning
sources_checked
settled_at
settled_by
```

### Responsibilities

Stores:

* final verdict
* explanation
* settlement timestamp
* validator consensus result

Used by both:

* Mutual Bets
* Consensus Bets

---

# Frontend

Built with:

```txt
Next.js
TypeScript
TailwindCSS
shadcn/ui
TanStack Query
```

Features:

* Wallet connection
* User profiles
* Bet exploration
* Bet creation
* Bet participation
* Live settlement status
* Leaderboards

---

# Bet Lifecycle

## Mutual Bet

```txt
Create
↓
Pending
↓
Accepted
↓
Active
↓
Expired
↓
Settlement Triggered
↓
Settled
```

## Consensus Bet

```txt
Create
↓
Active
↓
Participants Join
↓
Expired
↓
Settlement Triggered
↓
Settled
```

---

# AI Consensus Flow

```txt
User Triggers Settlement
↓
Prediction Retrieved
↓
Validators Execute Prompt
↓
GenLayer Consensus
↓
Verdict Generated
↓
Settlement Stored
↓
Rewards Distributed
```

---

# Future Roadmap

## Reputation System

Track user forecasting accuracy.

## Public Profiles

Prediction history and performance metrics.

## Creator Challenges

Influencers and founders create public prediction markets.

## AI Arbitration

Expand beyond predictions into:

* freelance disputes
* escrow disputes
* service agreements

## Multi-Source Verification

Combine:

* web search
* structured data
* AI reasoning

for more robust settlements.

---

# Built On GenLayer

TruthDuel leverages GenLayer Intelligent Contracts to create prediction markets that can reason about real-world events and reach consensus on outcomes without relying on centralized oracles.
# truthduel-client
