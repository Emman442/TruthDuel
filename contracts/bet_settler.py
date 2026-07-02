# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
from datetime import datetime, timezone
import json


@allow_storage
@dataclass
class User:
    username: str
    wallet_address: str
    total_bets: i32
    total_won: i32
    total_lost: i32
    total_volume: i32


@allow_storage
@dataclass
class SettlementResult:
    verdict: str
    reasoning: str
    sources_checked: DynArray[str]
    settled_at: str
    settled_by: str


@allow_storage
@dataclass
class ConsensusParticipant:
    wallet_address: str
    side: str
    stake_gen: i32


@allow_storage
@dataclass
class MutualBet:
    bet_id: str
    creator: str
    challenger: str
    description: str
    category: str
    creator_stake: i32
    challenger_stake: i32
    expiry_timestamp: i64
    status: str
    created_at: str
    settlement: SettlementResult


@allow_storage
@dataclass
class ConsensusBet:
    bet_id: str
    creator: str
    description: str
    category: str
    creator_side: str
    for_pool: i32
    against_pool: i32
    min_stake: i32
    expiry_timestamp: i64
    status: str
    created_at: str
    participants: DynArray[ConsensusParticipant]
    settlement: SettlementResult

@gl.evm.contract_interface
class _Recipient:
    class View:
        pass
    class Write:
        pass

class BetSettler(gl.Contract):
    users: TreeMap[str, User]
    mutual_bets: TreeMap[str, MutualBet]
    consensus_bets: TreeMap[str, ConsensusBet]
    user_mutual_bets: TreeMap[str, DynArray[str]]
    user_consensus_bets: TreeMap[str, DynArray[str]]
    mutual_bet_ids: DynArray[str]
    consensus_bet_ids: DynArray[str]
    bet_counter: i32
    username_to_wallet: TreeMap[str, str]

    def __init__(self):
        self.bet_counter = i32(0)

    def _empty_settlement(self) -> SettlementResult:
        return SettlementResult(
            verdict="",
            reasoning="",
            sources_checked=[],
            settled_at="",
            settled_by=""
        )

    def _safe_json_parse(self, value: str):
        cleaned = (
            value
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )
        try:
            return json.loads(cleaned)
        except:
            return {
                "verdict": "unresolved",
                "reasoning": "Failed to parse AI response",
                "sources_checked": []
            }

    @gl.public.write
    def register_user(
        self,
        username: str,
    ) -> None:
        wallet_address = str(gl.message.sender_address)
        assert wallet_address not in self.users, \
            "User already registered"
        normalized_username = username.lower().strip()
        assert normalized_username not in self.username_to_wallet, \
            "Username already taken"
        self.users[wallet_address] = User(
            wallet_address=wallet_address,
            username=normalized_username,
            total_bets=i32(0),
            total_won=i32(0),
            total_lost=i32(0),
            total_volume=i32(0),
        )

        self.username_to_wallet[
            normalized_username
        ] = wallet_address
        self.user_mutual_bets[wallet_address] = []
        self.user_consensus_bets[wallet_address] = []

    @gl.public.write
    def update_username(self, new_username: str) -> None:
        wallet_address = str(gl.message.sender_address)
        assert wallet_address in self.users, "User not found"
        assert 2 <= len(new_username) <= 30, "Username must be 2-30 chars"
        self.users[wallet_address].username = new_username

    # @gl.public.view
    # def get_user(self, wallet_address: str) -> User:
    #     assert wallet_address in self.users, "User not found"
    #     return gl.storage.copy_to_memory(self.users[wallet_address])

    @gl.public.view
    def get_user(self, identifier: str) -> User:

        # wallet lookup
        if identifier in self.users:
            return gl.storage.copy_to_memory(
                self.users[identifier]
            )

        # username lookup
        if identifier in self.username_to_wallet:
            wallet = self.username_to_wallet[identifier]

            return gl.storage.copy_to_memory(
                self.users[wallet]
            )

        assert False, "User not found"

    @gl.public.view
    def profile_exists(self, wallet_address: str) -> bool:
        return wallet_address in self.users

    @gl.public.write.payable
    def create_mutual_bet(
        self,
        challenger: str,
        description: str,
        category: str,
        creator_stake: i32,
        expiry_timestamp: i64,
        created_at: str
    ) -> str:
        creator = str(gl.message.sender_address)
        assert creator in self.users, "Creator not registered"
        assert challenger in self.users, "Challenger not registered"
        assert creator != challenger, "Cannot bet against yourself"
        expected_value = u256(creator_stake) * u256(10**18)
        assert gl.message.value == expected_value, "Must send exact creator stake"
        assert creator_stake > 0, "Invalid creator stake"
        assert 10 <= len(description) <= 500, "Description must be 10-500 chars"
        assert category in [
            "Crypto", "Sports", "Politics",
            "Entertainment", "Community", "Personal", "Other"
        ], "Invalid category"
        self.bet_counter += i32(1)
        bet_id = f"mutual_{self.bet_counter}"
        self.mutual_bets[bet_id] = MutualBet(
            bet_id=bet_id,
            creator=creator,
            challenger=challenger,
            description=description,
            category=category,
            creator_stake=creator_stake,
            challenger_stake=creator_stake,
            expiry_timestamp=expiry_timestamp,
            status="pending",
            created_at=created_at,
            settlement=self._empty_settlement()
        )
        self.user_mutual_bets[creator].append(bet_id)
        self.user_mutual_bets[challenger].append(bet_id)
        self.users[creator].total_bets += i32(1)
        self.users[creator].total_volume += creator_stake
        self.mutual_bet_ids.append(bet_id)
        return bet_id

    @gl.public.write.payable
    def accept_mutual_bet(self, bet_id: str) -> None:
        challenger = str(gl.message.sender_address)
        assert bet_id in self.mutual_bets, "Bet not found"
        bet = self.mutual_bets[bet_id]
        assert bet.status == "pending", "Bet not pending"
        assert challenger == bet.challenger, "Only challenger can accept"
        expected_value = u256(bet.challenger_stake) * u256(10**18)
        assert gl.message.value == expected_value, "Must send exact challenger stake"
        self.mutual_bets[bet_id].status = "active"
        self.users[challenger].total_bets += i32(1)
        self.users[challenger].total_volume += bet.challenger_stake

    @gl.public.write
    def cancel_mutual_bet(self, bet_id: str) -> None:
        creator = str(gl.message.sender_address)
        assert bet_id in self.mutual_bets, "Bet not found"
        bet = self.mutual_bets[bet_id]
        assert creator == bet.creator, "Only creator can cancel"
        assert bet.status == "pending", "Only pending bets can be cancelled"
        self.mutual_bets[bet_id].status = "cancelled"
        refund = u256(bet.creator_stake) * u256(10**18)
        gl.send(Address(creator), refund)

    @gl.public.write
    def settle_mutual_bet(self, bet_id: str) -> None:
        triggered_by = str(gl.message.sender_address)
        assert bet_id in self.mutual_bets, "Bet not found"
        bet = self.mutual_bets[bet_id]
        assert bet.status == "active", "Bet not active"
        assert (
            triggered_by == bet.creator or triggered_by == bet.challenger
        ), "Only participants can settle"
        now = int(datetime.now(timezone.utc).timestamp() * 1000)
        assert now >= bet.expiry_timestamp, "Bet has not expired yet"
        self.mutual_bets[bet_id].status = "awaiting_settlement"
        description = bet.description
        creator = bet.creator
        challenger = bet.challenger
        creator_username = self.users[creator].username
        challenger_username = self.users[challenger].username

        # Step 1 — verdict
        def get_verdict() -> str:
            prompt = f"""
    You are an impartial AI judge settling a bet between two people.

    Bet description: "{description}"

    The creator ({creator_username}) made this claim or prediction in the bet description above.
    The challenger ({challenger_username}) took the opposing side.

    Use your trained knowledge to determine the outcome.

    Reply with ONLY one of these exact strings, nothing else:
    creator_wins
    challenger_wins
    draw
    unresolved

    Rules:
    - creator_wins = the claim in the bet description came true
    - challenger_wins = the claim in the bet description did NOT come true
    - draw = genuinely ambiguous outcome
    - unresolved = event has genuinely not happened yet as of today June 2026
    - Be decisive. Only return unresolved if the event is still in the future.
    """
            return gl.nondet.exec_prompt(prompt).strip().lower().strip('"')

        verdict = gl.eq_principle.prompt_non_comparative(
            get_verdict,
            task="Determine the outcome of a bet between two people",
            criteria="Reply with exactly one of: creator_wins, challenger_wins, draw, unresolved. The verdict must reflect whether the creator's claim came true based on real-world knowledge."
        )
        verdict = verdict.strip().strip('"').lower()

        if verdict == "unresolved":
            self.mutual_bets[bet_id].status = "active"
            return

        # Step 2 — reasoning
        def get_reasoning() -> str:
            prompt = f"""
    A bet between two people was just settled.

    Bet: "{description}"
    Creator: {creator_username}
    Challenger: {challenger_username}
    Verdict: {verdict}

    Write one clear, concise sentence explaining why this verdict was reached, based on your knowledge.
    Reply with ONLY the reasoning sentence, nothing else.
    """
            return gl.nondet.exec_prompt(prompt).strip()

        reasoning = gl.eq_principle.prompt_non_comparative(
            get_reasoning,
            task="Explain why a bet verdict was reached",
            criteria="The explanation must be consistent with the verdict and factually grounded"
        )

        # Step 3 — store and update
        sources: DynArray[str] = []
        sources.append("GenLayer AI validators - trained knowledge")

        self.mutual_bets[bet_id].settlement = SettlementResult(
            verdict=verdict,
            reasoning=reasoning,
            sources_checked=sources,
            settled_at=gl.message_raw["datetime"],
            settled_by=triggered_by
        )
        self.mutual_bets[bet_id].status = "settled"

        # Step 4 — payout
        total_pool = u256(bet.creator_stake + bet.challenger_stake) * u256(10**18)

        if verdict == "creator_wins":
            _Recipient(Address(creator)).emit_transfer(value=total_pool)
            self.users[creator].total_won += i32(1)
            self.users[challenger].total_lost += i32(1)
        elif verdict == "challenger_wins":
            _Recipient(Address(challenger)).emit_transfer(value=total_pool)
            self.users[challenger].total_won += i32(1)
            self.users[creator].total_lost += i32(1)
        elif verdict == "draw":
            half = u256(bet.creator_stake) * u256(10**18)
            _Recipient(Address(creator)).emit_transfer(value=half)
            _Recipient(Address(challenger)).emit_transfer(value=half)


    @gl.public.write.payable
    def create_consensus_bet(
        self,
        description: str,
        category: str,
        creator_side: str,
        creator_stake: i32,
        min_stake: i32,
        expiry_timestamp: i64,
        created_at: str
    ) -> str:
        creator = str(gl.message.sender_address)
        assert creator in self.users, "User not registered"
        assert creator_side in ["FOR", "AGAINST"], "Invalid side"
        expected_value = u256(creator_stake) * u256(10**18)
        assert gl.message.value == expected_value, "Must send exact creator stake"
        self.bet_counter += i32(1)
        bet_id = f"consensus_{self.bet_counter}"
        participant = ConsensusParticipant(
            wallet_address=creator,
            side=creator_side,
            stake_gen=creator_stake
        )
        participants: DynArray[ConsensusParticipant] = []
        participants.append(participant)
        for_pool = creator_stake if creator_side == "FOR" else i32(0)
        against_pool = creator_stake if creator_side == "AGAINST" else i32(0)
        self.consensus_bets[bet_id] = ConsensusBet(
            bet_id=bet_id,
            creator=creator,
            description=description,
            category=category,
            creator_side=creator_side,
            for_pool=for_pool,
            against_pool=against_pool,
            min_stake=min_stake,
            expiry_timestamp=expiry_timestamp,
            status="active",
            created_at=created_at,
            participants=participants,
            settlement=self._empty_settlement()
        )
        self.user_consensus_bets[creator].append(bet_id)
        self.users[creator].total_bets += i32(1)
        self.users[creator].total_volume += creator_stake
        self.consensus_bet_ids.append(bet_id)
        return bet_id

    @gl.public.write.payable
    def join_consensus_bet(self, bet_id: str, side: str, stake: i32) -> None:
        wallet = str(gl.message.sender_address)
        assert side in ["FOR", "AGAINST"], "Invalid side"
        assert bet_id in self.consensus_bets, "Bet not found"
        bet = self.consensus_bets[bet_id]
        assert bet.status == "active", "Bet not active"
        assert stake >= bet.min_stake, "Stake below minimum"
        expected_value = u256(stake) * u256(10**18)
        assert gl.message.value == expected_value, "Must send exact stake"
        for p in bet.participants:
            assert p.wallet_address != wallet, "Already joined"
        participant = ConsensusParticipant(
            wallet_address=wallet,
            side=side,
            stake_gen=stake
        )
        bet.participants.append(participant)
        if side == "FOR":
            bet.for_pool += stake
        else:
            bet.against_pool += stake
        self.user_consensus_bets[wallet].append(bet_id)
        self.users[wallet].total_bets += i32(1)
        self.users[wallet].total_volume += stake

    @gl.public.write
    def settle_consensus_bet(self, bet_id: str) -> None:
        triggered_by = str(gl.message.sender_address)
        assert bet_id in self.consensus_bets, "Bet not found"
        bet = self.consensus_bets[bet_id]
        assert bet.status == "active", "Bet not active"
        now = int(datetime.now(timezone.utc).timestamp() * 1000)
        assert now >= bet.expiry_timestamp, "Bet not expired yet"
        self.consensus_bets[bet_id].status = "awaiting_settlement"
        description = bet.description

        # Step 1 — verdict
        def get_verdict() -> str:
            prompt = f"""
    You are an impartial AI judge settling a public prediction market bet.

    Prediction: "{description}"

    Use your trained knowledge to determine if this prediction has come true.

    Reply with ONLY one of these exact strings, nothing else:
    for_wins
    against_wins
    draw
    unresolved

    Rules:
    - for_wins = prediction came true
    - against_wins = prediction did NOT come true
    - unresolved = event genuinely still pending and you have no information
    - Be decisive
    """
            return gl.nondet.exec_prompt(prompt).strip().lower().strip('"')

        verdict = gl.eq_principle.prompt_non_comparative(
            get_verdict,
            task="Determine the outcome of a prediction market bet",
            criteria="Reply with exactly one of: for_wins, against_wins, draw, unresolved. The verdict must reflect whether the prediction came true based on real-world knowledge."
        )
        verdict = verdict.strip().strip('"').lower()

        if verdict == "unresolved":
            self.consensus_bets[bet_id].status = "active"
            return

        # Step 2 — reasoning
        def get_reasoning() -> str:
            prompt = f"""
    A prediction market bet was just settled.

    Prediction: "{description}"
    Verdict: {verdict}

    Write one clear, concise sentence explaining why this verdict was reached, based on your knowledge.
    Reply with ONLY the reasoning sentence, nothing else.
    """
            return gl.nondet.exec_prompt(prompt).strip()

        reasoning = gl.eq_principle.prompt_non_comparative(
            get_reasoning,
            task="Explain why a prediction market verdict was reached",
            criteria="The explanation must be consistent with the verdict and factually grounded"
        )

        # Step 3 — store and update
        sources: DynArray[str] = []
        sources.append("GenLayer AI validators - trained knowledge")

        self.consensus_bets[bet_id].settlement = SettlementResult(
            verdict=verdict,
            reasoning=reasoning,
            sources_checked=sources,
            settled_at=gl.message_raw["datetime"],
            settled_by=triggered_by
        )
        self.consensus_bets[bet_id].status = "settled"

        # Step 4 — payout
        winning_side = "FOR" if verdict == "for_wins" else "AGAINST"
        winning_pool = bet.for_pool if winning_side == "FOR" else bet.against_pool
        total_pool = bet.for_pool + bet.against_pool

        for participant in bet.participants:
            wallet = Address(participant.wallet_address)
            if participant.side == winning_side:
                share = u256(participant.stake_gen * total_pool // winning_pool)
                _Recipient(wallet).emit_transfer(value=share * u256(10**18))
                self.users[participant.wallet_address].total_won += i32(1)
            else:
                self.users[participant.wallet_address].total_lost += i32(1)

        if verdict == "draw":
            for participant in bet.participants:
                refund = u256(participant.stake_gen) * u256(10**18)
                _Recipient(Address(participant.wallet_address)).emit_transfer(value=refund)
     







    @gl.public.view
    def get_mutual_bet(self, bet_id: str) -> MutualBet:
        assert bet_id in self.mutual_bets, "Bet not found"
        return gl.storage.copy_to_memory(self.mutual_bets[bet_id])

    @gl.public.view
    def get_consensus_bet(self, bet_id: str) -> ConsensusBet:
        assert bet_id in self.consensus_bets, "Bet not found"
        return gl.storage.copy_to_memory(self.consensus_bets[bet_id])

    @gl.public.view
    def get_user_mutual_bets(self, wallet_address: str) -> list[MutualBet]:
        assert wallet_address in self.user_mutual_bets, "No bets found"
        result = []
        for bet_id in self.user_mutual_bets[wallet_address]:
            result.append(gl.storage.copy_to_memory(self.mutual_bets[bet_id]))
        return result

    @gl.public.view
    def get_user_consensus_bets(self, wallet_address: str) -> list[ConsensusBet]:
        assert wallet_address in self.user_consensus_bets, "No bets found"
        result = []
        for bet_id in self.user_consensus_bets[wallet_address]:
            result.append(gl.storage.copy_to_memory(self.consensus_bets[bet_id]))
        return result

    @gl.public.view
    def get_total_bets(self) -> i32:
        return self.bet_counter

    @gl.public.view
    def fetch_all_mutual_bets(self) -> list[MutualBet]:
        result: list[MutualBet] = []
        for bet_id in self.mutual_bet_ids:
            if bet_id in self.mutual_bets:
                result.append(gl.storage.copy_to_memory(self.mutual_bets[bet_id]))
        return result

    @gl.public.view
    def fetch_all_consensus_bets(self) -> list[ConsensusBet]:
        result = []
        for bet_id in self.consensus_bet_ids:
            result.append(gl.storage.copy_to_memory(self.consensus_bets[bet_id]))
        return result
    @gl.public.write
    def test_transfer(self) -> None:
        wallet = Address(str(gl.message.sender_address))

        _Recipient(
            wallet
        ).emit_transfer(
            value=u256(1) * u256(10**18)
        )