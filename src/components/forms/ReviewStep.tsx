"use client";

import { computeSnapshot } from "@/lib/calculations";
import { formatCurrency, formatPercent, formatYears } from "@/lib/format";
import { INCOME_SOURCE_LABELS } from "@/lib/constants";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { ASSET_TYPE_LABELS } from "@/lib/constants";
import { LIABILITY_TYPE_LABELS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import type { FinancialProfile } from "@/types/finance";

interface ReviewStepProps {
  draft: FinancialProfile;
}

export function ReviewStep({ draft }: ReviewStepProps) {
  const snapshot = computeSnapshot(draft);
  const { household, incomes, expenses, assets, liabilities, assumptions } = draft;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Review</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s a summary of what you entered. You can go back to any step to make changes.
        </p>
      </div>

      {/* Household */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Household
        </h3>
        {household.members.map((m, i) => (
          <p key={i} className="text-sm">
            {m.name || `Person ${i + 1}`}: Age {m.currentAge}, retire at {m.targetRetirementAge}
          </p>
        ))}
      </div>

      <Separator />

      {/* Income */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Income ({incomes.length})
        </h3>
        {incomes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No income added</p>
        ) : (
          incomes.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span>
                {i.label || INCOME_SOURCE_LABELS[i.source]} ({i.frequency})
              </span>
              <span className="font-medium">{formatCurrency(i.amount)}</span>
            </div>
          ))
        )}
      </div>

      <Separator />

      {/* Expenses */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Expenses ({expenses.length})
        </h3>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses added</p>
        ) : (
          expenses.map((e) => (
            <div key={e.id} className="flex justify-between text-sm">
              <span>
                {e.label || EXPENSE_CATEGORY_LABELS[e.category]} ({e.frequency})
              </span>
              <span className="font-medium">{formatCurrency(e.amount)}</span>
            </div>
          ))
        )}
      </div>

      <Separator />

      {/* Assets */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Assets ({assets.length})
        </h3>
        {assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assets added</p>
        ) : (
          assets.map((a) => (
            <div key={a.id} className="flex justify-between text-sm">
              <span>
                {a.label || ASSET_TYPE_LABELS[a.type]}
                {a.isInvestable && (
                  <span className="text-xs text-primary ml-1">(investable)</span>
                )}
              </span>
              <span className="font-medium">{formatCurrency(a.balance)}</span>
            </div>
          ))
        )}
      </div>

      <Separator />

      {/* Liabilities */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Debts ({liabilities.length})
        </h3>
        {liabilities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No debts</p>
        ) : (
          liabilities.map((l) => (
            <div key={l.id} className="flex justify-between text-sm">
              <span>
                {l.label || LIABILITY_TYPE_LABELS[l.type]} ({formatPercent(l.interestRate)} APR)
              </span>
              <span className="font-medium">{formatCurrency(l.balance)}</span>
            </div>
          ))
        )}
      </div>

      <Separator />

      {/* Quick snapshot */}
      <div className="rounded-lg bg-muted p-4 space-y-2">
        <h3 className="font-medium text-sm">Quick Snapshot</h3>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <span className="text-muted-foreground">Net Worth</span>
          <span className="font-medium text-right">{formatCurrency(snapshot.netWorth)}</span>
          <span className="text-muted-foreground">Annual Income (gross)</span>
          <span className="font-medium text-right">{formatCurrency(snapshot.totalAnnualIncome)}</span>
          <span className="text-muted-foreground">Annual Expenses</span>
          <span className="font-medium text-right">{formatCurrency(snapshot.totalAnnualExpenses)}</span>
          <span className="text-muted-foreground">Savings Rate</span>
          <span className="font-medium text-right">{formatPercent(snapshot.savingsRate)}</span>
          <span className="text-muted-foreground">FIRE Number</span>
          <span className="font-medium text-right">{formatCurrency(snapshot.fireNumber)}</span>
          <span className="text-muted-foreground">Years to FIRE</span>
          <span className="font-medium text-right">
            {isFinite(snapshot.yearsToFire) ? formatYears(snapshot.yearsToFire) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
