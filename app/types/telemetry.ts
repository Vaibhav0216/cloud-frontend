export type EnergyMeter = {
  VLL: number;
  VN: number;
  R_I?: number;
  Y_I?: number;
  B_I?: number;
  AVG_I?: number;
  WATT: number;
  F: number;
};

export type Telemetry = {
  deviceId: string;
  EM_P1: EnergyMeter;
  EM_P2: EnergyMeter;
  EM_P3: EnergyMeter;
  // Optional additional telemetry
  FLOW_RATE?: number; // e.g., L/min or m3/hr depending on your unit
  PRESSURE?: number;  // e.g., bar or kPa
  PUMP_1?: boolean;
  PUMP_2?: boolean;
  VALVE_1?: boolean;
  VALVE_2?: boolean;
  BATTERY_VOLTAGE?: number; // V
  timestamp?: string; // ISO string
};
