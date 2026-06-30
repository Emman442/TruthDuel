"use client"

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  Timer,
  Wallet,
  ShieldCheck,
  Zap,
  Globe,
  Info,
  Trophy,
  Loader2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAcceptMutualBet, useFetchConsensusBet, useFetchMutualBet, useJoinConsensusBet, useSettleConsensusBet, useSettleMutualBet, useUserProfile } from '@/lib/hooks/useTruthDuel';
import { formatAddress } from '@/lib/genlayer/wallet';

export default function BetDetailClient({ id }: { id: string }) {
  const isMutual = id.startsWith("mutual_");
  const isDisabled=true
  const { isPending: isSettlingMutualBet, mutate: settleMutualBet } = useSettleMutualBet(id)
  const { isPending: isSettlingConsensusBet, mutate: settleConsensusBet } = useSettleConsensusBet(id)
  const { isPending: isJoiningConsensusBet, mutate: joinConsensusBet } = useJoinConsensusBet()
  const { isPending: isAcceptingChallenge, mutate: acceptChallenge } = useAcceptMutualBet(id)
  const {
    data: mutualBetData,
    isLoading: isLoadingMutual,
  } = useFetchMutualBet(id);

  const {
    data: consensusBetData,
    isLoading: isLoadingConsensus,
  } = useFetchConsensusBet(id);

  const rawBet = isMutual
    ? mutualBetData
    : consensusBetData;

  const bet = rawBet
    ? rawBet instanceof Map
      ? Object.fromEntries(rawBet)
      : rawBet
    : null;

  // SAFE
  const creatorAddress = bet && bet?.creator?.toString();

  const { data: creatorProfile } =
    useUserProfile(creatorAddress);

  const creator = creatorProfile
    ? creatorProfile instanceof Map
      ? Object.fromEntries(creatorProfile)
      : creatorProfile
    : null;

  const { data: mutualChallenger } = useUserProfile(bet?.challenger)


  const mutualChallengerProfile =
    mutualChallenger
      ? mutualChallenger instanceof Map
        ? Object.fromEntries(mutualChallenger)
        : mutualChallenger
      : null;

  const { toast } = useToast();

  const settlement = bet &&
    bet?.settlement instanceof Map
    ? Object.fromEntries(bet?.settlement)
    : bet?.settlement;

  if (isLoadingMutual || isLoadingConsensus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Bet not found
      </div>
    );
  }

  const handleJoinConsensusBet = async (side: string) => {
    await joinConsensusBet({ bet_id: id, side: side, stake: Number(bet.min_stake) }, {
      onSuccess: () => {
        toast({
          title: "Stake Successful",
          description: "You stake on this bet was successful!",
        });
      },
      onError: (error) => {
        console.error(error)
        toast({
          title: "Stake failed",
          description: "Your stake on this bet was unsuccessful!",
          variant: 'destructive'
        });
      }
    })
  }

  const handleSettle = () => {
    if (!bet) return;

    try {
      if (isMutual) {
        settleMutualBet({ bet_id: id }, {
          onSuccess: () => {
            toast({
              title: "Bet Settled Successfully",
              description: "Mutual bet has been settled by AI.",
            });
          },
          onError: (error) => {
            console.error("Settlement failed:", error);
            toast({
              title: "Settlement Failed",
              description: error.message || "Something went wrong. Please try again.",
              variant: "destructive",
            });
          }
        });
      } else {
        settleConsensusBet({ bet_id: id }, {
          onSuccess: () => {
            toast({
              title: "Bet Settled Successfully",
              description: "Consensus bet has been settled by AI.",
            });
          },
          onError: (error) => {
            console.error("Settlement failed:", error);
            toast({
              title: "Settlement Failed",
              description: error.message || "Something went wrong. Please try again.",
              variant: "destructive",
            });
          }
        });
      }

    } catch (error: any) {
      console.error("Settlement failed:", error);
      toast({
        title: "Settlement Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    };


  }

  const handleAcceptChallenge = async () => {

    acceptChallenge({ bet_id: id, creator_stake: Number(bet.creator_stake) }, {
      onSuccess: () => {
        toast({
          title: "Challenge Accepted!",
          description: `You have successfully staked ${Number(bet.creator_stake)} GEN. Funds are now locked in escrow.`,
        });
      }, onError: (error) => {
        console.error(error);
        toast({
          title: "Failed to Accept Challenge",
          description: "There was an issue accepting the challenge. Please try again.",
          variant: "destructive",
        });
      }
    })

  };

  const expiryDate = new Date(Number(bet.expiry_timestamp));

  const isEndingSoon =
    expiryDate.getTime() - Date.now()
    < 24 * 60 * 60 * 1000;

  const isConsensus =
    "for_pool" in bet;

  const totalPool = isConsensus
    ? Number(bet.for_pool) + Number(bet.against_pool)
    : Number(bet.creator_stake) + Number(bet.challenger_stake);

  const forPool = isConsensus
    ? Number(bet.for_pool)
    : 0;

  const againstPool = isConsensus
    ? Number(bet.against_pool)
    : 0;

  const participants =
    bet.participants?.map((p: any) =>
      p instanceof Map
        ? Object.fromEntries(p)
        : p
    ) ?? [];

  const forParticipants =
    participants.filter(
      (p: any) => p.side === "FOR"
    ).length;

  const againstParticipants =
    participants.filter(
      (p: any) => p.side === "AGAINST"
    ).length;
  console.log("bet: ", bet)
  console.log({
    status: bet.status,
    settlement,
    challenger: bet.challenger,
    isMutual,
  });
  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/explore">
          <Button variant="ghost" className="mb-6 -ml-4 gap-2 text-muted-foreground hover:text-white">
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </Button>
        </Link>

        <div className="space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/20 text-primary">{bet.category}</Badge>
              <Badge variant="secondary">{isMutual ? "Mutual" : "Consensus"}</Badge>
              <Badge className={cn(
                bet.status === 'active' ? "bg-success" : "bg-info"
              )}>{bet.status.replace('_', ' ')}</Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight leading-tight uppercase">
              {bet.description}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-primary/20">
                  {/* <AvatarImage src={bet.creator.avatar} /> */}
                  <AvatarFallback>
                    {creator?.username?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Created by</p>
                  <p className="font-bold">@{creator?.username}</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Expiry</p>
                  <div className={cn("flex items-center gap-1 font-bold", isEndingSoon && "text-destructive animate-pulse-red")}>
                    <Timer className="w-4 h-4" />
                    {formatDistanceToNow(new Date(Number(bet.expiry_timestamp)), { addSuffix: true })}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Stake</p>
                  <div className="flex items-center gap-1 font-bold text-primary">
                    <Wallet className="w-4 h-4" />
                    {totalPool} GEN
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bet Content Sections */}
          {isMutual ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Challenger 1 (Creator)</p>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                      {/* <AvatarImage src={bet.creator.avatar} /> */}
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">@{creator?.username}</p>
                      <p className="text-xs text-muted-foreground font-mono">{formatAddress(creator?.wallet_address)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black italic text-primary">{bet.creator_stake} GEN</p>
                    <p className="text-[10px] text-success font-bold uppercase tracking-widest">Locked</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn("glass-card", !bet.challenger && "border-dashed border-primary/20 bg-primary/5")}>
                {bet.status !== "pending" ? (
                  <>
                    <CardHeader className="pb-2">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Challenger 2</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-info">
                          {/* <AvatarImage src={bet.challenger.avatar} /> */}
                          <AvatarFallback>CH</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">@{mutualChallengerProfile?.username}</p>
                          <p className="text-xs text-muted-foreground font-mono">{formatAddress(mutualChallengerProfile?.wallet_address)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black italic text-info">{bet.creator_stake} GEN</p>
                        <p className="text-[10px] text-success font-bold uppercase tracking-widest">Locked</p>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="h-full flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="text-center">
                      <p className="font-bold text-muted-foreground mb-1">Awaiting Challenger...</p>
                      <p className="text-xs text-muted-foreground">Stake {Number(bet.creator_stake)} GEN to enter</p>
                    </div>
                    <Button
                      onClick={handleAcceptChallenge}
                      disabled={isAcceptingChallenge || !bet.challenger}
                      className="bg-primary hover:bg-primary/90 text-white neon-border w-full max-w-[200px]"
                    >
                      {isAcceptingChallenge ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                      Accept Challenge
                    </Button>
                  </CardContent>
                )}
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardContent className="pt-6 space-y-6">

                  <div className="flex justify-between items-end">

                    <div className="space-y-1">
                      <p className="text-sm font-black italic text-success uppercase">
                        FOR Prediction
                      </p>

                      <p className="text-2xl font-black">
                        {forPool} GEN
                      </p>

                      <p className="text-xs text-muted-foreground font-bold">
                        {forParticipants} participants
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-sm font-black italic text-destructive uppercase">
                        AGAINST Prediction
                      </p>

                      <p className="text-2xl font-black">
                        {againstPool} GEN
                      </p>

                      <p className="text-xs text-muted-foreground font-bold">
                        {againstParticipants} participants
                      </p>
                    </div>

                  </div>

                  <div className="space-y-2">

                    <Progress
                      value={
                        totalPool > 0
                          ? (forPool / totalPool) * 100
                          : 50
                      }
                      className="h-4 bg-destructive/20"
                    />

                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">

                      <span>
                        {Math.round(
                          totalPool > 0
                            ? (forPool / totalPool) * 100
                            : 0
                        )}%
                      </span>

                      <span>
                        {Math.round(
                          totalPool > 0
                            ? (againstPool / totalPool) * 100
                            : 0
                        )}%
                      </span>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <Button
                      variant="outline"
                      className="h-14 border-success/20 hover:bg-success hover:text-white transition-all text-success font-black text-lg"
                      onClick={() => handleJoinConsensusBet("FOR")}
                    >
                      STAKE FOR
                    </Button>

                    <Button
                      variant="outline"
                      className="h-14 border-destructive/20 hover:bg-destructive hover:text-white transition-all text-destructive font-black text-lg"
                      onClick={() => handleJoinConsensusBet("AGAINST")}
                    >
                      STAKE AGAINST
                    </Button>

                  </div>

                </CardContent>
              </Card>
            </div>
          )}

          {/* Settlement Section */}
          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">AI Settlement</h2>
              {!settlement?.verdict && (bet.status === 'active' || bet.status === 'pending') && (
                <Button
                  onClick={handleSettle}
                  disabled={
                    isMutual
                      ? isSettlingMutualBet || !bet.challenger
                      : isSettlingConsensusBet || participants.length < 2
                  }
                  className="bg-primary hover:bg-primary/90 text-white neon-border"
                >
                  {(
                    isMutual
                      ? isSettlingMutualBet
                      : isSettlingConsensusBet
                  ) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                  Trigger Settlement
                </Button>
              )}
            </div>

            {(isSettlingConsensusBet || isSettlingMutualBet) && (
              <Card className="glass-card animate-pulse border-primary/40">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-primary animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold">GenLayer Validators Reading the Web...</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Scanning reliable news sources and public data to determine the outcome of this bet.
                  </p>
                </CardContent>
              </Card>
            )}

            {bet.status === "settled" && settlement?.verdict && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className={cn(
                  "glass-card border-l-4",
                  settlement.verdict === 'FOR_WINS' ? "border-l-success" :
                    settlement.verdict === 'AGAINST_WINS' ? "border-l-destructive" : "border-l-blue-500"
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg uppercase font-black italic">Verified Verdict</CardTitle>
                      </div>
                      <Badge className={cn(
                        "text-sm px-4 py-1 font-black",
                        settlement.verdict === 'FOR_WINS' ? "bg-success" :
                          settlement.verdict === 'AGAINST_WINS' ? "bg-destructive" : "bg-blue-500"
                      )}>
                        {settlement.verdict.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                        <Info className="w-3 h-3" />
                        AI Reasoning
                      </div>
                      <p className="text-sm leading-relaxed">{settlement.reasoning}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                        <Globe className="w-3 h-3" />
                        Sources Checked
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {settlement?.sources_checked?.map((source, i) => (
                          <a
                            key={i}
                            href={isDisabled ? undefined : source}           // ← important
                            target={isDisabled ? undefined : "_blank"}
                            rel={isDisabled ? undefined : "noopener noreferrer"}
                            onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                            className={`flex items-center justify-between p-3 rounded-lg text-xs border transition-all
    ${isDisabled
                                ? 'bg-white/5 border-white/10 text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none'
                                : 'bg-white/5 hover:bg-white/10 border-white/5 active:scale-[0.985]'
                              }`}
                          >
                            <span className="truncate max-w-[90%]">{source}</span>
                            <ExternalLink className={`w-3 h-3 ${isDisabled ? 'opacity-40' : ''}`} />
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Payouts Disbursed</p>
                          <p className="text-sm font-bold">{totalPool} GEN released to winners</p>
                        </div>
                      </div>
                      {/* <Button variant="outline" size="sm" className="text-xs h-8 border-white/10">
                        View Tx on Genlayer Explorer
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
