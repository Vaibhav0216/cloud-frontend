"use client";

import React from "react";

export interface EnergyMeterData {
  valveStatus: string;
  lineVoltage: { ry: number; yb: number; rb: number };
  phaseVoltage: { r: number; y: number; b: number };
  current: { r: number; y: number; b: number };
  frequency: number;
  watt: number;
  runningTime: number;
  pumpStatus: string;
  tripStatus: string;
}


interface Props {
  data: EnergyMeterData;
  onExpand: () => void;
}

const statusClass = (val?: string) =>
  val === "ON" ? "text-green-600" : "text-red-600";

const EnergyMeterComponent: React.FC<Props> = ({ data, onExpand }) => {
  return (
    <div className="amset-card p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 w-full">
      {/* Data Grid */}
      <div className="space-y-4">
        {/* Line Voltage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Line Voltage</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">R-Y</div>
            <div className="text-lg font-bold text-foreground">{data.lineVoltage.ry} V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Y-B</div>
            <div className="text-lg font-bold text-foreground">{data.lineVoltage.yb} V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">R-B</div>
            <div className="text-lg font-bold text-foreground">{data.lineVoltage.rb} V</div>
          </div>
        </div>

        {/* Phase Voltage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Phase Voltage</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">R</div>
            <div className="text-lg font-bold text-foreground">{data.phaseVoltage.r} V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Y</div>
            <div className="text-lg font-bold text-foreground">{data.phaseVoltage.y} V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">B</div>
            <div className="text-lg font-bold text-foreground">{data.phaseVoltage.b} V</div>
          </div>
        </div>

        {/* Current */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Current</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">R</div>
            <div className="text-lg font-bold text-foreground">{data.current.r} A</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Y</div>
            <div className="text-lg font-bold text-foreground">{data.current.y} A</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">B</div>
            <div className="text-lg font-bold text-foreground">{data.current.b} A</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Metrics</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Watt</div>
            <div className="text-lg font-bold text-foreground">{data.watt} kW</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Running Time</div>
            <div className="text-lg font-bold text-foreground">{data.runningTime} min</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Frequency</div>
            <div className="text-lg font-bold text-foreground">{data.frequency} Hz</div>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Status</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Pump</div>
            <div className={`text-lg font-semibold ${statusClass(data.pumpStatus)}`}>{data.pumpStatus}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Trip</div>
            <div className={`text-lg font-semibold ${statusClass(data.tripStatus)}`}>{data.tripStatus}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Valve</div>
            <div className={`text-lg font-semibold ${statusClass(data.valveStatus)}`}>{data.valveStatus}</div>
          </div>
        </div>
      </div>

      {/* Expand Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onExpand}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          Expand
        </button>
      </div>
    </div>
  );
};

export default EnergyMeterComponent;
