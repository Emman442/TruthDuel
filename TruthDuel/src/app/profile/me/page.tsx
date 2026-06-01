"use client"

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_USER, MOCK_ACTIVITIES } from '@/lib/mock-data';
import { Wallet, Trophy, Target, TrendingUp, ShieldCheck, Mail, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/lib/hooks/useTruthDuel';
import { useWallets } from '@privy-io/react-auth';
import { HashLoader } from 'react-spinners';
import { formatAddress } from '@/lib/genlayer/wallet';

export default function ProfilePage() {
  const { wallets } = useWallets();
  const address = wallets[0]?.address || "";

  const { isFetching: isUserProfileFetching, data: userProfile } = useUserProfile(address)

  if (isUserProfileFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="flex flex-col items-center gap-4">
          <HashLoader size={40} color="#4F46E5" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const userProfileObj = userProfile
  ? Object.fromEntries(userProfile)
  : null;
  console.log(userProfileObj)

  const user_accuracy = userProfileObj && userProfileObj.total_bets > 0 ? ((userProfileObj.total_won / userProfileObj.total_bets) * 100).toFixed(2) + "%" : "0%";
  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Info */}
          <div className="space-y-6">
            <Card className="glass-card overflow-hidden">
              <div className="h-24 bg-primary/20 relative">
                <div className="absolute -bottom-10 left-6">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                    <AvatarImage src={MOCK_USER.avatar} />
                    <AvatarFallback>{userProfile?.username}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-14 pb-6 px-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-sm font-black italic tracking-tighter">@{userProfileObj?.username}</h1>
                    <p className="text-sm text-muted-foreground font-mono">{ formatAddress(userProfileObj?.wallet_address) }</p>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary font-bold">Expert Predictor</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Decentralized oracle and high-stakes predictor. Specializing in Crypto markets and long-term tech trends.
                </p>

                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2">
                    <Share2 className="w-4 h-4" /> Share Profile
                  </Button>
                  <Button variant="outline" className="w-full border-white/10 gap-2">
                    <Mail className="w-4 h-4" /> Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-black italic uppercase">{MOCK_USER.balance} GEN</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary text-xs font-bold">Withdraw</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right Column: Stats & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Predictions Made', value: userProfileObj?.total_bets , icon: Target, color: 'text-blue-500' },
                { label: 'Total Won', value: userProfileObj?.total_won , icon: Trophy, color: 'text-yellow-500' },
                { label: 'Accuracy', value: user_accuracy , icon: TrendingUp, color: 'text-success' },
              ].map((stat, i) => (
                <Card key={i} className="glass-card border-white/5">
                  <CardContent className="p-6">
                    <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{stat.value}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Verification Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold italic uppercase">Verified by GenLayer</h4>
                  <p className="text-xs text-muted-foreground">
                    This profile's win rate and volume are cryptographically verified by GenLayer validators on the Arc network.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Recent Activity</h2>
              <div className="space-y-3">
                {MOCK_ACTIVITIES.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-xl glass-card flex items-center justify-between border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        activity.status === 'WIN' ? "bg-success" : activity.status === 'LOSS' ? "bg-destructive" : "bg-info"
                      )}></div>
                      <p className="text-sm font-medium">{activity.message}</p>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}