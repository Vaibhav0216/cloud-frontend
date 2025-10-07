export interface EnergyMeterData {
  lineVoltage: { ry: number; yb: number; rb: number };
  phaseVoltage: { r: number; y: number; b: number };
  current: { r: number; y: number; b: number };
  frequency: number;
  watt: number;
  runningTime: number;
  pumpStatus: "ON" | "OFF";
  tripStatus: "ON" | "OFF";
  valveStatus: "ON" | "OFF";
}