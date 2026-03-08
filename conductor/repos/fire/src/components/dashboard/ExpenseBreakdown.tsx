"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { annualize } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import type { Expense } from "@/types/finance";

const CHART_COLORS = [
  "oklch(0.55 0.15 175)",
  "oklch(0.78 0.15 75)",
  "oklch(0.65 0.17 155)",
  "oklch(0.70 0.12 200)",
  "oklch(0.60 0.20 25)",
  "oklch(0.55 0.12 280)",
  "oklch(0.72 0.14 140)",
  "oklch(0.65 0.10 50)",
  "oklch(0.50 0.14 240)",
  "oklch(0.75 0.10 100)",
];

interface ExpenseBreakdownProps {
  expenses: Expense[];
}

export function ExpenseBreakdown({ expenses }: ExpenseBreakdownProps) {
  const activeExpenses = expenses.filter((e) => e.isActive);

  const byCategory = activeExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      const annual = annualize(expense.amount, expense.frequency);
      acc[expense.category] = (acc[expense.category] || 0) + annual;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(byCategory)
    .map(([category, value]) => ({
      name: EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS] || category,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const totalAnnual = chartData.reduce((sum, d) => sum + d.value, 0);

  if (chartData.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Annual Expenses by Category
          </CardTitle>
          <div className="text-right">
            <span className="text-lg font-semibold">{formatCurrency(totalAnnual)}</span>
            <span className="text-xs text-muted-foreground ml-1">/yr</span>
            <span className="text-xs text-muted-foreground block">
              {formatCurrency(Math.round(totalAnnual / 12))}/mo
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-52 w-52 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {chartData.map((item, i) => {
              const pct = totalAnnual > 0 ? Math.round((item.value / totalAnnual) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60">{pct}%</span>
                    <span className="font-medium">{formatCurrency(item.value)}/yr</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
