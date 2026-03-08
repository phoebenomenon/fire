"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { FinancialProfile, HouseholdMember } from "@/types/finance";

interface HouseholdStepProps {
  draft: FinancialProfile;
  updateDraft: (updates: Partial<FinancialProfile>) => void;
}

export function HouseholdStep({ draft, updateDraft }: HouseholdStepProps) {
  const { household } = draft;
  const members = household.members;

  const updateMember = (index: number, updates: Partial<HouseholdMember>) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], ...updates };
    updateDraft({
      household: { ...household, members: newMembers, updatedAt: new Date().toISOString() },
    });
  };

  const addPartner = () => {
    if (members.length >= 2) return;
    updateDraft({
      household: {
        ...household,
        members: [...members, { name: "", currentAge: 30, targetRetirementAge: 65 }],
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const removePartner = () => {
    if (members.length <= 1) return;
    updateDraft({
      household: {
        ...household,
        members: [members[0]],
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Your Household</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about who&apos;s in your household. This helps us calculate your combined finances.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="householdName">Household Name (optional)</Label>
        <Input
          id="householdName"
          placeholder='e.g., "The Chens"'
          value={household.householdName}
          onChange={(e) =>
            updateDraft({
              household: { ...household, householdName: e.target.value, updatedAt: new Date().toISOString() },
            })
          }
        />
      </div>

      {members.map((member, i) => (
        <div key={i} className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">
              {i === 0 ? "You" : "Partner"}
            </h3>
            {i === 1 && (
              <Button variant="ghost" size="sm" onClick={removePartner}>
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`name-${i}`}>Name</Label>
            <Input
              id={`name-${i}`}
              placeholder="First name"
              value={member.name}
              onChange={(e) => updateMember(i, { name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`age-${i}`}>Current Age</Label>
              <Input
                id={`age-${i}`}
                type="number"
                min={1}
                max={120}
                value={member.currentAge}
                onChange={(e) =>
                  updateMember(i, { currentAge: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`retirement-${i}`}>Target Retirement Age</Label>
              <Input
                id={`retirement-${i}`}
                type="number"
                min={1}
                max={120}
                value={member.targetRetirementAge}
                onChange={(e) =>
                  updateMember(i, {
                    targetRetirementAge: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
      ))}

      {members.length < 2 && (
        <Button variant="outline" onClick={addPartner} className="w-full">
          <Plus className="h-4 w-4 mr-1" />
          Add Partner
        </Button>
      )}
    </div>
  );
}
