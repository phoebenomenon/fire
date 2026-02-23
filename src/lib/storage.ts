import type { FinancialProfile } from "@/types/finance";
import { financialProfileSchema } from "./validation";

export interface StorageAdapter {
  load(): FinancialProfile | null;
  save(profile: FinancialProfile): void;
  clear(): void;
}

const STORAGE_KEY = "fire-financial-profile";

class LocalStorageAdapter implements StorageAdapter {
  load(): FinancialProfile | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const result = financialProfileSchema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }

  save(profile: FinancialProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...profile,
      lastUpdated: new Date().toISOString(),
    }));
  }

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();
