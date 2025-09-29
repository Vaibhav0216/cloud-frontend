'use client';

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export type CombinedPoint = {
  time: string; // e.g., "08:00"
  flowRate: number; // L/min
  level: number; // %
  totalFlow: number; // L
};

interface CombinedTelemetryChartProps {
  data: CombinedPoint[];
  className?: string;
}

const COLORS = {
  flowRate: '#22c55e', // green
  level: '#3b82f6', // blue
  totalFlow: '#f59e0b', // orange
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg shadow-lg bg-gray-900 border border-gray-700 p-3 text-gray-100">
      <div className="text-xs font-medium mb-2 opacity-80">{label}</div>
      <div className="space-y-1 text-sm">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="opacity-80 min-w-[88px] capitalize">
              {p.name}
            </span>
            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CombinedTelemetryChart({ data, className }: CombinedTelemetryChartProps) {
  const [showFlow, setShowFlow] = useState(true);
  const [showLevel, setShowLevel] = useState(true);
  const [showTotal, setShowTotal] = useState(true);

  const anyVisible = showFlow || showLevel || showTotal;

  // Memoize domain calculations (optional, keeps axes nice when some series hidden)
  const leftDomain = useMemo(() => {
    const values: number[] = [];
    if (showFlow) values.push(...data.map(d => d.flowRate));
    if (showLevel) values.push(...data.map(d => d.level));
    if (values.length === 0) return [0, 'auto'] as const;
    return [Math.min(...values) * 0.9, Math.max(...values) * 1.1] as const;
  }, [data, showFlow, showLevel]);

  const rightDomain = useMemo(() => {
    if (!showTotal) return [0, 'auto'] as const;
    const vals = data.map(d => d.totalFlow);
    return [Math.min(...vals) * 0.98, Math.max(...vals) * 1.02] as const;
  }, [data, showTotal]);

  return (
    <div className={`amset-card bg-card border border-border rounded-xl p-4 md:p-6 ${className ?? ''}`}>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              domain={leftDomain as any}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              domain={rightDomain as any}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Conditionally render lines. Leaving chart with only grid if none visible */}
            {showFlow && (
              <Line
                type="monotone"
                dataKey="flowRate"
                name="Flow Rate (L/min)"
                yAxisId="left"
                stroke={COLORS.flowRate}
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            )}
            {showLevel && (
              <Line
                type="monotone"
                dataKey="level"
                name="Level (%)"
                yAxisId="left"
                stroke={COLORS.level}
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            )}
            {showTotal && (
              <Line
                type="monotone"
                dataKey="totalFlow"
                name="Total Flow (L)"
                yAxisId="right"
                stroke={COLORS.totalFlow}
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            )}

          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Visibility toggles */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setShowFlow(v => !v)}
          className={`px-3 py-1.5 rounded-md border transition select-none text-sm
            ${showFlow ? 'border-green-600 text-green-400 bg-green-600/10 hover:bg-green-600/20' : 'border-gray-700 text-gray-400 line-through opacity-60 hover:opacity-80'}`}
        >
          Flow Rate (L/min)
        </button>
        <button
          onClick={() => setShowLevel(v => !v)}
          className={`px-3 py-1.5 rounded-md border transition select-none text-sm
            ${showLevel ? 'border-blue-600 text-blue-400 bg-blue-600/10 hover:bg-blue-600/20' : 'border-gray-700 text-gray-400 line-through opacity-60 hover:opacity-80'}`}
        >
          Level (%)
        </button>
        <button
          onClick={() => setShowTotal(v => !v)}
          className={`px-3 py-1.5 rounded-md border transition select-none text-sm
            ${showTotal ? 'border-amber-500 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' : 'border-gray-700 text-gray-400 line-through opacity-60 hover:opacity-80'}`}
        >
          Total Flow (L)
        </button>
        {!anyVisible && (
          <span className="text-xs text-muted-foreground ml-1">All series hidden — showing empty grid.</span>
        )}
      </div>
    </div>
  );
}
