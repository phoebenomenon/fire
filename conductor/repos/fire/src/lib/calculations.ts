import type {
  FinancialProfile,
  FinancialSnapshot,
  IncomeFrequency,
  ProjectionPoint,
} from "@/types/finance";

export function annualize(amount: number, frequency: IncomeFrequency): number {
  switch (frequency) {
    case "monthly":
      return amount * 12;
    case "annual":
    case "one-time":
      return amount;
  }
}

export function computeSnapshot(profile: FinancialProfile): FinancialSnapshot {
  const { assumptions, incomes, expenses, assets, liabilities, household } = profile;

  const totalAnnualIncome = incomes
    .filter((i) => i.isActive)
    .reduce((sum, i) => sum + annualize(i.amount, i.frequency), 0);

  const totalAnnualExpenses = expenses
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + annualize(e.amount, e.frequency), 0);

  const annualSavings = totalAnnualIncome * (1 - assumptions.taxRate) - totalAnnualExpenses;
  const savingsRate =
    totalAnnualIncome > 0
      ? annualSavings / (totalAnnualIncome * (1 - assumptions.taxRate))
      : 0;

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
  const netWorth = totalAssets - totalLiabilities;
  const investableAssets = assets
    .filter((a) => a.isInvestable)
    .reduce((sum, a) => sum + a.balance, 0);

  const fireNumber = computeFireNumber(totalAnnualExpenses, assumptions.safeWithdrawalRate);
  const fireProgress = fireNumber > 0 ? Math.min(investableAssets / fireNumber, 1) : 0;

  const yearsToFire = computeYearsToFire(
    investableAssets,
    Math.max(annualSavings, 0),
    assumptions.annualReturnRate,
    assumptions.inflationRate,
    fireNumber
  );

  // Use youngest member for age-based projections (conservative)
  const youngestMember = household.members.reduce((youngest, m) =>
    m.currentAge < youngest.currentAge ? m : youngest
  );

  const projectedFireAge = youngestMember.currentAge + yearsToFire;
  const projectedFireDate = new Date();
  projectedFireDate.setFullYear(projectedFireDate.getFullYear() + Math.ceil(yearsToFire));

  return {
    totalAnnualIncome,
    totalAnnualExpenses,
    annualSavings,
    savingsRate,
    totalAssets,
    totalLiabilities,
    netWorth,
    investableAssets,
    fireNumber,
    fireProgress,
    yearsToFire,
    projectedFireDate: projectedFireDate.toISOString(),
    projectedFireAge: Math.round(projectedFireAge),
  };
}

export function computeFireNumber(
  annualExpenses: number,
  safeWithdrawalRate: number
): number {
  if (safeWithdrawalRate <= 0) return Infinity;
  return annualExpenses / safeWithdrawalRate;
}

/**
 * Solve for years until investable assets reach FIRE number.
 * Simulates year-by-year: assets grow at nominal return rate,
 * FIRE target grows at inflation rate. This matches the projection
 * chart exactly so the metric card and chart always agree.
 */
export function computeYearsToFire(
  currentInvestable: number,
  annualContribution: number,
  annualReturnRate: number,
  inflationRate: number,
  fireNumber: number
): number {
  if (currentInvestable >= fireNumber) return 0;
  if (annualContribution <= 0 && currentInvestable <= 0) return Infinity;

  let investable = currentInvestable;
  const maxYears = 100;

  for (let y = 1; y <= maxYears; y++) {
    // Grow assets at nominal return + add savings (matches generateProjection)
    investable = investable * (1 + annualReturnRate) + annualContribution;

    // FIRE target grows with inflation each year
    const fireTarget = fireNumber * Math.pow(1 + inflationRate, y);

    if (investable >= fireTarget) {
      // Interpolate for fractional year
      const prevInvestable = (investable - annualContribution) / (1 + annualReturnRate);
      const prevFireTarget = fireNumber * Math.pow(1 + inflationRate, y - 1);
      const gapBefore = fireTarget - investable + (investable - prevInvestable);
      const gapPrev = prevFireTarget - prevInvestable;

      if (gapPrev > 0) {
        // Linear interpolation between year y-1 and y
        const fraction = gapPrev / (gapPrev + (investable - fireTarget));
        return y - 1 + fraction;
      }
      return y;
    }
  }

  return Infinity;
}

export function generateProjection(
  profile: FinancialProfile,
  yearsToProject: number = 50
): ProjectionPoint[] {
  const { assumptions, household } = profile;
  const snapshot = computeSnapshot(profile);

  const youngestMember = household.members.reduce((youngest, m) =>
    m.currentAge < youngest.currentAge ? m : youngest
  );

  const realReturn = (1 + assumptions.annualReturnRate) / (1 + assumptions.inflationRate) - 1;
  const points: ProjectionPoint[] = [];

  let investable = snapshot.investableAssets;
  let nonInvestable = snapshot.totalAssets - snapshot.investableAssets;
  const annualSavings = Math.max(snapshot.annualSavings, 0);
  let isFired = false;

  for (let y = 0; y <= yearsToProject; y++) {
    const age = youngestMember.currentAge + y;
    const inflationFactor = Math.pow(1 + assumptions.inflationRate, y);
    const expensesAdjusted = snapshot.totalAnnualExpenses * inflationFactor;
    const fireNumberAdjusted = expensesAdjusted / assumptions.safeWithdrawalRate;

    if (investable >= fireNumberAdjusted && !isFired) {
      isFired = true;
    }

    const netWorth = investable + nonInvestable - snapshot.totalLiabilities;

    points.push({
      year: new Date().getFullYear() + y,
      age,
      netWorth,
      investableAssets: investable,
      annualExpensesInflationAdjusted: expensesAdjusted,
      fireNumberInflationAdjusted: fireNumberAdjusted,
      isFired,
    });

    // Grow investable assets and add savings
    investable = investable * (1 + assumptions.annualReturnRate) + annualSavings;
  }

  return points;
}
