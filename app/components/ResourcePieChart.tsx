"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export type PieDatum = {
  name: string;
  value: number;
  color?: string;
};

export interface ResourcePieChartProps {
  title?: string;
  data?: PieDatum[];
  colors?: string[]; // Fallback palette
  size?: number; // Compact square size (width/height)
  className?: string; // Optional container class override (e.g., to align left)
}

const defaultData: PieDatum[] = [
  { name: "Water", value: 40, color: "#0ea5e9" },
  { name: "Energy", value: 25, color: "#f97316" },
  { name: "Chemicals", value: 20, color: "#22c55e" },
  { name: "Maintenance", value: 15, color: "#a855f7" },
];

const defaultColors = [
  "#0ea5e9",
  "#f59e0b",
  "#22c55e",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#38bdf8",
];

function getTotal(data: PieDatum[]) {
  return data.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
}

const RADIAN = Math.PI / 180;
const renderLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent } = props;
  const innerRadius = 0;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Place label comfortably inside
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show labels for slices with >=2% to avoid clutter
  if (percent * 100 < 2) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[10px] md:text-xs font-semibold drop-shadow"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function ResourcePieChart({
  title = "Resource Distribution",
  data = defaultData,
  colors = defaultColors,
  size = 280,
  className,
}: ResourcePieChartProps) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-[360px] ${className ?? "mx-auto"}`}>
      <div className="px-4 pt-3 pb-1">
        <h3 className="text-center text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center justify-center">
          {/* Chart Only (legend removed) */}
          <div style={{ width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={0}
                  outerRadius={Math.floor(size / 2) - 20}
                  paddingAngle={0}
                  labelLine={false}
                  isAnimationActive={false}
                  label={renderLabel}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || colors[index % colors.length]}
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  wrapperClassName="!bg-popover !text-popover-foreground"
                  contentStyle={{
                    background: "#0b1220",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
                    padding: 8,
                  }}
                  labelStyle={{ color: "#cbd5e1" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  formatter={(value: any, name: any) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Centered, responsive legend below the chart */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {data.map((d, i) => {
            const color = d.color || colors[i % colors.length];
            return (
              <div key={`legend-${i}`} className="flex items-center gap-2 text-sm">
                <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
