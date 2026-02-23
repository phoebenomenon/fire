"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { buildQuickStartProfile } from "@/lib/defaults";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";

interface QuickStartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickStartDialog({ open, onOpenChange }: QuickStartDialogProps) {
  const { saveProfile } = useFinancialProfile();
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [savings, setSavings] = useState(0);

  const canSubmit = income > 0 && expenses > 0;

  const handleSubmit = () => {
    const profile = buildQuickStartProfile(income, expenses, savings);
    saveProfile(profile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Start — 3 Numbers</DialogTitle>
          <DialogDescription>
            Enter your household totals for an instant FIRE estimate. You can add details later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="qs-income">Annual household income (pre-tax)</Label>
            <CurrencyInput
              id="qs-income"
              value={income}
              onChange={setIncome}
              placeholder="150,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qs-expenses">Annual expenses</Label>
            <CurrencyInput
              id="qs-expenses"
              value={expenses}
              onChange={setExpenses}
              placeholder="70,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qs-savings">Total savings & investments</Label>
            <CurrencyInput
              id="qs-savings"
              value={savings}
              onChange={setSavings}
              placeholder="100,000"
            />
            <p className="text-xs text-muted-foreground">
              Everything you have saved — 401(k), IRA, brokerage, savings accounts.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            Show My Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
