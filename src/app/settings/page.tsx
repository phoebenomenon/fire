"use client";

import { useState, useRef } from "react";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HouseholdStep } from "@/components/forms/HouseholdStep";
import { IncomeStep } from "@/components/forms/IncomeStep";
import { ExpenseStep } from "@/components/forms/ExpenseStep";
import { AssetStep } from "@/components/forms/AssetStep";
import { LiabilityStep } from "@/components/forms/LiabilityStep";
import { AssumptionsStep } from "@/components/forms/AssumptionsStep";
import { Download, Upload, Trash2, Check } from "lucide-react";
import type { FinancialProfile } from "@/types/finance";

export default function SettingsPage() {
  const {
    profile,
    isLoading,
    saveProfile,
    exportData,
    importData,
    clearData,
  } = useFinancialProfile();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">No data yet. Complete the onboarding first.</p>
        <Button asChild>
          <a href="/onboarding">Get Started</a>
        </Button>
      </div>
    );
  }

  const updateDraft = (updates: Partial<FinancialProfile>) => {
    // Save immediately (localStorage is fast)
    saveProfile({ ...profile, ...updates, lastUpdated: new Date().toISOString() });

    // Debounce the toast — only show after user stops editing for 800ms
    setShowSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);
    debounceRef.current = setTimeout(() => {
      setShowSaved(true);
      hideRef.current = setTimeout(() => setShowSaved(false), 1500);
    }, 800);
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fire-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const success = importData(json);
      if (!success) {
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClear = () => {
    clearData();
    setShowClearConfirm(false);
    window.location.href = "/";
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Settings</h1>

      {/* Fixed bottom toast for save feedback */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300 ${
          showSaved
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <Check className="h-4 w-4" />
        Changes saved
      </div>

      <Tabs defaultValue="household">
        <TabsList className="flex w-full overflow-x-auto no-scrollbar mb-6">
          <TabsTrigger value="household">Household</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
          <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="household">
          <Card>
            <CardContent className="pt-6">
              <HouseholdStep draft={profile} updateDraft={updateDraft} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardContent className="pt-6">
              <IncomeStep draft={profile} updateDraft={updateDraft} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="pt-6">
              <ExpenseStep draft={profile} updateDraft={updateDraft} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardContent className="pt-6">
              <AssetStep draft={profile} updateDraft={updateDraft} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debts">
          <Card>
            <CardContent className="pt-6">
              <LiabilityStep draft={profile} updateDraft={updateDraft} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assumptions">
          <Card>
            <CardContent className="pt-6">
              <AssumptionsStep draft={profile} updateDraft={updateDraft} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export & Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your data is stored in your browser. Export a backup to keep it safe.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" />
                    Export JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Import JSON
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-destructive">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showClearConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm text-destructive font-medium">
                      This will permanently delete all your data. Are you sure?
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClear}
                      >
                        Yes, delete everything
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowClearConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All Data
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
