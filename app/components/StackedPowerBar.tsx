"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

export type PowerPoint = {
  time: string; // e.g., 14:40:40
  y: number; // yellow segment (bottom)
  b: number; // blue segment (middle)
  c: number; // cyan segment (top)
  total?: number; // computed
};

export interface StackedPowerBarProps {
  data?: PowerPoint[];
  className?: string;
  height?: number; // should match existing bar chart height
}

// Demo dataset to match the screenshot layout
const defaultData: PowerPoint[] = [
  { time: "14:40:40", y: 0.50, b: 0.16, c: 0.14 },
  { time: "14:40:50", y: 0.46, b: 0.18, c: 0.10 },
  { time: "14:41:00", y: 0.48, b: 0.16, c: 0.22 },
  { time: "14:41:10", y: 0.44, b: 0.17, c: 0.14 },
  { time: "14:41:20", y: 0.52, b: 0.19, c: 0.11 },
  { time: "14:41:30", y: 0.41, b: 0.15, c: 0.10 },
  { time: "14:41:40", y: 0.45, b: 0.16, c: 0.12 },
  { time: "14:41:50", y: 0.42, b: 0.18, c: 0.13 },
  { time: "14:42:00", y: 0.47, b: 0.14, c: 0.10 },
  { time: "14:42:10", y: 0.46, b: 0.16, c: 0.12 },
];

const YELLOW = "#facc15"; // tailwind amber-400
const BLUE = "#3b82f6";   // tailwind blue-500
const CYAN = "#06b6d4";   // tailwind cyan-500

function PowerTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p0 = payload[0];
  const total = p0?.payload ? (p0.payload.y + p0.payload.b + p0.payload.c) : undefined;
  return (
    <div className="rounded-lg shadow-lg bg-gray-900 border border-gray-700 p-3 text-gray-100">
      <div className="text-xs font-medium mb-2 opacity-80">{label}</div>
      <div className="space-y-1 text-sm">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="opacity-80 min-w-[88px] capitalize">{p.name}</span>
            <span className="font-semibold">{Number(p.value).toFixed(2)} kW</span>
          </div>
        ))}
        {typeof total === 'number' && (
          <div className="pt-1 mt-1 border-t border-gray-700 flex items-center justify-between">
            <span className="opacity-80">Total</span>
            <span className="font-semibold">{total.toFixed(2)} kW</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StackedPowerBar({ data = defaultData, className, height = 340 }: StackedPowerBarProps) {
  // Narrower max width + taller height for clarity
  const dataWithTotal = data.map(d => ({ ...d, total: d.y + d.b + d.c }));
  return (
    <section className={`rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-[820px] md:max-w-[860px] ${className ?? ""}`}>
      <div className="px-5 pt-3 pb-2">
        <h3 className="text-base font-semibold text-foreground">Power</h3>
      </div>
      <div className="px-3 pb-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataWithTotal} margin={{ top: 6, right: 16, left: 8, bottom: 18 }} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148,163,184,0.35)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.35)" }}
              interval={0}
              minTickGap={16}
            />
            <YAxis
              domain={[0, 1.0] as any}
              ticks={[0.0, 0.5, 1.0]}
              tickFormatter={(v) => `${v.toFixed(1)} kW`}
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148,163,184,0.35)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.35)" }}
            />
            <Tooltip content={<PowerTooltip />} />

            {/* Stacked bars: yellow bottom, blue middle, cyan top (no inner gaps) */}
            <Bar dataKey="y" name="Yellow" stackId="p" fill={YELLOW} barSize={36} />
            <Bar dataKey="b" name="Blue" stackId="p" fill={BLUE} barSize={36} />
            <Bar dataKey="c" name="Cyan" stackId="p" fill={CYAN} barSize={36}>
              {/* Show total at the top of each stacked bar */}
              <LabelList
                dataKey="total"
                position="top"
                formatter={(label: React.ReactNode) =>
                  typeof label === 'number' ? `${(label as number).toFixed(2)} kW` : label
                }
                fill="var(--foreground)"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
