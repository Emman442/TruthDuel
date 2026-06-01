import { TransactionReceipt } from "@privy-io/react-auth";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

import { TransactionStatus } from "genlayer-js/types"
import { parseEther } from "viem";
import { ConsensusBet, MutualBet, UserProfile } from "./types";
/**
 * TruthDuel contract class for interacting with the GenLayer TruthDuel contract
 */
class TruthDuel {
    private contractAddress: `0x${string}`;
    private client: ReturnType<typeof createClient>;

    constructor(
        contractAddress: string,
        address?: string | null,
        studioUrl?: string
    ) {
        this.contractAddress = contractAddress as `0x${string}`;

        const config: any = {
            chain: studionet,
        };

        if (address) {
            config.account = address as `0x${string}`;
        }

        if (studioUrl) {
            config.endpoint = studioUrl;
        }

        this.client = createClient(config);
    }

    /**
     * Update the address used for transactions
     */
    updateAccount(address: string): void {
        const config: any = {
            chain: studionet,
            account: address as `0x${string}`,
        };

        this.client = createClient(config);
    }


    /**
     * Get a particular user profile from the contract
     * @returns a user profile object with all relevant details
     */
    async CheckIfProfileExists(account_address: string): Promise<boolean> {

        try {
            const profile_exists: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "profile_exists",
                args: [account_address],
            });

            return profile_exists as boolean;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to check if user profile exists");
        }
    }


    async getUserProfile(wallet_address: string): Promise<UserProfile> {
        try {
            const profile: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_user",
                args: [wallet_address],
            });

            console.log("profile: ", profile)


            return profile as UserProfile;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to fetch user profile");
        }
    }

    async getMutualBets(): Promise<MutualBet[]> {
        try {
            const mutual_bets: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "fetch_all_mutual_bets",
            });


            return mutual_bets as MutualBet[];

        } catch (error) {
            console.error("Error fetching mutual bets:", error);
            throw new Error("Failed to fetch mutual bets");
        }
    }

    async getMutualBet(bet_id: string): Promise<MutualBet> {
        try {
            const mutual_bet: any = await this.client.readContract({

                address: this.contractAddress,
                functionName: "get_mutual_bet",
                args: [bet_id],
            });

            // console.log("Mutual betttt", mutual_bet)

            return mutual_bet as MutualBet;

        } catch (error) {
            console.error("Error fetching mutual bet:", error);
            throw new Error("Failed to fetch mutual bet");
        }
    }

    async getConsensusBet(bet_id: string): Promise<ConsensusBet> {
        try {
            const consensus: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_consensus_bet",
                args: [bet_id],
            });

            return consensus as ConsensusBet;

        } catch (error) {
            console.error("Error fetching consensus:", error);
            throw new Error("Failed to fetch consensus");
        }

    }

    async getConsensusBets(): Promise<ConsensusBet[]> {
        try {
            const consensus_bets: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "fetch_all_consensus_bets",
            });

            return consensus_bets as ConsensusBet[];

        } catch (error) {
            console.error("Error fetching consensus bets:", error);
            throw new Error("Failed to fetch consensus bets");
        }
    }

    // Add more contract interaction methods as needed

    async createProfile(username: string) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "register_user",
                args: [username],
                value: BigInt(0),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
            });
            console.log("Receopttt", receipt)
            return receipt as TransactionReceipt
                ;
        } catch (error) {
            console.error("Error creating profile:", error);
            throw new Error("Failed to create profile");
        }
    }


    async createMutualBet(challenger: string,
        description: string,
        category: string,
        creator_stake: number,
        expiry_timestamp: number,
        created_at: string
    ) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "create_mutual_bet",
                args: [challenger, description, category, creator_stake, expiry_timestamp, created_at],
                value: parseEther(creator_stake.toString()),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error creating mutual bet:", error);
            throw new Error("Failed to create mutual bet");
        }
    }


    async createConsensusBet(
        description: string,
        category: string,
        creator_side: string,
        creator_stake: number,
        min_stake: number,
        expiry_timestamp: number,
        created_at: string,
    ) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "create_consensus_bet",
                args: [description, category, creator_side, creator_stake, min_stake, expiry_timestamp, created_at],
                value: parseEther(creator_stake.toString()),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error creating consensus bet:", error);
            throw new Error("Failed to create consensus bet");
        }
    }



    async settleConsensusBet(
        bet_id: string,
    ) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "settle_consensus_bet",
                args: [bet_id],
                value: BigInt(0),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
                retries: 60,
                interval: 5000,
            });
            console.log("Receopttt", receipt)
            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error creating consensus bet:", error);
            throw new Error("Failed to create consensus bet");
        }
    }


    async settleMutualBet(
        bet_id: string
    ) {
        await this.client.connect("studionet");

        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "settle_mutual_bet",
                args: [bet_id],
                value: BigInt(0),
            });

            const receipt =
                await this.client.waitForTransactionReceipt({
                    hash: txHash,
                    status: TransactionStatus.ACCEPTED,
                    retries: 24,
                    interval: 5000,
                });
            console.log("Receopttt", receipt)
            return receipt as TransactionReceipt;

        } catch (error) {
            console.error(
                "Error settling mutual bet:",
                error
            );

            throw new Error(
                "Failed to settle mutual bet"
            );
        }
    }

    async joinConsensusBet(
        bet_id: string,
        side: string,
        stake: number
    ) {
        await this.client.connect("studionet");

        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "join_consensus_bet",
                args: [bet_id, side, stake],
                value: parseEther(stake.toString()),
            });

            const receipt =
                await this.client.waitForTransactionReceipt({
                    hash: txHash,
                    status: TransactionStatus.ACCEPTED,
                });
            console.log("Receipt", receipt)
            return receipt as TransactionReceipt;

        } catch (error) {
            console.error(
                "Error joining consensus bet:",
                error
            );

            throw new Error(
                "Failed to join consensus bet"
            );
        }
    }


    async acceptMutualChallenge(
        bet_id: string,
        creator_stake: number
    ) {
        await this.client.connect("studionet");

        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "accept_mutual_bet",
                args: [bet_id],
                value: parseEther(creator_stake.toString()),
            });

            const receipt =
                await this.client.waitForTransactionReceipt({
                    hash: txHash,
                    status: TransactionStatus.ACCEPTED,
                });
            console.log("Receipt", receipt)
            return receipt as TransactionReceipt;

        } catch (error) {
            console.error(
                "Error accepting mutual bet:",
                error
            );

            throw new Error(
                "Failed to accept mutual bet"
            );
        }
    }
}


export default TruthDuel