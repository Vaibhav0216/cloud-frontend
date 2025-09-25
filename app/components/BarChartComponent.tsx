"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export type BarSeries = {
  key: string; // key in data objects
  label: string; // legend label
  color?: string; // bar color
};

export interface BarChartComponentProps {
  title?: string;
  data: Array<Record<string, any>>;
  series: BarSeries[]; // one or more series
  height?: number;
  xKey?: string; // typically the category name, default: "name"
  xLabel?: string; // e.g., Years
  yLabel?: string; // e.g., Values
  className?: string; // optional wrapper class
}

const defaultHeight = 300;

export default function BarChartComponent({
  title = "Yearly Totals",
  data,
  series,
  height = defaultHeight,
  xKey = "name",
  xLabel = "Years",
  yLabel = "Values",
  className,
}: BarChartComponentProps) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 w-full ${className ?? ""}`}>
      <div className="px-4 md:px-5 pt-3 md:pt-4 pb-1 md:pb-2">
        <h3 className="text-lg font-semibold text-foreground text-center md:text-left">{title}</h3>
      </div>
      <div
        className={`px-1 md:px-2 pb-3 md:pb-4 ${height ? '' : 'h-56 sm:h-64 md:h-72 lg:h-80'}`}
        style={height ? { height } : undefined}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
            <XAxis
              dataKey={xKey}
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148,163,184,0.35)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.35)" }}
              label={{ value: xLabel, position: "insideBottom", offset: -10, fill: "var(--foreground)", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148,163,184,0.35)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.35)" }}
              label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 10, fill: "var(--foreground)", fontSize: 12 }}
            />
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
            <Legend verticalAlign="top" align="right" wrapperStyle={{ color: "var(--foreground)", paddingBottom: 8 }} />

            {series.map((s, idx) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color || ["#38bdf8", "#f97316", "#22c55e", "#8b5cf6"][idx % 4]}
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                barSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
