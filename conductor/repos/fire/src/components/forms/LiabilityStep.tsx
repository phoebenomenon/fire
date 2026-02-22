"use client";

import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { LIABILITY_TYPE_LABELS, LIABILITY_TYPES } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import type { FinancialProfile, Liability, LiabilityType } from "@/types/finance";

interface LiabilityStepProps {
  draft: FinancialProfile;
  updateDraft: (updates: Partial<FinancialProfile>) => void;
}

export function LiabilityStep({ draft, updateDraft }: LiabilityStepProps) {
  const { liabilities, household } = draft;
  const memberNames = household.members.map((m) => m.name).filter(Boolean);
  const ownerOptions = memberNames.length > 1 ? [...memberNames, "joint"] : memberNames.length === 1 ? [memberNames[0]] : ["Me"];

  const addLiability = () => {
    const newLiability: Liability = {
      id: uuid(),
      label: "",
      type: "mortgage",
      balance: 0,
      interestRate: 0,
      owner: ownerOptions[0],
    };
    updateDraft({ liabilities: [...liabilities, newLiability] });
  };

  const updateLiability = (id: string, updates: Partial<Liability>) => {
    updateDraft({
      liabilities: liabilities.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const removeLiability = (id: string) => {
    updateDraft({ liabilities: liabilities.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Debts</h2>
        <p className="text-sm text-muted-foreground">
          Add any outstanding debts. It&apos;s okay to skip this if you&apos;re debt-free.
        </p>
      </div>

      {liabilities.map((liability) => (
        <div
          key={liability.id}
          className="space-y-4 rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Debt</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLiability(liability.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder='e.g., "Mortgage", "Car loan"'
                value={liability.label}
                onChange={(e) => updateLiability(liability.id, { label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={liability.type}
                onChange={(e) => updateLiability(liability.id, { type: e.target.value as LiabilityType })}
              >
                {LIABILITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {LIABILITY_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Outstanding Balance</Label>
              <CurrencyInput
                value={liability.balance}
                onChange={(v) => updateLiability(liability.id, { balance: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                placeholder="5.5"
                value={liability.interestRate > 0 ? (liability.interestRate * 100).toFixed(1) : ""}
                onChange={(e) =>
                  updateLiability(liability.id, {
                    interestRate: (parseFloat(e.target.value) || 0) / 100,
                  })
                }
              />
            </div>
            {ownerOptions.length > 1 && (
              <div className="space-y-2">
                <Label>Owner</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={liability.owner}
                  onChange={(e) => updateLiability(liability.id, { owner: e.target.value })}
                >
                  {ownerOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addLiability} className="w-full">
        <Plus className="h-4 w-4 mr-1" />
        Add Debt
      </Button>

      {liabilities.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No debts — great! You can skip this step.
        </p>
      )}
    </div>
  );
}
