"use client";

import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { ASSET_TYPE_LABELS, ASSET_TYPES, INVESTABLE_BY_DEFAULT } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import type { FinancialProfile, Asset, AssetType } from "@/types/finance";

interface AssetStepProps {
  draft: FinancialProfile;
  updateDraft: (updates: Partial<FinancialProfile>) => void;
}

export function AssetStep({ draft, updateDraft }: AssetStepProps) {
  const { assets, household } = draft;
  const memberNames = household.members.map((m) => m.name).filter(Boolean);
  const ownerOptions = memberNames.length > 1 ? [...memberNames, "joint"] : memberNames.length === 1 ? [memberNames[0]] : ["Me"];

  const addAsset = () => {
    const newAsset: Asset = {
      id: uuid(),
      label: "",
      type: "checking",
      balance: 0,
      isInvestable: false,
      owner: ownerOptions[0],
    };
    updateDraft({ assets: [...assets, newAsset] });
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    updateDraft({
      assets: assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  };

  const removeAsset = (id: string) => {
    updateDraft({ assets: assets.filter((a) => a.id !== id) });
  };

  const handleTypeChange = (id: string, type: AssetType) => {
    updateAsset(id, { type, isInvestable: INVESTABLE_BY_DEFAULT[type] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Assets</h2>
        <p className="text-sm text-muted-foreground">
          Add your bank accounts, investment accounts, and other assets.
          We&apos;ll mark investment accounts as &ldquo;investable&rdquo; — these grow toward your FIRE number.
        </p>
      </div>

      {assets.map((asset) => (
        <div
          key={asset.id}
          className="space-y-4 rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Asset</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAsset(asset.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder='e.g., "Fidelity 401k"'
                value={asset.label}
                onChange={(e) => updateAsset(asset.id, { label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={asset.type}
                onChange={(e) => handleTypeChange(asset.id, e.target.value as AssetType)}
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ASSET_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Balance</Label>
              <CurrencyInput
                value={asset.balance}
                onChange={(v) => updateAsset(asset.id, { balance: v })}
              />
            </div>
            {ownerOptions.length > 1 && (
              <div className="space-y-2">
                <Label>Owner</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={asset.owner}
                  onChange={(e) => updateAsset(asset.id, { owner: e.target.value })}
                >
                  {ownerOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={asset.isInvestable}
              onChange={(e) => updateAsset(asset.id, { isInvestable: e.target.checked })}
              className="rounded border-input"
            />
            Investable (grows toward your FIRE number)
          </label>
        </div>
      ))}

      <Button variant="outline" onClick={addAsset} className="w-full">
        <Plus className="h-4 w-4 mr-1" />
        Add Asset
      </Button>

      {assets.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No assets yet. Click above to add one.
        </p>
      )}
    </div>
  );
}
