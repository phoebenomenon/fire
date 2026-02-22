import { z } from "zod";

export const householdMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currentAge: z.number().min(1).max(120),
  targetRetirementAge: z.number().min(1).max(120),
});

export const householdProfileSchema = z.object({
  id: z.string(),
  householdName: z.string(),
  members: z.array(householdMemberSchema).min(1).max(2),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const assumptionsSchema = z.object({
  annualReturnRate: z.number().min(0).max(1),
  inflationRate: z.number().min(0).max(1),
  safeWithdrawalRate: z.number().min(0.01).max(1),
  taxRate: z.number().min(0).max(1),
});

export const incomeSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  amount: z.number().min(0),
  frequency: z.enum(["monthly", "annual", "one-time"]),
  source: z.enum(["salary", "freelance", "rental", "dividends", "other"]),
  owner: z.string().min(1),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const expenseSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  amount: z.number().min(0),
  frequency: z.enum(["monthly", "annual", "one-time"]),
  category: z.enum([
    "housing", "transportation", "food_and_drink", "utilities", "insurance",
    "healthcare", "entertainment", "shopping", "education", "personal_care",
    "travel", "debt_payments", "subscriptions", "childcare", "kids_education",
    "kids_activities", "college_savings", "charitable_giving", "other",
  ]),
  isEssential: z.boolean(),
  isActive: z.boolean(),
});

export const assetSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  type: z.enum([
    "checking", "savings", "investment_brokerage", "retirement_401k",
    "retirement_ira", "retirement_roth", "real_estate", "crypto", "other",
  ]),
  balance: z.number().min(0),
  isInvestable: z.boolean(),
  owner: z.string().min(1),
  institutionName: z.string().optional(),
  accountId: z.string().optional(),
});

export const liabilitySchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  type: z.enum([
    "mortgage", "student_loan", "auto_loan", "credit_card",
    "personal_loan", "other",
  ]),
  balance: z.number().min(0),
  interestRate: z.number().min(0).max(1),
  minimumPayment: z.number().min(0).optional(),
  owner: z.string().min(1),
  institutionName: z.string().optional(),
  accountId: z.string().optional(),
});

export const financialProfileSchema = z.object({
  household: householdProfileSchema,
  assumptions: assumptionsSchema,
  incomes: z.array(incomeSchema),
  expenses: z.array(expenseSchema),
  assets: z.array(assetSchema),
  liabilities: z.array(liabilitySchema),
  lastUpdated: z.string(),
});
