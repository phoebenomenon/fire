"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-6">
        <Flame className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Welcome to FIRE
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Get a clear picture of your household finances and see when you can
        reach financial independence. It takes about 5 minutes to set up.
      </p>
      <Button asChild size="lg">
        <Link href="/onboarding">Get Started</Link>
      </Button>
    </div>
  );
}
