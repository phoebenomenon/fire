"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialProfile, Assumptions } from "@/types/finance";

interface AssumptionsStepProps {
  draft: FinancialProfile;
  updateDraft: (updates: Partial<FinancialProfile>) => void;
}

export function AssumptionsStep({ draft, updateDraft }: AssumptionsStepProps) {
  const { assumptions } = draft;

  const update = (key: keyof Assumptions, displayValue: string) => {
    const num = parseFloat(displayValue) || 0;
    updateDraft({ assumptions: { ...assumptions, [key]: num / 100 } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Assumptions</h2>
        <p className="text-sm text-muted-foreground">
          These defaults work well for most people. Adjust if you have specific views on market returns or your spending plans in retirement.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="returnRate">Expected Annual Return (%)</Label>
          <Input
            id="returnRate"
            type="number"
            min={0}
            max={30}
            step={0.5}
            value={(assumptions.annualReturnRate * 100).toFixed(1)}
            onChange={(e) => update("annualReturnRate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Historical S&P 500 average: ~10%. After inflation: ~7%.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
          <Input
            id="inflationRate"
            type="number"
            min={0}
            max={20}
            step={0.5}
            value={(assumptions.inflationRate * 100).toFixed(1)}
            onChange={(e) => update("inflationRate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Historical average: ~3%.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="swr">Safe Withdrawal Rate (%)</Label>
          <Input
            id="swr"
            type="number"
            min={1}
            max={10}
            step={0.5}
            value={(assumptions.safeWithdrawalRate * 100).toFixed(1)}
            onChange={(e) => update("safeWithdrawalRate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            4% is the classic &ldquo;rule of 25&rdquo; — you need 25x your annual expenses.
            3% is more conservative.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRate">Effective Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            min={0}
            max={60}
            step={1}
            value={(assumptions.taxRate * 100).toFixed(0)}
            onChange={(e) => update("taxRate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your combined federal + state effective tax rate. 25% is a reasonable default.
          </p>
        </div>
      </div>
    </div>
  );
}
