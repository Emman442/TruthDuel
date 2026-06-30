"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wallet,
  Trophy,
  Compass,
  PlusCircle,
  LayoutDashboard,
  Zap,           // Changed from Lightbulb
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import LoginButton from './loginButton';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Modal from '../ui/modal';
import { HashLoader } from 'react-spinners';
import { useCheckIfProfileExists } from '@/lib/hooks/useTruthDuel';
import { toast } from 'sonner';
import ProfileSetupModal from '../ui/ProfileSetupModal';
import HowItWorksModal from '../ui/HowItWorks';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const router = useRouter()
  const { wallets } = useWallets();
  const { logout } = usePrivy();
  const [hasChecked, setHasChecked] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const embeddedWallet = wallets[0];
  const address = embeddedWallet?.address;

  const { isLoading, data: profileExists } = useCheckIfProfileExists(address);

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Compass },
    // { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    // { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'How it Works', href: '#', icon: Zap, onClick: () => setHowItWorksOpen(true) },
  ];

  const NavItems = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <div className={cn("flex items-center gap-1", className)}>
      {navLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          className={cn(
            "gap-2 w-full justify-start md:w-auto",
            pathname === link.href && "bg-primary/10 text-primary"
          )}
          onClick={() => {
            if (link.onClick) {
              link.onClick();
            } else {
              router.push(link.href);
            }

            onClick?.();
          }}
        >
          <link.icon className="w-4 h-4" />
          {link.name}
        </Button>
      ))}
    </div>
  );

  // Profile check logic
  useEffect(() => {
    if (!address) {
      setHasChecked(false);
      setShowSetupModal(false);
      return;
    }

    if (isLoading || hasChecked) return;

    setHasChecked(true);

    if (!profileExists) {
      setShowSetupModal(true);
    } else {
      toast.success("Welcome back!", {
        description: `${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }
  }, [address, isLoading, profileExists, hasChecked]);

  return (
    <>
      {/* Loading Modal */}
      <Modal
        isOpen={!!address && isLoading}
        onClose={() => { }}
        showCloseButton={false}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <HashLoader size={40} color="#3C83F6" />
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-white">Checking your profile</p>
            <p className="text-xs text-muted-foreground">Connecting to GenLayer...</p>
          </div>
        </div>
      </Modal>

      {/* How it Works Modal */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />

      {/* Profile Setup Modal */}
      {isLoading === false && (
        <ProfileSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          address={address || ""}
          onProfileCreated={() => {
            toast.success("Profile created!", {
              description: "Welcome to TruthDuel!",
            });
            setShowSetupModal(false);
          }}
        />
      )}

      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">
                    Truth<span className="text-primary">Duel</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <NavItems onClick={() => setIsOpen(false)} className="flex-col" />

                  <Link href="/create" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <PlusCircle className="w-5 h-5" />
                      Create Bet
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                Truth<span className="text-primary">Duel</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavItems />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {address ? (
              <>
                <Link href="/create" className="hidden sm:block">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <PlusCircle className="w-4 h-4" />
                    Create Bet
                  </Button>
                </Link>

                <Button variant="outline" className="hidden lg:flex gap-2">
                  <Wallet className="w-4 h-4" />
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </nav>
    </>
  );
}