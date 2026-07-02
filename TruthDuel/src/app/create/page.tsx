"use client"

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, User, ArrowRight, ShieldCheck, Wallet, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BetMode, BetCategory } from '@/lib/types';
import { useCreateConsensusBet, useCreateMutualBet } from '@/lib/hooks/useTruthDuel';
import { toast } from 'sonner';

export default function CreateBetPage() {
  const [mode, setMode] = useState<BetMode | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string>('');
  const [stake, setStake] = useState<string>('');
  const [minstake, setMinStake] = useState<string>('');
  const [challenger, setChallenger] = useState<string>('');
  const [creatorSide, setCreatorSide] = useState<'FOR' | 'AGAINST'>('FOR');
  const { isPending: isCreatingMutualBet, mutateAsync: createMutualBet } = useCreateMutualBet();
  const { isPending: isCreatingConsensusBet, mutateAsync: createConsensusBet } = useCreateConsensusBet();
  const categories: BetCategory[] = ['Crypto', 'Sports', 'Politics', 'Entertainment', 'Community', 'Personal', 'Other'];

  const handleCreateBet = () => {
    if (!mode || !description || !category || !expiry) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (Date.parse(expiry) <= Date.now()) {
      toast.error("Expiry must be in the future");
      return;
    }
    if (mode === 'MUTUAL') {
      createMutualBet({
        challenger,
        description,
        category: category || 'Other',
        creator_stake: parseFloat(stake),
        expiry_timestamp: new Date(expiry).getTime(),
        created_at: new Date().toISOString(),
      }, {
        onSuccess: () => {
          setMode(null);
          setDescription('');
          setCategory(null);
          setExpiry('');
          setStake('');
          setChallenger('');
          toast.success("Mutual bet created successfully!");
        }
      });
    } else {
      // Handle consensus bet creation (not implemented in this snippet)
      createConsensusBet({
        description,
        category: category || 'Other',
        creator_side: creatorSide,
        creator_stake: parseFloat(minstake),
        min_stake: parseFloat(minstake),
        expiry_timestamp: new Date(expiry).getTime(),
        created_at: new Date().toISOString(),
      }, {
        onSuccess: () => {
          setMode(null);
          setDescription('');
          setCategory(null);
          setExpiry('');
          setStake('');
          toast.success("Consensus bet created successfully!");
        },
        onError: (error) => {
          console.error("Error creating consensus bet:", error);
          toast.error("Failed to create consensus bet. Please try again.");
        }
      });
    }
  }

  // console.log({mode, minstake, creatorSide, category, description, expiry, stake});

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Create a New Bet</h1>
            <p className="text-muted-foreground">Choose your mode and set the terms in plain English.</p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('MUTUAL')}
              className={cn(
                "text-left p-6 rounded-2xl border-2 transition-all duration-300 group hover:scale-[1.02]",
                mode === 'MUTUAL' ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:border-white/20"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-white/10 group-hover:border-primary/50">
                  <User className={cn("w-6 h-6", mode === 'MUTUAL' ? "text-primary" : "text-muted-foreground")} />
                </div>
                {mode === 'MUTUAL' && <div className="w-3 h-3 bg-primary rounded-full neon-border"></div>}
              </div>
              <h3 className="text-xl font-bold mb-2">Mutual Mode</h3>
              <p className="text-sm text-muted-foreground">Challenge a specific person 1v1. Both parties stake GEN, and AI settles the winner.</p>
            </button>

            <button
              onClick={() => setMode('CONSENSUS')}
              className={cn(
                "text-left p-6 rounded-2xl border-2 transition-all duration-300 group hover:scale-[1.02]",
                mode === 'CONSENSUS' ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:border-white/20"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-white/10 group-hover:border-primary/50">
                  <Users className={cn("w-6 h-6", mode === 'CONSENSUS' ? "text-primary" : "text-muted-foreground")} />
                </div>
                {mode === 'CONSENSUS' && <div className="w-3 h-3 bg-primary rounded-full neon-border"></div>}
              </div>
              <h3 className="text-xl font-bold mb-2">Consensus Mode</h3>
              <p className="text-sm text-muted-foreground">Post a public prediction. Anyone can join FOR or AGAINST. Winnings shared among victors.</p>
            </button>
          </div>

          {mode && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8 p-8 rounded-3xl bg-white/[0.03] border border-white/5">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Prediction Description</Label>
                  <Textarea
                    placeholder={mode === 'MUTUAL' ? "e.g. I bet ETH hits $5k before July 1st" : "e.g. Bitcoin will hit $200k before end of 2026"}
                    className="min-h-[120px] bg-background border-white/10 text-lg font-medium resize-none focus:border-primary/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 240))}
                  />
                  <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Be specific for best AI settlement results</span>
                    <span>{description.length}/240</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                    <Select onValueChange={(value) => setCategory(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Expiry Date</Label>
                    <Input type="datetime-local" className="bg-background border-white/10 h-12" onChange={(e) => setExpiry(e.target.value)} />
                  </div>
                </div>

                {mode === 'MUTUAL' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-primary/70">Your Stake (GEN)</Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="0.00" className="pl-10 bg-background border-primary/20 h-12 font-bold" onChange={
                          (e) => setStake(e.target.value)
                        } />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-primary/70">Challenger Wallet/Name</Label>
                      <Input placeholder="0x..." className="bg-background border-primary/20 h-12" onChange={(e) => setChallenger(e.target.value)} />
                    </div>
                  </div>
                )}

                {mode === 'CONSENSUS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">

                    {/* Pick Side */}
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-primary/70">
                        Pick Your Position
                      </Label>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setCreatorSide('FOR')}
                          className={`h-14 rounded-xl border font-black transition-all ${creatorSide === 'FOR'
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-background border-primary/20 hover:border-green-500/50'
                            }`}
                        >
                          FOR
                        </button>

                        <button
                          type="button"
                          onClick={() => setCreatorSide('AGAINST')}
                          className={`h-14 rounded-xl border font-black transition-all ${creatorSide === 'AGAINST'
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-background border-primary/20 hover:border-red-500/50'
                            }`}
                        >
                          AGAINST
                        </button>
                      </div>
                    </div>


                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-primary/70">Initial Pool Stake (GEN)</Label>
                      <Input placeholder="0.00" className="bg-background border-primary/20 h-12 font-bold" onChange={(e) => setMinStake(e.target.value)} />
                    </div>
                    {/* <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-primary/70">Min. Stake per User</Label>
                      <Input placeholder="1.00" className="bg-background border-primary/20 h-12" onChange={(e) => setMinStake(parseFloat(e.target.value) || 0)} />
                    </div> */}
                  </div>
                )}

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-white/5 mb-6">
                    <ShieldCheck className="w-5 h-5 text-success" />
                    <div className="text-xs">
                      <p className="font-bold">Funds Secured by Genlayer</p>
                      <p className="text-muted-foreground">Your stake will be locked in a smart contract and released only upon settlement.</p>
                    </div>
                  </div>

                  <Button onClick={handleCreateBet} disabled={mode === 'MUTUAL' ? isCreatingMutualBet : isCreatingConsensusBet} className="w-full h-16 text-lg font-black uppercase italic tracking-tighter bg-primary hover:bg-primary/90 text-white neon-border group">
                    {isCreatingMutualBet || isCreatingConsensusBet ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating & Locking Stake...
                      </>
                    ) : (
                      <>
                        Create & Lock Stake
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}