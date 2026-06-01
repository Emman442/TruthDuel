"use client"

import Navbar from '@/components/layout/Navbar';
import BetCard from '@/components/shared/BetCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  TrendingUp, 
  Wallet, 
  Trophy, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { MOCK_BETS, MOCK_USER } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Active Bets', value: '3', icon: Clock, color: 'text-blue-500' },
    { label: 'Total Won', value: '$1,240', icon: Trophy, color: 'text-success' },
    { label: 'Win Rate', value: '72%', icon: TrendingUp, color: 'text-primary' },
    { label: 'Wallet Balance', value: `${MOCK_USER.balance} USDC`, icon: Wallet, color: 'text-white' },
  ];

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Welcome back, {MOCK_USER.username}</h1>
              <p className="text-muted-foreground">Manage your predictions and track your earnings.</p>
            </div>
            <Link href="/create">
              <Button className="bg-primary hover:bg-primary/90 text-white neon-border gap-2">
                <PlusCircle className="w-4 h-4" />
                Create New Bet
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Card key={i} className="glass-card hover:border-primary/20 transition-all border-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">{s.value}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Section */}
          <div className="space-y-6">
            <Tabs defaultValue="my-bets" className="w-full">
              <TabsList className="bg-white/5 w-full justify-start p-1 h-12">
                <TabsTrigger value="my-bets" className="h-10 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">My Bets</TabsTrigger>
                <TabsTrigger value="created" className="h-10 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Created</TabsTrigger>
                <TabsTrigger value="settled" className="h-10 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Settled</TabsTrigger>
              </TabsList>
              
              <div className="mt-8">
                <TabsContent value="my-bets" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {MOCK_BETS.map(bet => <BetCard key={bet.id} bet={bet} />)} */}
                  </div>
                </TabsContent>
                <TabsContent value="created" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {MOCK_BETS.filter(b => b.creator.id === MOCK_USER.id).map(bet => <BetCard key={bet.id} bet={bet} />)} */}
                  </div>
                </TabsContent>
                <TabsContent value="settled" className="mt-0">
                  <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                    <Trophy className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground font-bold italic uppercase tracking-widest">No settled bets yet</p>
                    <Link href="/explore" className="mt-4">
                      <Button variant="link" className="text-primary gap-1">
                        Go join some bets <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}