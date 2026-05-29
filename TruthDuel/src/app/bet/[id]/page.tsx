import { MOCK_BETS } from '@/lib/mock-data';
import BetDetailClient from './bet-detail-client';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // const bet = MOCK_BETS.find(b => b.id === id);

  // if (!bet) {
  //   return {
  //     title: 'Bet Not Found | TruthDuel',
  //   };
  // }

  return {
  //   title: `${bet.description} | TruthDuel`,
  //   description: `Join this ${bet.mode} prediction on TruthDuel. Current pool: ${bet.totalPool} USDC. Settled by GenLayer AI validators.`,
  //   openGraph: {
  //     title: bet.description,
  //     description: `Predict the outcome and win from a ${bet.totalPool} USDC pool. AI-verified settlement.`,
  //     url: `https://TruthDuel.ai/bet/${id}`,
  //     siteName: 'TruthDuel AI',
  //     images: [
  //       {
  //         url: `https://picsum.photos/seed/${id}/1200/630`,
  //         width: 1200,
  //         height: 630,
  //         alt: bet.description,
  //       },
  //     ],
  //     locale: 'en_US',
  //     type: 'website',
  //   },
  //   twitter: {
  //     card: 'summary_large_image',
  //     title: bet.description,
  //     description: `Predict the outcome and win USDC. AI-verified settlement.`,
  //     images: [`https://picsum.photos/seed/${id}/1200/630`],
  //   },
  };
}

export default async function BetPage({ params }: Props) {
  const { id } = await params;
  return <BetDetailClient id={id} />;
}
