// ---- Household ----

export interface HouseholdMember {
  name: string;
  currentAge: number;
  targetRetirementAge: number;
}

export interface HouseholdProfile {
  id: string;
  householdName: string;
  members: HouseholdMember[]; // 1 for singles, 2 for couples
  createdAt: string;
  updatedAt: string;
}

// ---- Assumptions ----

export interface Assumptions {
  annualReturnRate: number; // Default 0.07
  inflationRate: number; // Default 0.03
  safeWithdrawalRate: number; // Default 0.04
  taxRate: number; // Effective tax rate, default 0.25
}

// ---- Income ----

export type IncomeFrequency = "monthly" | "annual" | "one-time";

export type IncomeSource =
  | "salary"
  | "freelance"
  | "rental"
  | "dividends"
  | "other";

export interface Income {
  id: string;
  label: string;
  amount: number; // Pre-tax
  frequency: IncomeFrequency;
  source: IncomeSource;
  owner: string; // Member name or "joint"
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

// ---- Expenses ----

export type ExpenseCategory =
  | "housing"
  | "transportation"
  | "food_and_drink"
  | "utilities"
  | "insurance"
  | "healthcare"
  | "entertainment"
  | "shopping"
  | "education"
  | "personal_care"
  | "travel"
  | "debt_payments"
  | "subscriptions"
  | "childcare"
  | "kids_education"
  | "kids_activities"
  | "college_savings"
  | "charitable_giving"
  | "other";

export interface Expense {
  id: string;
  label: string;
  amount: number;
  frequency: IncomeFrequency;
  category: ExpenseCategory;
  isEssential: boolean;
  isActive: boolean;
}

// ---- Assets ----

export type AssetType =
  | "checking"
  | "savings"
  | "investment_brokerage"
  | "retirement_401k"
  | "retirement_ira"
  | "retirement_roth"
  | "real_estate"
  | "crypto"
  | "other";

export interface Asset {
  id: string;
  label: string;
  type: AssetType;
  balance: number;
  isInvestable: boolean;
  owner: string; // Member name or "joint"
  institutionName?: string;
  accountId?: string; // For Plaid
}

// ---- Liabilities ----

export type LiabilityType =
  | "mortgage"
  | "student_loan"
  | "auto_loan"
  | "credit_card"
  | "personal_loan"
  | "other";

export interface Liability {
  id: string;
  label: string;
  type: LiabilityType;
  balance: number; // Outstanding balance (positive number)
  interestRate: number; // APR
  minimumPayment?: number;
  owner: string; // Member name or "joint"
  institutionName?: string;
  accountId?: string; // For Plaid
}

// ---- Aggregate profile ----

export interface FinancialProfile {
  household: HouseholdProfile;
  assumptions: Assumptions;
  incomes: Income[];
  expenses: Expense[];
  assets: Asset[];
  liabilities: Liability[];
  lastUpdated: string;
}

// ---- Derived / computed (never stored) ----

export interface FinancialSnapshot {
  totalAnnualIncome: number;
  totalAnnualExpenses: number;
  annualSavings: number;
  savingsRate: number; // 0-1
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  investableAssets: number;
  fireNumber: number;
  fireProgress: number; // 0-1
  yearsToFire: number;
  projectedFireDate: string;
  projectedFireAge: number; // Age of youngest member at FIRE
}

export interface ProjectionPoint {
  year: number;
  age: number; // Youngest member's age
  netWorth: number;
  investableAssets: number;
  annualExpensesInflationAdjusted: number;
  fireNumberInflationAdjusted: number;
  isFired: boolean;
}
