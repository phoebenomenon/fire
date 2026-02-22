"use client";

import { useMemo } from "react";
import { computeSnapshot } from "@/lib/calculations";
import type { FinancialProfile, FinancialSnapshot } from "@/types/finance";

export function useFinancialSnapshot(
  profile: FinancialProfile | null
): FinancialSnapshot | null {
  return useMemo(() => {
    if (!profile) return null;
    return computeSnapshot(profile);
  }, [profile]);
}
