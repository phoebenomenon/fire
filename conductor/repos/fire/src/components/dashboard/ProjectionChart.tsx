"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/format";
import type { ProjectionPoint } from "@/types/finance";

interface ProjectionChartProps {
  data: ProjectionPoint[];
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  const firePoint = data.find((p) => p.isFired);
  const fireLabel = firePoint
    ? `🔥 FIRE — ${firePoint.year} (Age ${firePoint.age})`
    : undefined;

  // Cap the chart to 10 years past FIRE (or 30 years if no FIRE point)
  const fireIndex = firePoint ? data.findIndex((p) => p.isFired) : -1;
  const cutoffIndex = fireIndex >= 0
    ? Math.min(fireIndex + 10, data.length)
    : Math.min(30, data.length);
  const visibleData = data.slice(0, cutoffIndex + 1);

  // Set Y-axis max to ~1.3x the highest value in the visible range for breathing room
  const maxVal = visibleData.reduce((max, p) => {
    return Math.max(max, p.investableAssets, p.fireNumberInflationAdjusted);
  }, 0);
  const yMax = Math.ceil((maxVal * 1.3) / 1_000_000) * 1_000_000 || 1_000_000;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          Path to Financial Independence
        </CardTitle>
        {firePoint && (
          <p className="text-xs text-muted-foreground mt-1">
            Your investments cross your FIRE number in {firePoint.year} — that&apos;s when the lines meet.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => String(v)}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatCompactNumber}
                stroke="hsl(var(--muted-foreground))"
                width={60}
                domain={[0, yMax]}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  formatCompactNumber(Number(value) || 0),
                  name === "investableAssets"
                    ? "Investable Assets"
                    : "FIRE Number",
                ]}
                labelFormatter={(label) => {
                  const point = visibleData.find((p) => p.year === label);
                  return point ? `${label} (Age ${point.age})` : String(label);
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="investableAssets"
                stroke="oklch(0.55 0.15 175)"
                fill="oklch(0.55 0.15 175 / 0.15)"
                strokeWidth={2}
                name="investableAssets"
              />
              <Area
                type="monotone"
                dataKey="fireNumberInflationAdjusted"
                stroke="oklch(0.78 0.15 75)"
                fill="oklch(0.78 0.15 75 / 0.08)"
                strokeWidth={2}
                strokeDasharray="6 3"
                name="fireNumberInflationAdjusted"
              />
              {firePoint && (
                <ReferenceLine
                  x={firePoint.year}
                  stroke="oklch(0.65 0.17 155)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: fireLabel!,
                    position: "insideTopRight",
                    fill: "oklch(0.65 0.17 155)",
                    fontSize: 11,
                    fontWeight: 600,
                    offset: 8,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "oklch(0.55 0.15 175)" }} />
            Investable Assets
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "oklch(0.78 0.15 75)" }} />
            FIRE Number (inflation-adjusted)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
