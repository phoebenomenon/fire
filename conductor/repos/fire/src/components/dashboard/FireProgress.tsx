"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, formatCurrency } from "@/lib/format";
import { Info } from "lucide-react";

interface FireProgressProps {
  investableAssets: number;
  fireNumber: number;
  progress: number;
  netWorth: number;
}

export function FireProgress({ investableAssets, fireNumber, progress, netWorth }: FireProgressProps) {
  const pct = Math.min(progress * 100, 100);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-base font-medium">FIRE Progress</CardTitle>
          <div className="relative">
            <button
              type="button"
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-md bg-foreground text-background text-xs p-2.5 leading-relaxed shadow-lg">
                This tracks your investable assets (retirement accounts, brokerage) — the money that&apos;s growing toward your FIRE number. Your net worth ({formatCurrency(netWorth)}) also includes your home, cash, and debts.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs text-muted-foreground/70 block">Investable Assets</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(investableAssets)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground/70 block">FIRE Number</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(fireNumber)}
            </span>
          </div>
        </div>
        <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-out"
            style={{ width: `${Math.max(pct, 1)}%` }}
          />
          {/* Milestone markers */}
          {[25, 50, 75].map((m) => (
            <div
              key={m}
              className="absolute top-0 h-full w-px bg-foreground/10"
              style={{ left: `${m}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">0%</span>
          <p className="text-sm font-medium text-primary">
            {formatPercent(progress)} of your FIRE number
          </p>
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </CardContent>
    </Card>
  );
}
