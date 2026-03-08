"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, X } from "lucide-react";

export function DemoBanner() {
  const { isDemoMode, exitDemoMode } = useFinancialProfile();

  if (!isDemoMode) return null;

  return (
    <div className="rounded-lg border border-amber-300/50 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/50 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <Eye className="h-4 w-4 text-amber-600 flex-shrink-0" />
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 text-xs font-medium">
            DEMO
          </Badge>
          <span className="text-sm text-amber-800 dark:text-amber-300">
            Sample data for a Bay Area tech couple with 1 kid — your real data won&apos;t be affected
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={exitDemoMode}
        className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-200 flex-shrink-0"
      >
        <X className="h-4 w-4 mr-1" />
        Exit Demo
      </Button>
    </div>
  );
}
