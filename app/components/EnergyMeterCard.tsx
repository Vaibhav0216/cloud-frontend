'use client';

import { EnergyMeterCardProps } from "../types/energyMeter.ts"

const EnergyMeterCard: React.FC<EnergyMeterCardProps> = ({
  title,
  data,
  meterId,
  onExpand,
  showClose,
  handlePumpControl,
  handleTripToggle,
  handleValveToggle,
  setExpanded,
}) => {
  console.log("Meter data:", data);
  return (
    <div className="amset-card p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Pop-up Icon */}
      {!showClose ? (
        <button
          onClick={() => onExpand?.(meterId)}
          className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      ) : (
        <button
          onClick={() => setExpanded?.(null)}
          className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Card Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>

      {/* Data Grid */}
      <div className="space-y-4">
        {/* Line Voltage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Line Voltage</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Red-Yellow Phase Voltage
            </div>
            <div className="text-lg font-bold text-foreground">
              {data.lineVoltage.ry}V
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Yellow-Blue Phase Voltage
            </div>
            <div className="text-lg font-bold text-foreground">
              {data.lineVoltage.yb}V
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Red-Blue Phase Voltage
            </div>
            <div className="text-lg font-bold text-foreground">
              {data.lineVoltage.rb}V
            </div>
          </div>
        </div>

        {/* Phase Voltage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Phase Voltage</div>
          {["r", "y", "b"].map((phase) => (
            <div key={phase} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                {phase === "r"
                  ? "Red"
                  : phase === "y"
                  ? "Yellow"
                  : "Blue"}{" "}
                Phase Voltage
              </div>
              <div className="text-lg font-bold text-foreground">
                {data.phaseVoltage[phase as "r" | "y" | "b"]}V
              </div>
            </div>
          ))}
        </div>

        {/* Current */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Current</div>
          {["r", "y", "b"].map((phase) => (
            <div key={phase} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                {phase === "r"
                  ? "Red"
                  : phase === "y"
                  ? "Yellow"
                  : "Blue"}{" "}
                Phase Current
              </div>
              <div className="text-lg font-bold text-foreground">
                {data.current[phase as "r" | "y" | "b"]}A
              </div>
            </div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Frequency</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Power in Watts
            </div>
            <div className="text-lg font-bold text-foreground">
              {data.watt} kW
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Running Time/min
            </div>
            <div className="text-lg font-bold text-foreground">
              {data.runningTime} min
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Frequency</div>
            <div className="text-lg font-bold text-foreground">
              {data.frequency} Hz
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Controls</div>

          <button
            onClick={() => handlePumpControl(meterId, "start")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Start
          </button>

          <button
            onClick={() => handlePumpControl(meterId, "stop")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Stop
          </button>

          <button
            onClick={() => handlePumpControl(meterId, "enable")}
            className={`${
              meterId === "1"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg`}
          >
            {meterId === "1" ? "Enable" : "Disable"}
          </button>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Status</div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => handleTripToggle(meterId)}
              className="flex items-center focus:outline-none"
            >
              <span
                className={`w-6 h-6 rounded-full ${
                  data.tripStatus === "ON" ? "bg-green-500" : "bg-red-500"
                } ring-2 ring-white/20 transition-colors`}
              ></span>
              <span className="ml-2 text-sm text-muted-foreground">
                Trip {data.tripStatus}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => handleValveToggle(meterId)}
              className="flex items-center focus:outline-none"
            >
              <span
                className={`w-6 h-6 rounded-full ${
                  data.valveStatus === "ON" ? "bg-green-500" : "bg-red-500"
                } ring-2 ring-white/20 transition-colors`}
              ></span>
              <span className="ml-2 text-sm text-muted-foreground">
                Valve {data.valveStatus}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() =>
                handlePumpControl(
                  meterId,
                  data.pumpStatus === "ON" ? "stop" : "start"
                )
              }
              className="flex items-center focus:outline-none"
            >
              <span
                className={`w-6 h-6 rounded-full ${
                  data.pumpStatus === "ON" ? "bg-green-500" : "bg-red-500"
                } ring-2 ring-white/20 transition-colors`}
              ></span>
              <span className="ml-2 text-sm text-muted-foreground">
                Pump {data.pumpStatus}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMeterCard;