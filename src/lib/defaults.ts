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
