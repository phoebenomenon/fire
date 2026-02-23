"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Zap, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { QuickStartDialog } from "@/components/shared/QuickStartDialog";

export function EmptyState() {
  const { enterDemoMode } = useFinancialProfile();
  const [quickStartOpen, setQuickStartOpen] = useState(false);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-primary/10 p-4 mb-6">
        <Flame className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Welcome to FIRE
      </h1>
      <p className="text-muted-foreground max-w-md mb-10">
        See when you can reach financial independence. Start with just 3 numbers,
        explore a demo, or do the full setup.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {/* Primary: Quick Start */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => setQuickStartOpen(true)}
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Start — Just 3 Numbers
        </Button>

        {/* Secondary: Demo */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={enterDemoMode}
        >
          <Eye className="h-4 w-4 mr-2" />
          Try Demo Mode
        </Button>

        {/* Tertiary: Full setup */}
        <Button variant="ghost" size="lg" className="w-full text-muted-foreground" asChild>
          <Link href="/onboarding">
            Full Setup (5 min)
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      <QuickStartDialog open={quickStartOpen} onOpenChange={setQuickStartOpen} />
    </div>
  );
}
