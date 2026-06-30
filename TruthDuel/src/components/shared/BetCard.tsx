"use client"

import Link from 'next/link';
import { Timer, Users, Wallet, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ConsensusBet, MutualBet, UserProfile } from '@/lib/contracts/types';
import { useUserProfile } from '@/lib/hooks/useTruthDuel';
import { cn } from '@/lib/utils';

type UnifiedBet =
  | (MutualBet & { mode: "MUTUAL"; totalPool: number; })
  | (ConsensusBet & { mode: "CONSENSUS"; totalPool: number; });

interface BetCardProps {
  bet: UnifiedBet;
}

export default function BetCard({ bet }: BetCardProps) {
  const categoryColors: Record<string, string> = {
    Crypto: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Sports: 'bg-green-500/10 text-green-500 border-green-500/20',
    Politics: 'bg-red-500/10 text-red-500 border-red-500/20',
    Entertainment: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Community: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Personal: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    Other: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };


  if(!bet) return;


  const { data: creatorProfile, } = useUserProfile(bet.creator.toString())
  const creator = creatorProfile ?? null; 

  const isEndingSoon = new Date(Number(bet.expiry_timestamp)).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  console.log(bet)

  return (
    <Card className="glass-card overflow-hidden hover:border-primary/40 transition-all duration-300 group">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex gap-2">
          <Badge variant="outline" className={cn
            ("font-semibold uppercase tracking-wider text-[10px]", categoryColors[bet.category])}>
            {bet.category}
          </Badge>
          <Badge variant="secondary" className="bg-secondary/50 text-[10px] uppercase font-bold tracking-wider">
            {bet.mode}
          </Badge>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider",
          isEndingSoon ? "text-destructive animate-pulse" : "text-muted-foreground"
        )}>
          <Timer className="w-3 h-3" />
          {formatDistanceToNow(new Date(Number(bet.expiry_timestamp)), { addSuffix: true })}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
          {bet.description}
        </h3>

        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 border border-white/10">
            {/* <AvatarImage src={bet.creator.avatar} /> */}
            <AvatarFallback>{creator?.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{creator?.username}</span>
        </div>

        {bet.mode === 'CONSENSUS' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
              <span className="text-success">FOR {Math.round((Number(bet.for_pool) / Number(bet.totalPool)) * 100)}%</span>
              <span className="text-destructive">AGAINST {Math.round((Number(bet.against_pool) / Number(bet.totalPool)) * 100)}%</span>
            </div>
            <Progress
              value={(Number(bet.for_pool) / Number(bet.against_pool)) * 100}
              className="h-1.5 bg-destructive/20"
            />
          </div>
        )}

        {bet.mode === 'MUTUAL' && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Status</span>
              <span className={cn(
                "text-xs font-bold",
                bet.status === 'ACTIVE' ? "text-success" : "text-info"
              )}>
                {bet.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-bold">1v1</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Stake Pool</span>
          <div className="flex items-center gap-1">
            <Wallet className="w-3 h-3 text-primary" />
            <span className="text-sm font-bold">{bet?.totalPool} <span className="text-muted-foreground text-[10px]">GEN</span></span>
          </div>
        </div>
        <Link href={`/bet/${bet.bet_id}`}>
          <Button size="sm" className="bg-primary/20 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all gap-1 group/btn">
            View Bet
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}