"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useFinancialSnapshot } from "@/hooks/useFinancialSnapshot";
import { useProjection } from "@/hooks/useProjection";
import { EmptyState } from "@/components/shared/EmptyState";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FireProgress } from "@/components/dashboard/FireProgress";
import dynamic from "next/dynamic";
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
  const { profile, isLoading, hasData } = useFinancialProfile();
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

  return (
    <div className="space-y-6">
      <div className="animate-card-in rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-5">
        <p className="text-base font-semibold text-foreground leading-snug">
          {heroHeadline}
        </p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {heroDetail}
        </p>
      </div>

      <div className="animate-card-in grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "0.05s" }}>
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

      <div className="animate-card-in" style={{ animationDelay: "0.1s" }}>
        <FireProgress
          investableAssets={snapshot.investableAssets}
          fireNumber={snapshot.fireNumber}
          progress={snapshot.fireProgress}
          netWorth={snapshot.netWorth}
        />
      </div>

      {projection.length > 0 && (
        <div className="animate-card-in" style={{ animationDelay: "0.15s" }}>
          <ProjectionChart data={projection} />
        </div>
      )}

      {profile.expenses.length > 0 && (
        <div className="animate-card-in" style={{ animationDelay: "0.2s" }}>
          <ExpenseBreakdown expenses={profile.expenses} />
        </div>
      )}

      {profile.lastUpdated && (
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
