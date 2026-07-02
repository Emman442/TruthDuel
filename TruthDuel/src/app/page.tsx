"use client"

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Users,
  TrendingUp,
  Cpu,
  Globe,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MOCK_ACTIVITIES, MOCK_BETS } from '@/lib/mock-data';
import BetCard from '@/components/shared/BetCard';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useFetchMutualBet, useFetchMutualBets } from '@/lib/hooks/useTruthDuel';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const aiImg = PlaceHolderImages.find(img => img.id === 'ai-visual');
  const {isPending: isLoadingBets,data: bets} = useFetchMutualBets()
  const mutualBets = Array.from(bets?.values() || []).map(
  (bet) => ({
    ...bet,                       // ← just spread the object
    betType: "MUTUAL" as const,
  })
);


   const normalizedBets = [
    ...mutualBets.map(bet => {
      console.log("mutual", bet.creator_stake, bet.challenger_stake);

      return {
        ...bet,
        mode: "MUTUAL" as const,
        totalPool:
          Number(bet.creator_stake ?? 0) +
          Number(bet.challenger_stake ?? 0),
      };
    }),
  ]

  const stats = [
    { label: 'Total Bets Settled', value: '12,402', icon: CheckCircle2 },
    { label: 'Total Volume', value: '$4.2M', icon: TrendingUp },
    { label: 'Active Oracles', value: '1,894', icon: Cpu },
  ];

  const steps = [
    {
      title: 'State Your Prediction',
      desc: 'Type any future event in plain English. No complex forms or parameters required.',
      icon: MessageSquare,
      color: 'bg-primary/20 text-primary'
    },
    {
      title: 'Stake & Lock',
      desc: 'Your GEN tokens is held in a trustless smart contract on the Genlayer network until expiration.',
      icon: Lock,
      color: 'bg-blue-500/20 text-blue-500'
    },
    {
      title: 'AI Settles the Winner',
      desc: 'GenLayer validators scan the web for the outcome and trigger instant payouts.',
      icon: Zap,
      color: 'bg-success/20 text-success'
    }
  ];

  const valueProps = [
    {
      title: 'Zero Human Bias',
      desc: 'Settlement is performed by decentralized AI validators, eliminating corruption.',
      icon: ShieldCheck
    },
    {
      title: 'Global Event Access',
      desc: 'If it happened on the internet, you can bet on it. From niche sports to politics.',
      icon: Globe
    },
    {
      title: 'Instant Liquidity',
      desc: 'Winnings are disbursed the second the AI confirms the verdict.',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden border-b border-white/5">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
              <Zap className="w-3 h-3" />
              Next-Gen Prediction Layer
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] italic uppercase">
              Predict the <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">World.</span><br />
              <span className="text-primary">AI</span> Handles the rest.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              The first decentralized betting platform where you set the terms in plain English and 
              GenLayer AI verifies the outcome using real-time web data.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/create">
                <Button size="lg" className="h-16 px-10 text-xl bg-primary hover:bg-primary/90 text-white neon-border group font-black italic uppercase tracking-tighter">
                  Start Predicting
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl border-white/10 hover:bg-white/5 font-black italic uppercase tracking-tighter">
                  Browse Markets
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Activity Marquee */}
        <div className="py-4 bg-primary text-white overflow-hidden whitespace-nowrap border-y border-white/10 relative z-20">
          <div className="flex animate-[marquee_40s_linear_infinite] gap-12 items-center">
            {[...MOCK_ACTIVITIES, ...MOCK_ACTIVITIES].map((a, i) => (
              <div key={i} className="flex items-center gap-3 font-black text-sm uppercase italic">
                {a.status === 'WIN' && <CheckCircle2 className="w-4 h-4 text-green-300" />}
                {a.status === 'LOSS' && <XCircle className="w-4 h-4 text-red-300" />}
                {a.status === 'PENDING' && <Clock className="w-4 h-4 text-blue-200" />}
                {a.message}
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">How it Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From a thought to a payout in three simple steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center space-y-6">
                  <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center border border-white/5", step.color)}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black italic uppercase tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Settlement Section */}
        <section className="py-32 relative overflow-hidden bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video glass-card">
                  {aiImg && (
                    <Image 
                      src={aiImg.imageUrl} 
                      alt={aiImg.description} 
                      fill 
                      className="object-cover opacity-60"
                      data-ai-hint={aiImg.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Validator Active</span>
                    </div>
                    <p className="text-xs font-bold italic uppercase tracking-tight leading-snug">
                      "Scanning web sources to verify prediction..."
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="border-primary/30 text-primary uppercase font-black">The Oracle Engine</Badge>
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">
                    Impartial Settlement.<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">No Exceptions.</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    TruthDuel uses the GenLayer Intelligent Oracle—a decentralized network of AI agents that browse the real-time 
                    web to provide objective verdicts.
                  </p>
                </div>

                <div className="space-y-6">
                  {valueProps.map((prop, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                      <div className="mt-1 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <prop.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black italic uppercase tracking-tight mb-1">{prop.title}</h4>
                        <p className="text-sm text-muted-foreground">{prop.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Markets */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Live Markets</h2>
                <p className="text-muted-foreground text-lg">Predict on global events happening right now.</p>
              </div>
              <Link href="/explore">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-xs h-12 px-6">
                  View All Markets <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {normalizedBets?.slice(0, 3).map((bet) => (
                <BetCard key={bet.bet_id} bet={bet} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">© 2026 TruthDuel AI. Fully Decentralized.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
