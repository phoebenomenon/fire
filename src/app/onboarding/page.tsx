"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { createEmptyProfile } from "@/lib/defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HouseholdStep } from "@/components/forms/HouseholdStep";
import { IncomeStep } from "@/components/forms/IncomeStep";
import { ExpenseStep } from "@/components/forms/ExpenseStep";
import { AssetStep } from "@/components/forms/AssetStep";
import { LiabilityStep } from "@/components/forms/LiabilityStep";
import { AssumptionsStep } from "@/components/forms/AssumptionsStep";
import { ReviewStep } from "@/components/forms/ReviewStep";
import type { FinancialProfile } from "@/types/finance";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  { label: "Household", key: "household" },
  { label: "Income", key: "income" },
  { label: "Expenses", key: "expenses" },
  { label: "Assets", key: "assets" },
  { label: "Debts", key: "debts" },
  { label: "Assumptions", key: "assumptions" },
  { label: "Review", key: "review" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useFinancialProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<FinancialProfile>(() => {
    const empty = createEmptyProfile();
    return empty;
  });

  const canGoBack = step > 0;
  const canGoForward = step < STEPS.length - 1;
  const isLastStep = step === STEPS.length - 1;

  const handleSave = () => {
    draft.lastUpdated = new Date().toISOString();
    saveProfile(draft);
    router.push("/");
  };

  const updateDraft = (updates: Partial<FinancialProfile>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const currentStep = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
            <span
              className={`text-xs hidden sm:block ${
                i === step ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep.key === "household" && (
            <HouseholdStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep.key === "income" && (
            <IncomeStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep.key === "expenses" && (
            <ExpenseStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep.key === "assets" && (
            <AssetStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep.key === "debts" && (
            <LiabilityStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep.key === "assumptions" && (
            <AssumptionsStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep.key === "review" && <ReviewStep draft={draft} />}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {isLastStep ? (
          <Button onClick={handleSave}>Save & View Dashboard</Button>
        ) : (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
