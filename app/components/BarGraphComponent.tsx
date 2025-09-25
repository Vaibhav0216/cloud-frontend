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

export type BarGraphSeries = {
  key: string; // key in data array
  label: string; // legend label
  color?: string; // bar color
};

export interface BarGraphComponentProps {
  title?: string;
  data: Array<Record<string, any>>;
  series: BarGraphSeries[]; // one or more series
  height?: number; // chart height
  xKey?: string; // category key
  xLabel?: string;
  yLabel?: string;
  barSize?: number; // bar thickness
  className?: string; // wrapper class
}

const defaultHeight = 240; // compact

export default function BarGraphComponent({
  title = "Bar Graph",
  data,
  series,
  height = defaultHeight,
  xKey = "name",
  xLabel = "Years",
  yLabel = "Values",
  barSize = 14,
  className,
}: BarGraphComponentProps) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-[560px] ${className ?? ""}`}>
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-lg font-semibold text-foreground text-center md:text-left">{title}</h3>
      </div>
      <div className="px-3 pb-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 12, bottom: 24, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
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
            <Legend verticalAlign="top" align="right" wrapperStyle={{ color: "var(--foreground)", paddingBottom: 6 }} />

            {series.map((s, idx) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color || ["#60a5fa", "#f59e0b", "#22c55e", "#a78bfa"][idx % 4]}
                radius={[6, 6, 0, 0]}
                barSize={barSize}
                isAnimationActive={true}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
