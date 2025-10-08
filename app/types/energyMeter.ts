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

export interface EnergyMeterCardProps {
  title: string;
  data: EnergyMeterData;
  meterId: "1" | "2" | "3";
  onExpand?: (id: "1" | "2" | "3") => void;
  showClose?: boolean;
  handlePumpControl: (meterId: "1" | "2" | "3", action: "start" | "stop" | "enable") => Promise<void>;
  // handlePumpControl: (id: "1" | "2" | "3", action: string) => void;
  handleTripToggle: (id: "1" | "2" | "3") => void;
  handleValveToggle: (id: "1" | "2" | "3") => void;
  setExpanded?: (id: "1" | "2" | "3" | null) => void;
}