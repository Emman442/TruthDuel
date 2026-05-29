# **App Name**: TruthDuel

## Core Features:

- Wallet Integration & Authentication: Securely connect users' Web3 wallets (via RainbowKit) to the Arc testnet for seamless authentication and transaction signing, with Firebase Auth.
- Decentralized Bet Creation: Enable users to define 'Mutual' (1v1) or 'Consensus' (public) prediction bets in plain English, setting stakes, categories, and expiry, with USDC escrow on Arc testnet.
- Bet Discovery & Filtering: Provide an 'Explore' page where users can browse, search, and filter active bets by category, mode, and various sorting options, fetching data from Firestore.
- Bet Participation: Allow users to accept a mutual bet challenge or join a public consensus bet (FOR/AGAINST) by locking their USDC stake on the Arc testnet.
- AI-Powered Settlement & Payouts: Integrate with GenLayer Intelligent Contracts to use an AI verdict tool for automatically settling bets based on web data, displaying AI reasoning, and triggering USDC payouts to winners on Arc testnet.
- User Dashboard & Stats: A personalized dashboard for logged-in users to track their active bets, created bets, winnings, win rate, and comprehensive betting history, sourced from Firestore.
- Real-time Notifications: Deliver instant alerts for critical events such as bet challenges, acceptances, settlement outcomes, and appeal statuses, using Firestore's real-time updates.

## Style Guidelines:

- Primary color: Vibrant electric purple (#7c3aed) for key interactive elements, highlighting the app's high-energy and modern appeal.
- Background color: An ultra-dark, almost black, charcoal-blue (#080810) forms the base, creating a sleek and premium crypto terminal aesthetic.
- Semantic status colors: Neon green (#22c55e) to signify wins, bold red (#ef4444) for losses, and clear blue (#3b82f6) for neutral or active states, ensuring clear visual feedback.
- Font: 'Inter' (sans-serif) for all text, ensuring a modern, clean, and data-dense yet breathable feel, with emphasis on bold styling for numerical data.
- Modern, sharp, and minimalist icons are to be used throughout, alongside custom color-coded badges for categories and modes, and distinct user avatars.
- A mobile-first, responsive design approach with clean card-based layouts. Bet grids are 2-column on desktop and 1-column on mobile. Includes full-screen heroes, a global stats bar, and dynamic elements like a leaderboard podium animation.
- Smooth animations will be implemented throughout using Framer Motion, including a pulsing red expiry countdown for bets nearing settlement, loading skeletons for data fetches, an animated loading indicator for AI settlement, and a top 3 leaderboard podium animation.