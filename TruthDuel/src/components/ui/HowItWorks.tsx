"use client";

import {
  X,
  PlusCircle,
  Swords,
  Clock3,
  Trophy,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 p-4">
          <div>
            <Badge
              variant="secondary"
              className="mb-2 border-0 bg-white/10 text-white"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              HOW IT WORKS
            </Badge>

            <h2 className="text-3xl font-black tracking-tight">
              Win by Being Right
            </h2>

            <p className="mt-2 text-sm text-zinc-400 max-w-md">
              Create or join a duel, stake your position, and earn rewards if
              you're right.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Steps */}
        <div className="p-4 space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05] hover:border-white/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <Button
            onClick={onClose}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            Start Dueling
          </Button>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    icon: PlusCircle,
    title: "Create or Join",
    desc: "Start a new duel or join an existing one.",
  },
  {
    icon: Swords,
    title: "Stake Your Position",
    desc: "Choose For or Against and lock your stake.",
  },
  {
    icon: Clock3,
    title: "Wait for Resolution",
    desc: "The outcome is verified when the event ends.",
  },
  {
    icon: Trophy,
    title: "Automatic Rewards",
    desc: "Winning players automatically receive the prize pool.",
  },
];