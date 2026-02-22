"use client";

import { useMemo } from "react";
import { generateProjection } from "@/lib/calculations";
import type { FinancialProfile, ProjectionPoint } from "@/types/finance";

export function useProjection(
  profile: FinancialProfile | null,
  years: number = 50
): ProjectionPoint[] {
  return useMemo(() => {
    if (!profile) return [];
    return generateProjection(profile, years);
  }, [profile, years]);
}
