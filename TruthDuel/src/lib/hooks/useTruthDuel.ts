"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import TruthDuel from "@/lib/contracts/TruthBets"
import { getContractAddress } from "../genlayer/client";
import type { UserProfile, MutualBet, ConsensusBet, SettlementResult } from "../contracts/types";
import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";


export function useVeriFreeContract(): TruthDuel | null {
    const { wallets } = useWallets();
    const contractAddress = getContractAddress();
    const address = wallets[0]?.address;

    return useMemo(() => {
        if (!contractAddress || !address) {
            return null;
        }
        return new TruthDuel(contractAddress, address);
    }, [contractAddress, address]);
}

export function useCheckIfProfileExists(account_address: string | null) {
    const contract = useVeriFreeContract();

    return useQuery<boolean, Error>({
        queryKey: ["profileExists", account_address],
        queryFn: async () => {
            if (!account_address) return false;
            if (!contract) throw new Error("Contract not initialized");

            return await contract.CheckIfProfileExists(account_address);
        },
        enabled: !!account_address && !!contract,
        retry: false,
    });
}

export function useUserProfile(wallet_address: string) {
    const contract = useVeriFreeContract();

    return useQuery<UserProfile, Error>({
        queryKey: ["userProfile", wallet_address],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getUserProfile(wallet_address);
        },
        enabled: !!contract && !!wallet_address,
    });
}

export function useFetchMutualBets() {
    const contract = useVeriFreeContract();

    return useQuery<MutualBet[], Error>({
        queryKey: ["mutual_bets"],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getMutualBets();
        },
    });
}

export function useFetchMutualBet(bet_id: string) {
    const contract = useVeriFreeContract();

    console.log("MUTUAL HOOK", {
        bet_id,
        contract,
        enabled: !!bet_id && !!contract
    });

    return useQuery({
        queryKey: ["mutual_bet", bet_id],           // Good
        queryFn: async () => {
            if (!contract) {
                throw new Error("Contract not initialized yet");
            }
            console.log("RUNNING QUERY", bet_id);

            try {
                const bet = await contract.getMutualBet(bet_id);
                console.log("FETCHED BET", bet);
                return bet;
            } catch (error) {
                console.error("Failed to fetch mutual bet:", error);
                throw error;
            }
        },
        enabled: !!bet_id && !!contract,            // ← VERY IMPORTANT
        retry: 2,
        staleTime: 1000 * 30,                       // 30 seconds
        gcTime: 1000 * 60 * 5,                      // 5 minutes
    });
}
export function useFetchConsensusBet(bet_id: string) {
    const contract = useVeriFreeContract();

    return useQuery<ConsensusBet, Error>({
        queryKey: ["consensus_bet", bet_id],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getConsensusBet(bet_id);
        },
    });
}

export function useFetchConsensusBets() {
    const contract = useVeriFreeContract();

    return useQuery<ConsensusBet[], Error>({
        queryKey: ["consensus_bets"],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getConsensusBets();
        },
    });
}



export function useCreateProfile() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            username,
        }: {
            username: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createProfile(username);
            console.log("Profile creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            // refresh any relevant reads after profile creation
            await queryClient.invalidateQueries({
                queryKey: ["profileExists"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}

export function useCreateMutualBet() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            challenger,
            description,
            category,
            creator_stake,
            expiry_timestamp,
            created_at
        }: {
            description: string;
            category: string;
            creator_stake: number;
            expiry_timestamp: number;
            created_at: string;
            challenger: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createMutualBet(challenger, description, category, creator_stake, expiry_timestamp, created_at);
            console.log("Mutual bet creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["mutual_bet_created"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["mutual_bet"],
            });
        },
        onError: async (error) => {
            console.error("Error creating mutual bet:", error);
            toast.error("Failed to create mutual bet. Please try again.");
        }
    });
}


export function useCreateConsensusBet() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            description,
            category,
            creator_side,
            creator_stake,
            min_stake,
            expiry_timestamp,
            created_at
        }: {
            description: string;
            category: string;
            creator_side: string;
            creator_stake: number;
            min_stake: number;
            expiry_timestamp: number;
            created_at: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createConsensusBet(description, category, creator_side, creator_stake, min_stake, expiry_timestamp, created_at);
            console.log("Consensus bet creation transaction receipt:", receipt);
            return receipt;
        },


        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["consensus_bet_created"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["consensus_bets"],
            });
        },
        onError: async (error) => {
            console.error("Error creating consensus bet:", error);
            toast.error("Failed to create consensus bet. Please try again.");
        }
    });
}

export function useSettleConsensusBet(bet_id: string) {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bet_id
        }: {
            bet_id: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.settleConsensusBet(bet_id);

            console.log("Consensus bet settlement transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["consensus_bet"],
            });
        },
        onError: async (error) => {
            console.error("Error settling consensus bet:", error);
            toast.error("Failed to settle consensus bet. Please try again.");
        }
    });
}

export function useJoinConsensusBet() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bet_id,
            side,
            stake
        }: {
            bet_id: string;
            side: string;
            stake: number;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.joinConsensusBet(bet_id, side, stake);
            console.log("join consensus bet transaction receipt:", receipt);
            return receipt;
        },


        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["joined_consensus_bet"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["consensus_bets"],
            });
        },
        onError: async (error) => {
            console.error("Error joining Consensus bet:", error);
            toast.error("Failed to join consensus bet. Please try again.");
        }
    });
}


export function useSettleMutualBet(bet_id: string) {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bet_id
        }: {
            bet_id: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.settleMutualBet(bet_id);
            console.log("Mutual bet settlement transaction receipt:", receipt);
            return receipt;
        },


        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["mutual_bet"],
            });
        },
        onError: async (error) => {
            console.error("Error settling mutual bet:", error);
            toast.error("Failed to settle mutual bet. Please try again.");
        }
    });
}


export function useAcceptMutualBet(bet_id: string) {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bet_id,
            creator_stake
        }: {
            bet_id: string;
            creator_stake: number
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.acceptMutualChallenge(bet_id, creator_stake);
            console.log("Acceot Mutual Transaction Receipt:", receipt);
            return receipt;
        },


        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["accepted_mutual_bet"],  
            });

            await queryClient.invalidateQueries({
                queryKey: ["mutual_bet"],
            });
        },
        onError: async (error) => {
            console.error("Error accepting mutual bets:", error);
            toast.error("Failed to accept mutual bet. Please try again.");
        }
    });
}
