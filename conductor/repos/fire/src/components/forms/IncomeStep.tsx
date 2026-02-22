"use client";

import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { INCOME_SOURCE_LABELS, INCOME_SOURCES } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import type { FinancialProfile, Income, IncomeFrequency, IncomeSource } from "@/types/finance";

interface IncomeStepProps {
  draft: FinancialProfile;
  updateDraft: (updates: Partial<FinancialProfile>) => void;
}

export function IncomeStep({ draft, updateDraft }: IncomeStepProps) {
  const { incomes, household } = draft;
  const memberNames = household.members.map((m) => m.name).filter(Boolean);
  const ownerOptions = memberNames.length > 1 ? [...memberNames, "joint"] : memberNames.length === 1 ? [memberNames[0]] : ["Me"];

  const addIncome = () => {
    const newIncome: Income = {
      id: uuid(),
      label: "",
      amount: 0,
      frequency: "monthly",
      source: "salary",
      owner: ownerOptions[0],
      isActive: true,
    };
    updateDraft({ incomes: [...incomes, newIncome] });
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    updateDraft({
      incomes: incomes.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    });
  };

  const removeIncome = (id: string) => {
    updateDraft({ incomes: incomes.filter((i) => i.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Income</h2>
        <p className="text-sm text-muted-foreground">
          Add all sources of income for your household. We&apos;ll use pre-tax amounts.
        </p>
      </div>

      {incomes.map((income) => (
        <div
          key={income.id}
          className="space-y-4 rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Income Source</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeIncome(income.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder='e.g., "Main salary"'
                value={income.label}
                onChange={(e) => updateIncome(income.id, { label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={income.source}
                onChange={(e) => updateIncome(income.id, { source: e.target.value as IncomeSource })}
              >
                {INCOME_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {INCOME_SOURCE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Amount (pre-tax)</Label>
              <CurrencyInput
                value={income.amount}
                onChange={(v) => updateIncome(income.id, { amount: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={income.frequency}
                onChange={(e) => updateIncome(income.id, { frequency: e.target.value as IncomeFrequency })}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
            {ownerOptions.length > 1 && (
              <div className="space-y-2">
                <Label>Owner</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={income.owner}
                  onChange={(e) => updateIncome(income.id, { owner: e.target.value })}
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

      <Button variant="outline" onClick={addIncome} className="w-full">
        <Plus className="h-4 w-4 mr-1" />
        Add Income Source
      </Button>

      {incomes.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No income sources yet. Click above to add one.
        </p>
      )}
    </div>
  );
}
