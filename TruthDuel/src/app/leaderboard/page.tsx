"use client"

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MOCK_LEADERBOARD, MOCK_USER } from '@/lib/mock-data';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const top3 = MOCK_LEADERBOARD.slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Leaderboard</h1>
            <p className="text-muted-foreground">The most accurate predictors on the network.</p>
          </div>

          {/* Podium */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 pt-10">
            {/* Rank 2 */}
            <div className="order-2 md:order-1 flex flex-col items-center">
              <Avatar className="w-20 h-20 border-4 border-slate-400 mb-4">
                <AvatarImage src={top3[1].user.avatar} />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <p className="font-bold text-lg">@{top3[1].user.username}</p>
              <div className="h-32 w-32 md:w-40 bg-slate-400/10 border-t-2 border-slate-400 flex flex-col items-center justify-center p-4">
                <p className="text-xl font-black text-slate-400 italic">{top3[1].winRate}%</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Win Rate</p>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="order-1 md:order-2 flex flex-col items-center z-10 -mx-4">
              <Avatar className="w-24 h-24 border-4 border-yellow-500 neon-border mb-6 scale-110">
                <AvatarImage src={top3[0].user.avatar} />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <p className="font-black text-2xl text-yellow-500 mb-2">@{top3[0].user.username}</p>
              <div className="h-44 w-40 md:w-56 bg-yellow-500/10 border-t-4 border-yellow-500 flex flex-col items-center justify-center p-4">
                <p className="text-3xl font-black text-yellow-500 italic mb-1">{top3[0].winRate}%</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Master Oracle</p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="order-3 flex flex-col items-center">
              <Avatar className="w-20 h-20 border-4 border-amber-700 mb-4">
                <AvatarImage src={top3[2].user.avatar} />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <p className="font-bold text-lg">@{top3[2].user.username}</p>
              <div className="h-24 w-32 md:w-40 bg-amber-700/10 border-t-2 border-amber-700 flex flex-col items-center justify-center p-4">
                <p className="text-xl font-black text-amber-700 italic">{top3[2].winRate}%</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <Card className="glass-card overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="w-20 font-black uppercase text-xs">Rank</TableHead>
                  <TableHead className="font-black uppercase text-xs">User</TableHead>
                  <TableHead className="font-black uppercase text-xs">Win Rate</TableHead>
                  <TableHead className="font-black uppercase text-xs">Volume</TableHead>
                  <TableHead className="text-right font-black uppercase text-xs">Biggest Win</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LEADERBOARD.map((entry) => (
                  <TableRow key={entry.user.id} className={cn(
                    "border-white/5",
                    entry.user.id === MOCK_USER.id && "bg-primary/5"
                  )}>
                    <TableCell className="font-black italic text-lg">{entry.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={entry.user.avatar} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">@{entry.user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{entry.winRate}%</span>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">${entry.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-green-500">
                      +${entry.biggestWin.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Pinned User Status */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary/20 backdrop-blur-xl border-t border-primary/30 py-4 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black italic text-primary">#42</span>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-primary">
                <AvatarImage src={MOCK_USER.avatar} />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <p className="text-lg font-bold hidden sm:block">@{MOCK_USER.username}</p>
            </div>
          </div>
          <Link href="/profile/me">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold neon-border">
              View My Stats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}