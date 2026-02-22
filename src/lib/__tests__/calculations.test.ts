import { describe, it, expect } from "vitest";
import {
  annualize,
  computeFireNumber,
  computeYearsToFire,
  computeSnapshot,
  generateProjection,
} from "../calculations";
import { createEmptyProfile } from "../defaults";
import type { FinancialProfile } from "@/types/finance";

function makeProfile(overrides: Partial<FinancialProfile> = {}): FinancialProfile {
  return { ...createEmptyProfile(), ...overrides };
}

describe("annualize", () => {
  it("converts monthly to annual", () => {
    expect(annualize(5000, "monthly")).toBe(60000);
  });

  it("passes through annual amounts", () => {
    expect(annualize(60000, "annual")).toBe(60000);
  });

  it("treats one-time as annual", () => {
    expect(annualize(10000, "one-time")).toBe(10000);
  });
});

describe("computeFireNumber", () => {
  it("calculates 25x expenses at 4% SWR", () => {
    expect(computeFireNumber(40000, 0.04)).toBe(1000000);
  });

  it("calculates 33x expenses at 3% SWR", () => {
    expect(computeFireNumber(40000, 0.03)).toBeCloseTo(1333333.33, 0);
  });

  it("returns Infinity for zero SWR", () => {
    expect(computeFireNumber(40000, 0)).toBe(Infinity);
  });
});

describe("computeYearsToFire", () => {
  it("returns 0 if already at FIRE number", () => {
    expect(computeYearsToFire(1000000, 20000, 0.07, 0.03, 1000000)).toBe(0);
  });

  it("returns Infinity with no savings and no assets", () => {
    expect(computeYearsToFire(0, 0, 0.07, 0.03, 1000000)).toBe(Infinity);
  });

  it("roughly 22 years at 50% savings rate (nominal growth vs inflation-adjusted target)", () => {
    // Classic FIRE: $50k income after tax, $25k expenses, $25k savings
    // FIRE number = $25k / 0.04 = $625k (today's dollars)
    // Assets grow at 7% nominal, but FIRE target grows at 3% inflation
    // Simulation-based: takes ~22 years for assets to overtake the moving target
    const years = computeYearsToFire(0, 25000, 0.07, 0.03, 625000);
    expect(years).toBeGreaterThan(19);
    expect(years).toBeLessThan(25);
  });

  it("handles zero real return rate", () => {
    // When return = inflation, assets grow but target grows at same rate
    // Only contributions close the gap, but target keeps moving up
    const years = computeYearsToFire(0, 25000, 0.03, 0.03, 500000);
    expect(years).toBeGreaterThan(25);
    expect(years).toBeLessThan(40);
  });
});

describe("computeSnapshot", () => {
  it("computes correct metrics for a household", () => {
    const profile = makeProfile({
      household: {
        id: "test",
        householdName: "Test Family",
        members: [
          { name: "Alice", currentAge: 30, targetRetirementAge: 55 },
          { name: "Bob", currentAge: 32, targetRetirementAge: 60 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      assumptions: {
        annualReturnRate: 0.07,
        inflationRate: 0.03,
        safeWithdrawalRate: 0.04,
        taxRate: 0.25,
      },
      incomes: [
        {
          id: "1",
          label: "Alice salary",
          amount: 10000,
          frequency: "monthly",
          source: "salary",
          owner: "Alice",
          isActive: true,
        },
        {
          id: "2",
          label: "Bob salary",
          amount: 8000,
          frequency: "monthly",
          source: "salary",
          owner: "Bob",
          isActive: true,
        },
      ],
      expenses: [
        {
          id: "1",
          label: "Rent",
          amount: 3000,
          frequency: "monthly",
          category: "housing",
          isEssential: true,
          isActive: true,
        },
        {
          id: "2",
          label: "Food",
          amount: 1000,
          frequency: "monthly",
          category: "food_and_drink",
          isEssential: true,
          isActive: true,
        },
      ],
      assets: [
        {
          id: "1",
          label: "401k",
          type: "retirement_401k",
          balance: 200000,
          isInvestable: true,
          owner: "Alice",
        },
        {
          id: "2",
          label: "Checking",
          type: "checking",
          balance: 30000,
          isInvestable: false,
          owner: "joint",
        },
      ],
      liabilities: [
        {
          id: "1",
          label: "Student loan",
          type: "student_loan",
          balance: 20000,
          interestRate: 0.05,
          owner: "Bob",
        },
      ],
    });

    const snapshot = computeSnapshot(profile);

    // Total annual income: (10000 + 8000) * 12 = 216000
    expect(snapshot.totalAnnualIncome).toBe(216000);
    // Total annual expenses: (3000 + 1000) * 12 = 48000
    expect(snapshot.totalAnnualExpenses).toBe(48000);
    // After-tax income: 216000 * 0.75 = 162000
    // Annual savings: 162000 - 48000 = 114000
    expect(snapshot.annualSavings).toBe(114000);
    // Savings rate: 114000 / 162000 ≈ 0.7037
    expect(snapshot.savingsRate).toBeCloseTo(0.7037, 3);
    // Total assets: 200000 + 30000 = 230000
    expect(snapshot.totalAssets).toBe(230000);
    // Total liabilities: 20000
    expect(snapshot.totalLiabilities).toBe(20000);
    // Net worth: 230000 - 20000 = 210000
    expect(snapshot.netWorth).toBe(210000);
    // Investable: 200000
    expect(snapshot.investableAssets).toBe(200000);
    // FIRE number: 48000 / 0.04 = 1200000
    expect(snapshot.fireNumber).toBe(1200000);
    // Uses youngest member (Alice, age 30)
    expect(snapshot.projectedFireAge).toBeGreaterThan(30);
  });

  it("handles inactive items", () => {
    const profile = makeProfile({
      incomes: [
        {
          id: "1",
          label: "Active",
          amount: 5000,
          frequency: "monthly",
          source: "salary",
          owner: "Me",
          isActive: true,
        },
        {
          id: "2",
          label: "Inactive",
          amount: 3000,
          frequency: "monthly",
          source: "freelance",
          owner: "Me",
          isActive: false,
        },
      ],
    });

    const snapshot = computeSnapshot(profile);
    expect(snapshot.totalAnnualIncome).toBe(60000);
  });
});

describe("generateProjection", () => {
  it("generates correct number of points", () => {
    const profile = makeProfile();
    const points = generateProjection(profile, 30);
    expect(points).toHaveLength(31); // 0 through 30
  });

  it("marks FIRE date correctly", () => {
    const profile = makeProfile({
      household: {
        id: "test",
        householdName: "",
        members: [{ name: "Test", currentAge: 30, targetRetirementAge: 65 }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      incomes: [
        {
          id: "1",
          label: "Salary",
          amount: 100000,
          frequency: "annual",
          source: "salary",
          owner: "Test",
          isActive: true,
        },
      ],
      expenses: [
        {
          id: "1",
          label: "Living",
          amount: 30000,
          frequency: "annual",
          category: "other",
          isEssential: true,
          isActive: true,
        },
      ],
      assets: [
        {
          id: "1",
          label: "Investments",
          type: "investment_brokerage",
          balance: 100000,
          isInvestable: true,
          owner: "Test",
        },
      ],
    });

    const points = generateProjection(profile, 50);
    const firePoint = points.find((p) => p.isFired);
    expect(firePoint).toBeDefined();
    // Should reach FIRE before 50 years
    expect(firePoint!.year - points[0].year).toBeLessThan(50);
  });
});
