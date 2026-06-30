"use client"

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import BetCard from '@/components/shared/BetCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, Layers } from 'lucide-react';
// import { BetCategory } from '@/lib/types';
import { useFetchConsensusBets, useFetchMutualBets } from '@/lib/hooks/useTruthDuel';


export type BetCategory = 'Crypto' | 'Sports' | 'Politics' | 'Entertainment' | 'Community' | 'Personal' | 'Other';

export default function ExplorePage() {
  const [selectedCategories, setSelectedCategories] = useState<BetCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: BetCategory[] = ['Crypto', 'Sports', 'Politics', 'Entertainment', 'Community', 'Personal', 'Other'];

  const toggleCategory = (cat: BetCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const { isLoading: isLoadingMutualBets, data: mutualBetsData } = useFetchMutualBets();
  const { isLoading: isLoadingConsensusBets, data: consensusBetsData } = useFetchConsensusBets(); // Replace with actual consensus bets query when available



  console.log("Mutual Bets:", mutualBetsData);
  console.log("Consensus Bets:", consensusBetsData);


  const mutualBets = Array.from(mutualBetsData?.values() || []).map(
  (bet) => ({
    ...bet,                       // ← just spread the object
    betType: "MUTUAL" as const,
  })
);

  const consensusBets = Array.from(consensusBetsData?.values() || []).map(
    (bet) => ({
      ...bet,
      betType: "CONSENSUS" as const,
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

    ...consensusBets.map(bet => {
      console.log("consensus", bet.for_pool, bet.against_pool);

      return {
        ...bet,
        mode: "CONSENSUS" as const,
        totalPool:
          Number(bet.for_pool ?? 0) +
          Number(bet.against_pool ?? 0),
      };
    }),
  ];


  const filteredBets = normalizedBets.filter(bet => {
    const matchesSearch = bet.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(
        bet.category as BetCategory
      );
    return matchesSearch && matchesCategory;
  });




  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-black italic text-primary uppercase tracking-tighter self-start">
              Explore Bets
            </h1>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search predictions..."
                className="pl-10 bg-white/5 border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategories.length === 0 ? "default" : "outline"}
                size="sm"
                className="rounded-full h-8 text-xs font-bold"
                onClick={() => setSelectedCategories([])}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategories.includes(cat) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full h-8 text-xs font-bold"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-4">
                <Select defaultValue="latest">
                  <SelectTrigger className="w-[160px] h-8 text-xs bg-transparent border-white/10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="ending">Ending Soon</SelectItem>
                    <SelectItem value="stakes">Highest Stakes</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground font-bold">
                {filteredBets.length} Results
              </div>
            </div>
          </div>

          {/* Bet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
            {filteredBets.length > 0 ? (
              filteredBets.map(bet => (
                <BetCard key={bet.bet_id} bet={bet} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Layers className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No bets found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategories([]); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}