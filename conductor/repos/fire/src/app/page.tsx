"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useFinancialSnapshot } from "@/hooks/useFinancialSnapshot";
import { useProjection } from "@/hooks/useProjection";
import { EmptyState } from "@/components/shared/EmptyState";
import { DemoBanner } from "@/components/shared/DemoBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FireProgress } from "@/components/dashboard/FireProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { formatCurrency, formatPercent, formatYears, formatDate } from "@/lib/format";

const ProjectionChart = dynamic(
  () => import("@/components/dashboard/ProjectionChart").then((m) => ({ default: m.ProjectionChart })),
  { ssr: false }
);

const ExpenseBreakdown = dynamic(
  () => import("@/components/dashboard/ExpenseBreakdown").then((m) => ({ default: m.ExpenseBreakdown })),
  { ssr: false }
);

export default function DashboardPage() {
  const { profile, isLoading, hasData, isDemoMode } = useFinancialProfile();
  const snapshot = useFinancialSnapshot(profile);
  const projection = useProjection(profile);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasData || !snapshot || !profile) {
    return <EmptyState />;
  }

  const youngestMember = profile.household.members.reduce((y, m) =>
    m.currentAge < y.currentAge ? m : y
  );

  const memberNames = profile.household.members.map((m) => m.name).filter(Boolean);
  const householdLabel = profile.household.householdName || memberNames.join(" & ") || "Your household";

  // Build motivating headline + detail
  let heroHeadline = "";
  let heroDetail = "";

  if (profile.household.members.length === 2) {
    const m1 = profile.household.members[0];
    const m2 = profile.household.members[1];
    const age1 = m1.currentAge + Math.round(snapshot.yearsToFire);
    const age2 = m2.currentAge + Math.round(snapshot.yearsToFire);
    if (isFinite(snapshot.yearsToFire)) {
      heroHeadline = `🔥 ${householdLabel} could be financially free by ${formatDate(snapshot.projectedFireDate)}.`;
      heroDetail = `You're saving ${formatPercent(snapshot.savingsRate)} of your after-tax income — that puts ${m1.name || "Person 1"} at ${age1} and ${m2.name || "Person 2"} at ${age2} when you hit your number. Keep it up.`;
    } else {
      heroHeadline = `🧭 ${householdLabel} — let's build your path to freedom.`;
      heroDetail = `You're saving ${formatPercent(snapshot.savingsRate)} of after-tax income. Add more data to see your projected FIRE date.`;
    }
  } else {
    if (isFinite(snapshot.yearsToFire)) {
      heroHeadline = `🔥 ${householdLabel} could be financially free by age ${snapshot.projectedFireAge}.`;
      heroDetail = `You're saving ${formatPercent(snapshot.savingsRate)} of your after-tax income — at this rate, you'll reach independence by ${formatDate(snapshot.projectedFireDate)}. You're on track.`;
    } else {
      heroHeadline = `🧭 ${householdLabel} — let's build your path to freedom.`;
      heroDetail = `You're saving ${formatPercent(snapshot.savingsRate)} of after-tax income. Add more data to see your projected FIRE date.`;
    }
  }

  // Quick-start profiles have exactly 1 income + 1 expense + 1 asset + 0 liabilities
  const isMinimalProfile =
    !isDemoMode &&
    profile.incomes.length === 1 &&
    profile.expenses.length === 1 &&
    profile.assets.length <= 1 &&
    profile.liabilities.length === 0;

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-5">
        <p className="text-base font-semibold text-foreground leading-snug">
          {heroHeadline}
        </p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {heroDetail}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Net Worth"
          value={formatCurrency(snapshot.netWorth)}
          description="Everything you own minus everything you owe. This is your total financial position."
          trend={snapshot.netWorth >= 0 ? "positive" : "negative"}
        />
        <MetricCard
          label="Savings Rate"
          value={formatPercent(snapshot.savingsRate)}
          subtitle="of after-tax income"
          description="The percentage of your take-home pay that you're not spending. Higher = faster path to financial independence."
          trend={
            snapshot.savingsRate >= 0.5
              ? "positive"
              : snapshot.savingsRate >= 0.2
                ? "neutral"
                : "negative"
          }
        />
        <MetricCard
          label="FIRE Number"
          value={formatCurrency(snapshot.fireNumber)}
          subtitle={`${Math.round(1 / profile.assumptions.safeWithdrawalRate)}x annual expenses`}
          description="What you'd need to retire today. In the chart, this number grows with inflation to show your real moving target."
        />
        <MetricCard
          label="Years to FIRE"
          value={
            isFinite(snapshot.yearsToFire)
              ? formatYears(snapshot.yearsToFire)
              : "N/A"
          }
          subtitle={
            isFinite(snapshot.yearsToFire)
              ? `Age ${snapshot.projectedFireAge} for ${youngestMember.name || "you"}`
              : undefined
          }
          description="How long until your investments reach your FIRE number, assuming you keep saving at your current rate."
          trend={
            isFinite(snapshot.yearsToFire) && snapshot.yearsToFire <= 15
              ? "positive"
              : "neutral"
          }
        />
      </div>

      <FireProgress
        investableAssets={snapshot.investableAssets}
        fireNumber={snapshot.fireNumber}
        progress={snapshot.fireProgress}
        netWorth={snapshot.netWorth}
      />

      {projection.length > 0 && <ProjectionChart data={projection} />}

      {profile.expenses.length > 0 && (
        <ExpenseBreakdown expenses={profile.expenses} />
      )}

      {isMinimalProfile && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Want a more accurate projection?</p>
                <p className="text-xs text-muted-foreground">Add your income breakdown, expense categories, and account details.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/onboarding">Add Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isDemoMode && profile.lastUpdated && (
        <p className="text-xs text-muted-foreground/50 text-center pt-2 pb-4">
          Last updated {new Date(profile.lastUpdated).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
