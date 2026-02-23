"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { storage } from "@/lib/storage";
import { createEmptyProfile, createDemoProfile } from "@/lib/defaults";
import type {
  FinancialProfile,
  HouseholdProfile,
  HouseholdMember,
  Assumptions,
  Income,
  Expense,
  Asset,
  Liability,
} from "@/types/finance";

interface FinancialProfileContextValue {
  profile: FinancialProfile | null;
  isLoading: boolean;
  hasData: boolean;
  isDemoMode: boolean;

  // Demo mode
  enterDemoMode: () => void;
  exitDemoMode: () => void;

  // Household
  updateHousehold: (updates: Partial<HouseholdProfile>) => void;
  updateMember: (index: number, updates: Partial<HouseholdMember>) => void;
  addMember: (member: HouseholdMember) => void;
  removeMember: (index: number) => void;

  // Assumptions
  updateAssumptions: (updates: Partial<Assumptions>) => void;

  // CRUD for collections
  addIncome: (income: Omit<Income, "id">) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  removeIncome: (id: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  removeExpense: (id: string) => void;

  addAsset: (asset: Omit<Asset, "id">) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;

  addLiability: (liability: Omit<Liability, "id">) => void;
  updateLiability: (id: string, updates: Partial<Liability>) => void;
  removeLiability: (id: string) => void;

  // Data management
  saveProfile: (profile: FinancialProfile) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  clearData: () => void;
}

const FinancialProfileContext = createContext<FinancialProfileContextValue | null>(null);

export function FinancialProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoProfile, setDemoProfile] = useState<FinancialProfile | null>(null);

  useEffect(() => {
    const loaded = storage.load();
    setProfile(loaded);
    setIsLoading(false);
  }, []);

  const enterDemoMode = useCallback(() => {
    setDemoProfile(createDemoProfile());
    setIsDemoMode(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    setDemoProfile(null);
    setIsDemoMode(false);
  }, []);

  const persist = useCallback((updated: FinancialProfile) => {
    setProfile(updated);
    storage.save(updated);
    // If saving real data, exit demo mode
    if (isDemoMode) {
      setDemoProfile(null);
      setIsDemoMode(false);
    }
  }, [isDemoMode]);

  const ensureProfile = useCallback((): FinancialProfile => {
    if (profile) return profile;
    const empty = createEmptyProfile();
    persist(empty);
    return empty;
  }, [profile, persist]);

  // Household
  const updateHousehold = useCallback(
    (updates: Partial<HouseholdProfile>) => {
      const p = ensureProfile();
      persist({ ...p, household: { ...p.household, ...updates, updatedAt: new Date().toISOString() } });
    },
    [ensureProfile, persist]
  );

  const updateMember = useCallback(
    (index: number, updates: Partial<HouseholdMember>) => {
      const p = ensureProfile();
      const members = [...p.household.members];
      members[index] = { ...members[index], ...updates };
      persist({ ...p, household: { ...p.household, members, updatedAt: new Date().toISOString() } });
    },
    [ensureProfile, persist]
  );

  const addMember = useCallback(
    (member: HouseholdMember) => {
      const p = ensureProfile();
      if (p.household.members.length >= 2) return;
      persist({
        ...p,
        household: {
          ...p.household,
          members: [...p.household.members, member],
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [ensureProfile, persist]
  );

  const removeMember = useCallback(
    (index: number) => {
      const p = ensureProfile();
      if (p.household.members.length <= 1) return;
      const members = p.household.members.filter((_, i) => i !== index);
      persist({
        ...p,
        household: { ...p.household, members, updatedAt: new Date().toISOString() },
      });
    },
    [ensureProfile, persist]
  );

  // Assumptions
  const updateAssumptions = useCallback(
    (updates: Partial<Assumptions>) => {
      const p = ensureProfile();
      persist({ ...p, assumptions: { ...p.assumptions, ...updates } });
    },
    [ensureProfile, persist]
  );

  // Generic CRUD helpers
  const addItem = useCallback(
    (key: "incomes" | "expenses" | "assets" | "liabilities", item: Record<string, unknown>) => {
      const p = ensureProfile();
      const collection = p[key] as Array<{ id: string }>;
      persist({ ...p, [key]: [...collection, { ...item, id: uuid() }] });
    },
    [ensureProfile, persist]
  );

  const updateItem = useCallback(
    (key: "incomes" | "expenses" | "assets" | "liabilities", id: string, updates: Record<string, unknown>) => {
      const p = ensureProfile();
      const collection = p[key] as Array<{ id: string }>;
      persist({
        ...p,
        [key]: collection.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      });
    },
    [ensureProfile, persist]
  );

  const removeItem = useCallback(
    (key: "incomes" | "expenses" | "assets" | "liabilities", id: string) => {
      const p = ensureProfile();
      const collection = p[key] as Array<{ id: string }>;
      persist({ ...p, [key]: collection.filter((item) => item.id !== id) });
    },
    [ensureProfile, persist]
  );

  // Collection CRUD
  const addIncome = useCallback((i: Omit<Income, "id">) => addItem("incomes", i), [addItem]);
  const updateIncome = useCallback((id: string, u: Partial<Income>) => updateItem("incomes", id, u), [updateItem]);
  const removeIncome = useCallback((id: string) => removeItem("incomes", id), [removeItem]);

  const addExpense = useCallback((e: Omit<Expense, "id">) => addItem("expenses", e), [addItem]);
  const updateExpense = useCallback((id: string, u: Partial<Expense>) => updateItem("expenses", id, u), [updateItem]);
  const removeExpense = useCallback((id: string) => removeItem("expenses", id), [removeItem]);

  const addAsset = useCallback((a: Omit<Asset, "id">) => addItem("assets", a), [addItem]);
  const updateAsset = useCallback((id: string, u: Partial<Asset>) => updateItem("assets", id, u), [updateItem]);
  const removeAsset = useCallback((id: string) => removeItem("assets", id), [removeItem]);

  const addLiability = useCallback((l: Omit<Liability, "id">) => addItem("liabilities", l), [addItem]);
  const updateLiability = useCallback(
    (id: string, u: Partial<Liability>) => updateItem("liabilities", id, u),
    [updateItem]
  );
  const removeLiability = useCallback((id: string) => removeItem("liabilities", id), [removeItem]);

  // Data management
  const saveProfile = useCallback((p: FinancialProfile) => persist(p), [persist]);

  const exportData = useCallback(() => {
    return JSON.stringify(profile, null, 2);
  }, [profile]);

  const importData = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json);
        persist(parsed as FinancialProfile);
        return true;
      } catch {
        return false;
      }
    },
    [persist]
  );

  const clearData = useCallback(() => {
    storage.clear();
    setProfile(null);
  }, []);

  // Expose demo profile when in demo mode, real profile otherwise
  const activeProfile = isDemoMode ? demoProfile : profile;

  const hasData = isDemoMode || (profile !== null && (
    profile.incomes.length > 0 ||
    profile.expenses.length > 0 ||
    profile.assets.length > 0 ||
    profile.liabilities.length > 0
  ));

  return (
    <FinancialProfileContext.Provider value={{
      profile: activeProfile,
      isLoading,
      hasData,
      isDemoMode,
      enterDemoMode,
      exitDemoMode,
      updateHousehold,
      updateMember,
      addMember,
      removeMember,
      updateAssumptions,
      addIncome, updateIncome, removeIncome,
      addExpense, updateExpense, removeExpense,
      addAsset, updateAsset, removeAsset,
      addLiability, updateLiability, removeLiability,
      saveProfile,
      exportData,
      importData,
      clearData,
    }}>
      {children}
    </FinancialProfileContext.Provider>
  );
}

export function useFinancialProfile() {
  const ctx = useContext(FinancialProfileContext);
  if (!ctx) {
    throw new Error("useFinancialProfile must be used within FinancialProfileProvider");
  }
  return ctx;
}
