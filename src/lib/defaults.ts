import { v4 as uuid } from "uuid";
import type { Assumptions, FinancialProfile, HouseholdProfile } from "@/types/finance";

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  annualReturnRate: 0.07,
  inflationRate: 0.03,
  safeWithdrawalRate: 0.04,
  taxRate: 0.25,
};

export function createEmptyProfile(): FinancialProfile {
  const now = new Date().toISOString();
  const household: HouseholdProfile = {
    id: uuid(),
    householdName: "",
    members: [{ name: "", currentAge: 30, targetRetirementAge: 65 }],
    createdAt: now,
    updatedAt: now,
  };

  return {
    household,
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    incomes: [],
    expenses: [],
    assets: [],
    liabilities: [],
    lastUpdated: now,
  };
}

/**
 * Realistic demo profile — Bay Area couple (ages 32 & 30).
 * Populates every dashboard section so new users can see the full experience.
 */
export function createDemoProfile(): FinancialProfile {
  const now = new Date().toISOString();

  return {
    household: {
      id: uuid(),
      householdName: "The Chens",
      members: [
        { name: "Alex", currentAge: 32, targetRetirementAge: 50 },
        { name: "Jordan", currentAge: 30, targetRetirementAge: 50 },
      ],
      createdAt: now,
      updatedAt: now,
    },
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    incomes: [
      { id: uuid(), label: "Alex — Software Engineer", amount: 225000, frequency: "annual", source: "salary", owner: "Alex", isActive: true },
      { id: uuid(), label: "Alex — RSU Vesting", amount: 80000, frequency: "annual", source: "other", owner: "Alex", isActive: true },
      { id: uuid(), label: "Jordan — Product Manager", amount: 185000, frequency: "annual", source: "salary", owner: "Jordan", isActive: true },
      { id: uuid(), label: "Jordan — RSU Vesting", amount: 45000, frequency: "annual", source: "other", owner: "Jordan", isActive: true },
    ],
    expenses: [
      { id: uuid(), label: "Rent (2BR in SF)", amount: 4100, frequency: "monthly", category: "housing", isEssential: true, isActive: true },
      { id: uuid(), label: "Childcare / Daycare", amount: 2800, frequency: "monthly", category: "other", isEssential: true, isActive: true },
      { id: uuid(), label: "Groceries", amount: 1100, frequency: "monthly", category: "food_and_drink", isEssential: true, isActive: true },
      { id: uuid(), label: "Car Payment + Insurance", amount: 750, frequency: "monthly", category: "transportation", isEssential: true, isActive: true },
      { id: uuid(), label: "Utilities & Internet", amount: 320, frequency: "monthly", category: "utilities", isEssential: true, isActive: true },
      { id: uuid(), label: "Health Insurance", amount: 580, frequency: "monthly", category: "insurance", isEssential: true, isActive: true },
      { id: uuid(), label: "Dining Out & Entertainment", amount: 700, frequency: "monthly", category: "entertainment", isEssential: false, isActive: true },
      { id: uuid(), label: "Subscriptions", amount: 150, frequency: "monthly", category: "subscriptions", isEssential: false, isActive: true },
      { id: uuid(), label: "Travel Fund", amount: 500, frequency: "monthly", category: "travel", isEssential: false, isActive: true },
      { id: uuid(), label: "Shopping & Personal", amount: 400, frequency: "monthly", category: "shopping", isEssential: false, isActive: true },
      { id: uuid(), label: "Student Loan Payments", amount: 320, frequency: "monthly", category: "debt_payments", isEssential: true, isActive: true },
    ],
    assets: [
      { id: uuid(), label: "Joint Checking", type: "checking", balance: 24000, isInvestable: false, owner: "joint" },
      { id: uuid(), label: "Emergency Fund (HYSA)", type: "savings", balance: 55000, isInvestable: false, owner: "joint" },
      { id: uuid(), label: "Alex — 401(k)", type: "retirement_401k", balance: 175000, isInvestable: true, owner: "Alex" },
      { id: uuid(), label: "Jordan — 401(k)", type: "retirement_401k", balance: 110000, isInvestable: true, owner: "Jordan" },
      { id: uuid(), label: "Roth IRAs", type: "retirement_roth", balance: 85000, isInvestable: true, owner: "joint" },
      { id: uuid(), label: "Brokerage Account", type: "investment_brokerage", balance: 130000, isInvestable: true, owner: "joint" },
      { id: uuid(), label: "529 College Fund", type: "other", balance: 15000, isInvestable: true, owner: "joint" },
    ],
    liabilities: [
      { id: uuid(), label: "Jordan — Student Loans", type: "student_loan", balance: 22000, interestRate: 0.045, owner: "Jordan" },
    ],
    lastUpdated: now,
  };
}

/**
 * Build a minimal valid profile from just 3 numbers.
 * Creates a single-person household with 1 income, 1 expense, and 1 asset.
 */
export function buildQuickStartProfile(
  annualIncome: number,
  annualExpenses: number,
  currentSavings: number
): FinancialProfile {
  const now = new Date().toISOString();

  return {
    household: {
      id: uuid(),
      householdName: "",
      members: [{ name: "You", currentAge: 30, targetRetirementAge: 65 }],
      createdAt: now,
      updatedAt: now,
    },
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    incomes: [
      { id: uuid(), label: "Household Income", amount: annualIncome, frequency: "annual", source: "salary", owner: "joint", isActive: true },
    ],
    expenses: [
      { id: uuid(), label: "Annual Expenses", amount: annualExpenses, frequency: "annual", category: "other", isEssential: true, isActive: true },
    ],
    assets: [
      { id: uuid(), label: "Total Savings & Investments", type: "investment_brokerage", balance: currentSavings, isInvestable: true, owner: "joint" },
    ],
    liabilities: [],
    lastUpdated: now,
  };
}
