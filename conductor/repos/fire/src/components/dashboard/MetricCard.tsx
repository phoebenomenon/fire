"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  description?: string;
  trend?: "positive" | "negative" | "neutral";
}

export function MetricCard({ label, value, subtitle, description, trend }: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center gap-1.5 mb-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {description && (
            <div className="relative">
              <button
                type="button"
                className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-md bg-foreground text-background text-xs p-2.5 leading-relaxed shadow-lg">
                  {description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </div>
              )}
            </div>
          )}
        </div>
        <p
          className={cn(
            "text-2xl font-semibold",
            trend === "positive" && "text-[oklch(0.65_0.17_155)]",
            trend === "negative" && "text-[oklch(0.60_0.20_25)]"
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
