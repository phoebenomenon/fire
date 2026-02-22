"use client";

import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORIES } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import type { FinancialProfile, Expense, ExpenseCategory, IncomeFrequency } from "@/types/finance";

interface ExpenseStepProps {
  draft: FinancialProfile;
  updateDraft: (updates: Partial<FinancialProfile>) => void;
}

export function ExpenseStep({ draft, updateDraft }: ExpenseStepProps) {
  const { expenses } = draft;

  const addExpense = () => {
    const newExpense: Expense = {
      id: uuid(),
      label: "",
      amount: 0,
      frequency: "monthly",
      category: "other",
      isEssential: true,
      isActive: true,
    };
    updateDraft({ expenses: [...expenses, newExpense] });
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    updateDraft({
      expenses: expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const removeExpense = (id: string) => {
    updateDraft({ expenses: expenses.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Expenses</h2>
        <p className="text-sm text-muted-foreground">
          Add your regular household expenses. You can enter monthly or annual amounts.
        </p>
      </div>

      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="space-y-4 rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Expense</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExpense(expense.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder='e.g., "Rent", "Groceries"'
                value={expense.label}
                onChange={(e) => updateExpense(expense.id, { label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={expense.category}
                onChange={(e) => updateExpense(expense.id, { category: e.target.value as ExpenseCategory })}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {EXPENSE_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <CurrencyInput
                value={expense.amount}
                onChange={(v) => updateExpense(expense.id, { amount: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={expense.frequency}
                onChange={(e) => updateExpense(expense.id, { frequency: e.target.value as IncomeFrequency })}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addExpense} className="w-full">
        <Plus className="h-4 w-4 mr-1" />
        Add Expense
      </Button>

      {expenses.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No expenses yet. Click above to add one.
        </p>
      )}
    </div>
  );
}
