import type { ExpenseCategory, AssetType, LiabilityType, IncomeSource } from "@/types/finance";

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  housing: "Housing",
  transportation: "Transportation",
  food_and_drink: "Food & Drink",
  utilities: "Utilities",
  insurance: "Insurance",
  healthcare: "Healthcare",
  entertainment: "Entertainment",
  shopping: "Shopping",
  education: "Education",
  personal_care: "Personal Care",
  travel: "Travel",
  debt_payments: "Debt Payments",
  subscriptions: "Subscriptions",
  childcare: "Childcare",
  kids_education: "Kids' Education",
  kids_activities: "Kids' Activities",
  college_savings: "College Savings",
  charitable_giving: "Charitable Giving",
  other: "Other",
};

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  checking: "Checking Account",
  savings: "Savings Account",
  investment_brokerage: "Brokerage Account",
  retirement_401k: "401(k)",
  retirement_ira: "Traditional IRA",
  retirement_roth: "Roth IRA",
  real_estate: "Real Estate",
  crypto: "Crypto",
  other: "Other",
};

export const INVESTABLE_BY_DEFAULT: Record<AssetType, boolean> = {
  checking: false,
  savings: false,
  investment_brokerage: true,
  retirement_401k: true,
  retirement_ira: true,
  retirement_roth: true,
  real_estate: false,
  crypto: true,
  other: false,
};

export const LIABILITY_TYPE_LABELS: Record<LiabilityType, string> = {
  mortgage: "Mortgage",
  student_loan: "Student Loan",
  auto_loan: "Auto Loan",
  credit_card: "Credit Card",
  personal_loan: "Personal Loan",
  other: "Other",
};

export const INCOME_SOURCE_LABELS: Record<IncomeSource, string> = {
  salary: "Salary",
  freelance: "Freelance",
  rental: "Rental Income",
  dividends: "Dividends",
  other: "Other",
};

export const EXPENSE_CATEGORIES = Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[];
export const ASSET_TYPES = Object.keys(ASSET_TYPE_LABELS) as AssetType[];
export const LIABILITY_TYPES = Object.keys(LIABILITY_TYPE_LABELS) as LiabilityType[];
export const INCOME_SOURCES = Object.keys(INCOME_SOURCE_LABELS) as IncomeSource[];
