
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import PumpControlCard from "./components/PumpControlCard";
import TelemetryChart from "./components/TelemetryChart";
import ResourcePieChart from "./components/ResourcePieChart";
import BarGraphComponent from "./components/BarGraphComponent";
import StackedPowerBar from "./components/StackedPowerBar";
import CombinedTelemetryChart from "./components/CombinedTelemetryChart";
import CustomMap from "./components/CustomMap";
import ProtectedRoute from "./components/ProtectedRoute";
import { useWebSocket } from "./contexts/WebSocketProvider";
import { useAuth } from "./contexts/AuthContext";
import {
  Droplets,
  Gauge,
  Zap,
  Activity,
  TrendingUp,
  Power,
  Play,
  Square,
  ToggleLeft,
  ToggleRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Maximize2
} from "lucide-react";
import { log } from "console";

// Device types

type DeviceAlert = {
  type: "critical" | "warning" | "info";
  message: string;
};

type Device = {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
  lastSeen: string;
  temperature: number;
  pressure: number;
  waterLevel: number;
  alerts: DeviceAlert[];
};
// Add this fetch function inside DashboardContent
const fetchLatestTelemetry = async () => {
  try {
    const token = localStorage.getItem("token"); // Assumes you stored token here
    if (!token) throw new Error("No token found");
    console.log("Fetching telemetry data with token:", token);
    const res = await fetch("https://nrj1481m2k.execute-api.ap-south-1.amazonaws.com/device/latest", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Keep capital A
      }
    });

    if (!res.ok) throw new Error("Failed to fetch telemetry data");

    const data = await res.json();
    console.log("Fetched telemetry data:", data);
    return data; // Assume this is an array of telemetry points
  } catch (err) {
    console.error("Error fetching telemetry:", err);
    return null;
  }
};

const vaibhav = await fetchLatestTelemetry();
const telemetry = vaibhav.data[0].telemetry;

// console.log("test ADD_LORA:", vaibhav.data[0].telemetry.ADD_LORA);
console.log("telemetry 123", telemetry.BATTERY_DINT_SLV, telemetry.BATTERY_REAL_SLV);



const mockDevices: Device[] = [
  {
    id: "28af4427-7e55-4c75-9f3a-99652ded4815",
    name: "Water Pump Station",
    type: "IoT Pump Controller",
    status: "online",
    lastSeen: "Just now",
    temperature: 40,
    pressure: 110,
    waterLevel: 78,
    alerts: []
  },
  {
    id: "device-2",
    name: "Pressure Sensor Beta",
    type: "Sensor",
    status: "online",
    lastSeen: "1 minute ago",
    temperature: 32.1,
    pressure: 142.3,
    waterLevel: 65.2,
    alerts: []
  },
  {
    id: "device-3",
    name: "Tank Monitor Gamma",
    type: "Monitor",
    status: "offline",
    lastSeen: "15 minutes ago",
    temperature: 28.7,
    pressure: 98.4,
    waterLevel: 45.8,
    alerts: [{ type: "critical", message: "Device offline - check connection" }]
  }
];

// Professional Energy Meter Data Types
type EnergyMeterData = {
  lineVoltage: {
    ry: number;
    yb: number;
    rb: number;
  };
  phaseVoltage: {
    r: number;
    y: number;
    b: number;
  };
  current: {
    r: number;
    y: number;
    b: number;
  };
  frequency: number;
  watt: number;
  runningTime: number;
  pumpStatus: 'ON' | 'OFF';
  tripStatus: 'ON' | 'OFF';
  valveStatus: 'ON' | 'OFF';

};
// Professional Energy Meter Section Component
function EnergyMeterSection() {
  const [energyMeter1, setEnergyMeter1] = useState<EnergyMeterData>({
    lineVoltage: {
      ry: telemetry.EM_P1_RY,
      yb: telemetry.EM_P1_YB,
      rb: telemetry.EM_P1_RB,
    },
    phaseVoltage: {
      r: telemetry.EM_P1_RN,
      y: telemetry.EM_P1_YN,
      b: telemetry.EM_P1_BN,
    },
    current: {
      r: telemetry.EM_P1_R_I,
      y: telemetry.EM_P1_Y_I,
      b: telemetry.EM_P1_B_I,
    },
    frequency: telemetry.EM_P1_F,
    watt: telemetry.EM_P1_WATT,
    runningTime: telemetry.runningTime || 0,
    pumpStatus: telemetry.Pump_1_ON ? "ON" : "OFF",
    tripStatus: telemetry.Pump_1_TRIP ? "ON" : "OFF",
    valveStatus: telemetry.VALVE_1_OPN_CLS ? "ON" : "OFF",
    
  });

  // Expanded card state (modal-style)
  const [expanded, setExpanded] = useState<'1' | '2' | '3' | null>(null);

  // Helper function to generate EnergyMeterData dynamically
  const createEnergyMeterData = (pumpNumber: 2 | 3): EnergyMeterData => {
    return {
      lineVoltage: {
        ry: telemetry[`EM_P${pumpNumber}_RY`],
        yb: telemetry[`EM_P${pumpNumber}_YB`],
        rb: telemetry[`EM_P${pumpNumber}_RB`],
      },
      phaseVoltage: {
        r: telemetry[`EM_P${pumpNumber}_RN`],
        y: telemetry[`EM_P${pumpNumber}_YN`],
        b: telemetry[`EM_P${pumpNumber}_BN`],
      },
      current: {
        r: telemetry[`EM_P${pumpNumber}_R_I`],
        y: telemetry[`EM_P${pumpNumber}_Y_I`],
        b: telemetry[`EM_P${pumpNumber}_B_I`],
      },
      frequency: telemetry[`EM_P${pumpNumber}_F`],
      watt: telemetry[`EM_P${pumpNumber}_WATT`],
      runningTime: telemetry.runningTime || 0,
      pumpStatus: telemetry[`Pump_${pumpNumber}_ON`] ? "ON" : "OFF",
      tripStatus: telemetry[`Pump_${pumpNumber}_TRIP`] ? "ON" : "OFF",
      valveStatus: telemetry[`VALVE_${pumpNumber}_OPN_CLS`] ? "ON" : "OFF",
    };
  };
  
// Usage
const [energyMeter2, setEnergyMeter2] = useState<EnergyMeterData>(createEnergyMeterData(2));
const [energyMeter3, setEnergyMeter3] = useState<EnergyMeterData>(createEnergyMeterData(3));
  // const [energyMeter2, setEnergyMeter2] = useState<EnergyMeterData>({
  //   lineVoltage: {
  //     ry: vrushali.EM_P2_RY,
  //     yb: vrushali.EM_P2_YB,
  //     rb: vrushali.EM_P2_RB,
  //   },
  //   phaseVoltage: {
  //     r: vrushali.EM_P2_RN,
  //     y: vrushali.EM_P2_YN,
  //     b: vrushali.EM_P2_BN,
  //   },
  //   current: {
  //     r: vrushali.EM_P2_R_I,
  //     y: vrushali.EM_P2_Y_I,
  //     b: vrushali.EM_P2_B_I,
  //   },
  //   frequency: vrushali.EM_P2_F,
  //   watt: vrushali.EM_P2_WATT,
  //   runningTime: vrushali.runningTime || 0,
  //   pumpStatus: vrushali.Pump_2_ON ? "ON" : "OFF",
  //   tripStatus: vrushali.Pump_2_TRIP ? "ON" : "OFF",
  //   valveStatus: vrushali.VALVE_2_OPN_CLS ? "ON" : "OFF",
    
  // });

  // const [energyMeter3, setEnergyMeter3] = useState<EnergyMeterData>({
  //   lineVoltage: {
  //     ry: vrushali.EM_P3_RY,
  //     yb: vrushali.EM_P3_YB,
  //     rb: vrushali.EM_P3_RB,
  //   },
  //   phaseVoltage: {
  //     r: vrushali.EM_P3_RN,
  //     y: vrushali.EM_P3_YN,
  //     b: vrushali.EM_P3_BN,
  //   },
  //   current: {
  //     r: vrushali.EM_P3_R_I,
  //     y: vrushali.EM_P3_Y_I,
  //     b: vrushali.EM_P3_B_I,
  //   },
  //   frequency: vrushali.EM_P3_F,
  //   watt: vrushali.EM_P3_WATT,
  //   runningTime: vrushali.runningTime || 0,
  //   pumpStatus: vrushali.Pump_3_ON ? "ON" : "OFF",
  //   tripStatus: vrushali.Pump_3_TRIP ? "ON" : "OFF",
  //   valveStatus: vrushali.VALVE_3_OPN_CLS ? "ON" : "OFF",
    
  // });

  // Control Handlers
  const handlePumpControl = async (meterId: '1' | '2' | '3', action: 'start' | 'stop' | 'enable') => {
    try {
      // console.log(` ${action.toUpperCase()} button clicked for Meter ${meterId}, Action: ${action}`);
      // const token = localStorage.getItem("token");
      // if (!token) throw new Error("No token found");

      // const response = await fetch(`/api/energy-meter-${meterId}/control`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ action })
      // });

      // if (!response.ok) throw new Error(`Failed to ${action} pump`);
      // console.log(`Pump ${meterId} ${action} request sent successfully`);
      // Update local state with optimistic updates
      if (meterId === '1') {

        setEnergyMeter1(prev => ({
          ...prev,
          pumpStatus: action === 'start' ? 'ON' : action === 'stop' ? 'OFF' : prev.pumpStatus
        }));
      } else if (meterId === '2') {
        setEnergyMeter2(prev => ({
          ...prev,
          pumpStatus: action === 'start' ? 'ON' : action === 'stop' ? 'OFF' : prev.pumpStatus
        }));
      } else {
        setEnergyMeter3(prev => ({
          ...prev,
          pumpStatus: action === 'start' ? 'ON' : action === 'stop' ? 'OFF' : prev.pumpStatus
        }));
      }
    } catch (err) {
      console.error(`Error controlling pump ${meterId}:`, err);
    }
  };

  const handleTripToggle = async (meterId: '1' | '2' | '3') => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const currentStatus = meterId === '1' ? energyMeter1.tripStatus : meterId === '2' ? energyMeter2.tripStatus : energyMeter3.tripStatus;
      const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';

      const response = await fetch(`/api/energy-meter-${meterId}/trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to toggle trip");

      // Update local state
      if (meterId === '1') {
        setEnergyMeter1(prev => ({ ...prev, tripStatus: newStatus }));
      } else if (meterId === '2') {
        setEnergyMeter2(prev => ({ ...prev, tripStatus: newStatus }));
      } else {
        setEnergyMeter3(prev => ({ ...prev, tripStatus: newStatus }));
      }
    } catch (err) {
      console.error(`Error toggling trip ${meterId}:`, err);
    }
  };

  const handleValveToggle = async (meterId: '1' | '2' | '3') => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const currentStatus = meterId === '1' ? energyMeter1.valveStatus : meterId === '2' ? energyMeter2.valveStatus : energyMeter3.valveStatus;
      const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';

      const response = await fetch(`/api/energy-meter-${meterId}/valve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to toggle valve");

      // Update local state
      if (meterId === '1') {
        setEnergyMeter1(prev => ({ ...prev, valveStatus: newStatus }));
      } else if (meterId === '2') {
        setEnergyMeter2(prev => ({ ...prev, valveStatus: newStatus }));
      } else {
        setEnergyMeter3(prev => ({ ...prev, valveStatus: newStatus }));
      }
    } catch (err) {
      console.error(`Error toggling valve ${meterId}:`, err);
    }
  };

  // Professional Energy Meter Card Component
  const EnergyMeterCard = ({
    title,
    data,
    meterId,
    onExpand,
    showClose
  }: {
    title: string;
    data: EnergyMeterData;
    meterId: '1' | '2' | '3';
    onExpand?: (id: '1' | '2' | '3') => void;
    showClose?: boolean;
  }) => (
    <div className="amset-card p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Pop-up Icon */}
      {!showClose ? (
        <button onClick={() => onExpand?.(meterId)} className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      ) : (
        <button onClick={() => setExpanded(null)} className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-lg transition-colors" aria-label="Close">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Card Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>

      {/* Data Grid - Responsive Layout */}
      <div className="space-y-4">
        {/* Line Voltage Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Line Voltage</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Red-Yellow Phase Voltage</div>
            <div className="text-lg font-bold text-foreground">{data.lineVoltage.ry}V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Yellow-Blue Phase Voltage</div>
            <div className="text-lg font-bold text-foreground">{data.lineVoltage.yb}V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Red-Blue Phase Voltage</div>
            <div className="text-lg font-bold text-foreground">{data.lineVoltage.rb}V</div>
          </div>
        </div>

        {/* Phase Voltage Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Phase Voltage</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Red Phase Voltage</div>
            <div className="text-lg font-bold text-foreground">{data.phaseVoltage.r}V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Yellow Phase Voltage</div>
            <div className="text-lg font-bold text-foreground">{data.phaseVoltage.y}V</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Blue Phase Voltage</div>
            <div className="text-lg font-bold text-foreground">{data.phaseVoltage.b}V</div>
          </div>
        </div>

        {/* Current Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Current</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Red Phase Current</div>
            <div className="text-lg font-bold text-foreground">{data.current.r}A</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Yellow Phase Current</div>
            <div className="text-lg font-bold text-foreground">{data.current.y}A</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Blue Phase Current</div>
            <div className="text-lg font-bold text-foreground">{data.current.b}A</div>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Frequency</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Power in Watts</div>
            <div className="text-lg font-bold text-foreground">{data.watt} kW</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Running Time/min</div>
            <div className="text-lg font-bold text-foreground">{data.runningTime} min</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Frequency</div>
            <div className="text-lg font-bold text-foreground">{data.frequency} Hz</div>
          </div>
        </div>

        {/* Control Buttons Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Controls</div>

          {/* Start Button */}
          <button
            onClick={() => handlePumpControl(meterId, 'start')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Start
          </button>

          {/* Stop Button */}
          <button
            onClick={() => handlePumpControl(meterId, 'stop')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Stop
          </button>

          {/* Enable/Disable Button (Meter 1: Enable, Meter 2/3: Disable) */}
          <button
            onClick={() => handlePumpControl(meterId, 'enable')}
            className={`${meterId === '1' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg`}
          >
            {meterId === '1' ? 'Enable' : 'Disable'}
          </button>
        </div>

        {/* Toggle Controls Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-muted-foreground font-medium">Status</div>

          {/* Trip Indicator (clickable) */}
          <div className="flex items-center justify-center">
            <button onClick={() => handleTripToggle(meterId)} className="flex items-center focus:outline-none">
              <span className={`w-6 h-6 rounded-full ${data.tripStatus === 'ON' ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white/20 transition-colors`}></span>
              <span className="ml-2 text-sm text-muted-foreground">Trip {data.tripStatus}</span>
            </button>
          </div>

          {/* Valve Indicator (clickable) */}
          <div className="flex items-center justify-center">
            <button onClick={() => handleValveToggle(meterId)} className="flex items-center focus:outline-none">
              <span className={`w-6 h-6 rounded-full ${data.valveStatus === 'ON' ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white/20 transition-colors`}></span>
              <span className="ml-2 text-sm text-muted-foreground">Valve {data.valveStatus}</span>
            </button>
          </div>

          {/* Pump Status Indicator (clickable, same size as others) */}
          <div className="flex items-center justify-center">
            <button onClick={() => handlePumpControl(meterId, data.pumpStatus === 'ON' ? 'stop' : 'start')} className="flex items-center focus:outline-none">
              <span className={`w-6 h-6 rounded-full ${data.pumpStatus === 'ON' ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white/20 transition-colors`}></span>
              <span className="ml-2 text-sm text-muted-foreground">Pump {data.pumpStatus}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        {/* <h2 className="text-2xl font-bold text-foreground">Energy Monitoring</h2> */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {/* <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> */}
          {/* <span>Live Data</span> */}
        </div>
      </div>

      {/* Filter Tank Components - horizontal responsive row */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 ">
          {/* Filter Tank Level */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-blue-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3v10c0 1.657-3.582 3-8 3s-8-1.343-8-3V7z" /><path d="M4 11c0 1.657 3.582 3 8 3s8-1.343 8-3" /></svg>
            <p className="text-sm text-gray-600 font-medium">Filter Tank Level</p>
            <div className="text-3xl font-bold text-blue-600">79 %</div>
          </div>
          {/* Battery Voltage Bund Pump */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-green-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="11" rx="2" /><path d="M7 7V4h10v3" /></svg>
            <p className="text-sm text-gray-600 font-medium">Battery Voltage Bund Pump</p>
            <div className="text-2xl font-bold text-green-600">24.59 V.DC</div>
          </div>
          {/* Flow Rate */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-blue-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16" /><path d="M4 12c4-6 12-6 16 0" /></svg>
            <p className="text-sm text-gray-600 font-medium">Flow rate</p>
            <div className="text-2xl font-bold text-blue-600">0 m³/hr</div>
          </div>
          {/* Level Set Low */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-orange-500 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-6" /></svg>
            <p className="text-sm text-gray-600 font-medium">Level Set Low</p>
            <div className="text-2xl font-bold text-orange-500">80 %</div>
          </div>
          {/* Level High Set */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-red-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18" /><path d="M21 3L3 21" /></svg>
            <p className="text-sm text-gray-600 font-medium">Level High Set</p>
            <div className="text-2xl font-bold text-red-600">98 %</div>
          </div>
          {/* Daily Consumption */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-red-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l3-3 4 4 3-3" /></svg>
            <p className="text-sm text-gray-600 font-medium">Daily Consumption</p>
            <div className="text-2xl font-bold text-red-600">821520 ltrs</div>
          </div>
          {/* Battery Voltage Filter House */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-green-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="11" rx="2" /><path d="M7 7V4h10v3" /></svg>
            <p className="text-sm text-gray-600 font-medium">Battery Voltage Filter House</p>
            <div className="text-2xl font-bold text-green-600">25.71 V.DC</div>
          </div>
          {/* Auto Manual */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 min-h-[180px] min-w-[160px] flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
            <svg className="w-12 h-12 text-green-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4-7 4 2.5-7L2 9h7z" /></svg>
            <p className="text-sm text-gray-600 font-medium">Auto Manual</p>
            <div className="text-2xl font-bold text-green-600">Auto</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <EnergyMeterCard
          title="Energy Meter 1"
          data={energyMeter1}
          meterId="1"
          onExpand={(id) => setExpanded(id)}
        />
        <EnergyMeterCard
          title="Energy Meter 2"
          data={energyMeter2}
          meterId="2"
          onExpand={(id) => setExpanded(id)}
        />
        {/* Meter 3 directly below Meter 1 on desktop, stacked on mobile */}
        <EnergyMeterCard
          title="Energy Meter 3"
          data={energyMeter3}
          meterId="3"
          onExpand={(id) => setExpanded(id)}
        />
      </div>

      {/* Expanded modal view */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-6xl">
            {expanded === '1' && (
              <EnergyMeterCard title="Energy Meter 1" data={energyMeter1} meterId="1" showClose />
            )}
            {expanded === '2' && (
              <EnergyMeterCard title="Energy Meter 2" data={energyMeter2} meterId="2" showClose />
            )}
            {expanded === '3' && (
              <EnergyMeterCard title="Energy Meter 3" data={energyMeter3} meterId="3" showClose />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Operations Grid Section (cards + fullscreen modal)
function DashboardGridSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const Card = ({ id, title, children, showExpand = true }: { id: string; title: string; children: React.ReactNode; showExpand?: boolean }) => (
    <div className="relative rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 p-3 md:p-4">
      {showExpand && (
        <button aria-label="Expand" onClick={() => setExpandedCard(id)} className="absolute top-2 left-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V4h4M4 4l6 6M20 16v4h-4m4 0l-6-6" /></svg>
        </button>
      )}
      <div className={showExpand ? "pl-7" : "pl-0"}>
        <h3 className="text-base font-semibold text-foreground mb-2 text-center">{title}</h3>
        {children}
      </div>
    </div>
  );

  const Tank = ({ percent }: { percent: number }) => (
    <div className="flex items-center justify-center">
      <div className="relative w-28 h-36 md:w-32 md:h-40">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          <defs>
            <clipPath id="tank-clip">
              <rect x="15" y="20" width="70" height="80" rx="35" ry="8" />
            </clipPath>
          </defs>
          {/* Tank outline - cylinder shape */}
          <rect
            x="15"
            y="20"
            width="70"
            height="80"
            rx="35"
            ry="8"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          {/* Top ellipse */}
          <ellipse
            cx="50"
            cy="20"
            rx="35"
            ry="8"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          {/* Water fill */}
          <g clipPath="url(#tank-clip)">
            <rect
              x="15"
              y={100 - (percent / 100) * 80}
              width="70"
              height={(percent / 100) * 80}
              fill="#3B82F6"
              opacity="0.8"
            />
          </g>
          {/* Water surface ellipse */}
          {percent > 0 && (
            <ellipse
              cx="50"
              cy={100 - (percent / 100) * 80}
              rx="35"
              ry="8"
              fill="#3B82F6"
              opacity="0.9"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-2 py-1 text-sm md:text-base font-bold text-gray-800 bg-white/90 rounded-md border border-gray-300 shadow-sm">{percent}%</span>
        </div>
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-muted'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );

  const ActionButton = ({ color, children, onClick }: { color: 'green' | 'red'; children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} className={`${color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] shadow-md`}>{children}</button>
  );

  const StatusDot = ({ on }: { on: boolean }) => (
    <span className={`w-6 h-6 md:w-7 md:h-7 rounded-full ${on ? 'bg-green-500' : 'bg-red-500'} inline-block shadow`} />
  );

  // local demo state
  const [ugLevel, setUgLevel] = useState(100);
  const [ohLevel, setOhLevel] = useState(100);
  const [flow, setFlow] = useState(0);
  const [tds] = useState(65039);
  const [consumption] = useState(102);
  const [bpAuto, setBpAuto] = useState(false);
  const [ohpAuto, setOhpAuto] = useState(false);
  const [valveAuto, setValveAuto] = useState(false);
  const [bpRunning, setBpRunning] = useState(false);
  const [ohpRunning, setOhpRunning] = useState(false);
  const [valveOpen, setValveOpen] = useState(false);
  const [mainsOff] = useState(true);
  const [ugNormal] = useState(true);
  const [ohNormal] = useState(true);

  const ScheduleRow = ({ label }: { label: string }) => (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-3 text-sm md:text-base">{label}</div>
      <div className="col-span-2 flex justify-center"><Toggle checked={false} onChange={() => { }} /></div>
      <div className="col-span-3"><input className="w-full bg-muted text-foreground rounded-md px-3 py-2 text-sm text-center" defaultValue="12:00:00 AM" /></div>
      <div className="col-span-3"><input className="w-full bg-muted text-foreground rounded-md px-3 py-2 text-sm text-center" defaultValue="12:00:00 AM" /></div>
      <div className="col-span-1 flex justify-center"><StatusDot on={false} /></div>
    </div>
  );

  return (
    <div className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card id="ug" title="Under Ground" showExpand={false}>
          <Tank percent={ugLevel} />
        </Card>
        <Card id="oh" title="Over Head" showExpand={false}>
          <Tank percent={ohLevel} />
        </Card>
        <Card id="flow" title="Flow Meter" showExpand={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M3 12c4-6 14-6 18 0" /></svg>
              <div className="text-xl font-bold">{flow} m³/hr</div>
            </div>
          </div>
        </Card>
        <Card id="tds" title="TDS Value" showExpand={false}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l8 8 8-8" /><path d="M4 12l8 8 8-8" /></svg>
            <div className="text-xl font-bold text-red-500">{tds} mg/L</div>
          </div>
        </Card>
        <Card id="cons" title="Daily Consumption" showExpand={false}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l3-3 4 4 3-3" /></svg>
            <div className="text-xl font-bold">{consumption} m³</div>
          </div>
        </Card>
        <Card id="bp" title="BORING PUMP">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3"><span className="text-sm">Pump Status</span><StatusDot on={bpRunning} /></div>
            <div className="flex items-center justify-center gap-4"><span>Manual</span><Toggle checked={bpAuto} onChange={() => setBpAuto(v => !v)} /><span>Auto</span></div>
            <div className="flex items-center justify-center gap-4">
              <ActionButton color="green" onClick={() => setBpRunning(true)}>START</ActionButton>
              <ActionButton color="red" onClick={() => setBpRunning(false)}>STOP</ActionButton>
            </div>
          </div>
        </Card>
        <Card id="ohp" title="OH PUMP">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3"><span className="text-sm">Pump Status</span><StatusDot on={ohpRunning} /></div>
            <div className="flex items-center justify-center gap-4"><span>Manual</span><Toggle checked={ohpAuto} onChange={() => setOhpAuto(v => !v)} /><span>Auto</span></div>
            <div className="flex items-center justify-center gap-4">
              <ActionButton color="green" onClick={() => setOhpRunning(true)}>START</ActionButton>
              <ActionButton color="red" onClick={() => setOhpRunning(false)}>STOP</ActionButton>
            </div>
          </div>
        </Card>
        <Card id="valve" title="Valve OH">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3"><span className="text-sm">Valve Status</span><StatusDot on={valveOpen} /></div>
            <div className="flex items-center justify-center gap-4"><span>Manual</span><Toggle checked={valveAuto} onChange={() => setValveAuto(v => !v)} /><span>Auto</span></div>
            <div className="flex items-center justify-center gap-4">
              <ActionButton color="red" onClick={() => setValveOpen(false)}>Close</ActionButton>
              <ActionButton color="green" onClick={() => setValveOpen(true)}>Open</ActionButton>
            </div>
          </div>
        </Card>
        <Card id="power" title="Power Status">
          <div className="space-y-4 text-base">
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span>Mains Off</span><StatusDot on={!mainsOff ? true : false} /></div>
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span>UG Normal</span><StatusDot on={ugNormal} /></div>
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span>OH Normal</span><StatusDot on={ohNormal} /></div>
          </div>
        </Card>
        <Card id="schedule" title="Schedule">
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground">
              <div className="col-span-3">Slot</div>
              <div className="col-span-2 text-center">Enable</div>
              <div className="col-span-3 text-center">Start Time</div>
              <div className="col-span-3 text-center">End Time</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
            {['Schedule 1', 'Schedule 2', 'Schedule 3', 'Schedule 4', 'BP Schedule 1', 'BP Schedule 2'].map(s => (
              <ScheduleRow key={s} label={s} />
            ))}
            <div className="pt-2"><button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">Submit</button></div>
          </div>
        </Card>
      </div>

      {expandedCard && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="relative rounded-2xl bg-card border border-border shadow-lg p-6">
              <button aria-label="Close" onClick={() => setExpandedCard(null)} className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              {/* Render the selected card content again in large view */}
              {expandedCard === 'ug' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Under Ground</h3>
                  <Tank percent={ugLevel} />
                </div>
              )}
              {expandedCard === 'oh' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Over Head</h3>
                  <Tank percent={ohLevel} />
                </div>
              )}
              {expandedCard === 'flow' && (
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M3 12c4-6 14-6 18 0" /></svg>
                  <div className="text-4xl font-bold">{flow} m³/hr</div>
                </div>
              )}
              {expandedCard === 'tds' && (
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l8 8 8-8" /><path d="M4 12l8 8 8-8" /></svg>
                  <div className="text-4xl font-bold text-red-500">{tds} mg/L</div>
                </div>
              )}
              {expandedCard === 'cons' && (
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l3-3 4 4 3-3" /></svg>
                  <div className="text-4xl font-bold">{consumption} m³</div>
                </div>
              )}
              {expandedCard === 'bp' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">BORING PUMP</h3>
                  <div className="flex items-center gap-3"><span className="text-sm">Pump Status</span><StatusDot on={bpRunning} /></div>
                  <div className="flex items-center gap-4"><span>Manual</span><Toggle checked={bpAuto} onChange={() => setBpAuto(v => !v)} /><span>Auto</span></div>
                  <div className="flex items-center gap-4">
                    <ActionButton color="green" onClick={() => setBpRunning(true)}>START</ActionButton>
                    <ActionButton color="red" onClick={() => setBpRunning(false)}>STOP</ActionButton>
                  </div>
                </div>
              )}
              {expandedCard === 'ohp' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">OH PUMP</h3>
                  <div className="flex items-center gap-3"><span className="text-sm">Pump Status</span><StatusDot on={ohpRunning} /></div>
                  <div className="flex items-center gap-4"><span>Manual</span><Toggle checked={ohpAuto} onChange={() => setOhpAuto(v => !v)} /><span>Auto</span></div>
                  <div className="flex items-center gap-4">
                    <ActionButton color="green" onClick={() => setOhpRunning(true)}>START</ActionButton>
                    <ActionButton color="red" onClick={() => setOhpRunning(false)}>STOP</ActionButton>
                  </div>
                </div>
              )}
              {expandedCard === 'valve' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Valve OH</h3>
                  <div className="flex items-center gap-3"><span className="text-sm">Valve Status</span><StatusDot on={valveOpen} /></div>
                  <div className="flex items-center gap-4"><span>Manual</span><Toggle checked={valveAuto} onChange={() => setValveAuto(v => !v)} /><span>Auto</span></div>
                  <div className="flex items-center gap-4">
                    <ActionButton color="red" onClick={() => setValveOpen(false)}>Close</ActionButton>
                    <ActionButton color="green" onClick={() => setValveOpen(true)}>Open</ActionButton>
                  </div>
                </div>
              )}
              {expandedCard === 'power' && (
                <div className="space-y-4 text-lg">
                  <h3 className="text-xl font-semibold">Power Status</h3>
                  <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span>Mains Off</span><StatusDot on={!mainsOff ? true : false} /></div>
                  <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span>UG Normal</span><StatusDot on={ugNormal} /></div>
                  <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span>OH Normal</span><StatusDot on={ohNormal} /></div>
                </div>
              )}
              {expandedCard === 'schedule' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Schedule</h3>
                  {['Schedule 1', 'Schedule 2', 'Schedule 3', 'Schedule 4', 'BP Schedule 1', 'BP Schedule 2'].map(s => (
                    <ScheduleRow key={s} label={s} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modern Water Management Section with Dark Theme
function WaterManagementSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Demo state
  const [ugLevel, setUgLevel] = useState(100);
  const [ohLevel, setOhLevel] = useState(100);
  const [flow] = useState(0);
  const [tds] = useState(65039);
  const [consumption] = useState(102);

  const [bpAuto, setBpAuto] = useState(true);
  const [ohpAuto, setOhpAuto] = useState(true);
  const [valveAuto, setValveAuto] = useState(true);

  const [bpRunning, setBpRunning] = useState(false);
  const [ohpRunning, setOhpRunning] = useState(false);
  const [valveOpen, setValveOpen] = useState(false);

  const [mainsOff] = useState(true);
  const [ugNormal] = useState(true);
  const [ohNormal] = useState(true);

  type ScheduleRowType = { label: string; enabled: boolean; start: string; end: string; status: boolean };
  const [schedule, setSchedule] = useState<ScheduleRowType[]>([
    { label: 'Schedule 1', enabled: false, start: '06:00:00 AM', end: '07:30:00 AM', status: false },
    { label: 'Schedule 2', enabled: false, start: '04:00:00 PM', end: '05:00:00 PM', status: false },
    { label: 'Schedule 3', enabled: false, start: '12:00:00 AM', end: '12:00:00 AM', status: false },
    { label: 'Schedule 4', enabled: false, start: '12:00:00 AM', end: '12:00:00 AM', status: false },
    { label: 'BP Schedule 1', enabled: false, start: '12:00:00 AM', end: '12:00:00 AM', status: false },
    { label: 'BP Schedule 2', enabled: false, start: '12:00:00 AM', end: '12:00:00 AM', status: false },
  ]);

  // Modern UI Components
  const ExpandButton = ({ onClick }: { onClick: () => void }) => (
    <button
      aria-label="Expand"
      onClick={onClick}
      className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 8V4h4M4 4l6 6M20 16v4h-4m4 0l-6-6" />
      </svg>
    </button>
  );

  const CardShell = ({ id, title, children, icon, showExpand = true }: { id: string; title: string; children: React.ReactNode; icon?: React.ReactNode; showExpand?: boolean }) => (
    <div className="relative rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 p-4 group">
      {showExpand && <ExpandButton onClick={() => setExpanded(id)} />}
      <div className="flex items-center justify-center gap-2 mb-3">
        {icon && <div className="text-blue-500">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground text-center">{title}</h3>
      </div>
      {children}
    </div>
  );

  const StatusIndicator = ({ status, label }: { status: boolean; label?: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );

  const ModernToggle = ({ checked, onChange, labels }: { checked: boolean; onChange: () => void; labels?: [string, string] }) => (
    <div className="flex items-center gap-2">
      {labels && <span className="text-sm text-muted-foreground">{labels[0]}</span>}
      <button
        onClick={onChange}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 ${checked ? 'bg-green-600' : 'bg-muted'
          }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'
          }`} />
      </button>
      {labels && <span className="text-sm text-muted-foreground">{labels[1]}</span>}
    </div>
  );

  const ActionButton = ({
    variant,
    children,
    onClick,
    icon
  }: {
    variant: 'start' | 'stop' | 'open' | 'close';
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
  }) => {
    const isPositive = variant === 'start' || variant === 'open';
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md ${isPositive
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
      >
        {icon}
        {children}
      </button>
    );
  };

  // Modern Subcomponents
  const TankLevel = ({ percent }: { percent: number }) => (
    <div className="flex items-center justify-center">
      <div className="relative w-24 h-32">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          <defs>
            <clipPath id="tank-clip-modern">
              <rect x="15" y="20" width="70" height="80" rx="35" ry="8" />
            </clipPath>
          </defs>
          {/* Tank outline - cylinder shape */}
          <rect
            x="15"
            y="20"
            width="70"
            height="80"
            rx="35"
            ry="8"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          {/* Top ellipse */}
          <ellipse
            cx="50"
            cy="20"
            rx="35"
            ry="8"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          {/* Water fill */}
          <g clipPath="url(#tank-clip-modern)">
            <rect
              x="15"
              y={100 - (percent / 100) * 80}
              width="70"
              height={(percent / 100) * 80}
              fill="#3B82F6"
              opacity="0.8"
            />
          </g>
          {/* Water surface ellipse */}
          {percent > 0 && (
            <ellipse
              cx="50"
              cy={100 - (percent / 100) * 80}
              rx="35"
              ry="8"
              fill="#3B82F6"
              opacity="0.9"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-2 py-0.5 text-base font-bold text-gray-800 bg-white/90 rounded-md border border-gray-300 shadow-sm">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );

  const MetricDisplay = ({ icon, value, unit, color, label }: {
    icon: React.ReactNode;
    value: string | number;
    unit?: string;
    color?: string;
    label?: string;
  }) => (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-muted/50">
        {icon}
      </div>
      <div>
        {label && <p className="text-sm text-muted-foreground mb-1">{label}</p>}
        <div className={`text-xl font-bold ${color || 'text-foreground'}`}>
          {value}{unit ? ` ${unit}` : ''}
        </div>
      </div>
    </div>
  );

  const ControlPanel = ({
    title,
    running,
    auto,
    onStart,
    onStop,
    onToggleAuto,
    icon
  }: {
    title: string;
    running: boolean;
    auto: boolean;
    onStart: () => void;
    onStop: () => void;
    onToggleAuto: () => void;
    icon?: React.ReactNode;
  }) => (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-2">
        {icon && <div className="text-blue-500">{icon}</div>}
        <span className="text-sm font-medium text-muted-foreground">{title} Status</span>
        <StatusIndicator status={running} />
      </div>

      <div className="flex justify-center">
        <ModernToggle
          checked={auto}
          onChange={onToggleAuto}
          labels={['Manual', 'Auto']}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="start"
          onClick={onStart}
          icon={<Play className="w-4 h-4" />}
        >
          START
        </ActionButton>
        <ActionButton
          variant="stop"
          onClick={onStop}
          icon={<Square className="w-4 h-4" />}
        >
          STOP
        </ActionButton>
      </div>
    </div>
  );

  const PowerStatus = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Mains</span>
        </div>
        <StatusIndicator status={!mainsOff} />
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">UG Normal</span>
        </div>
        <StatusIndicator status={ugNormal} />
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">OH Normal</span>
        </div>
        <StatusIndicator status={ohNormal} />
      </div>
    </div>
  );

  const ScheduleTable = () => (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 text-xs md:text-sm font-medium text-muted-foreground border-b border-border pb-1">
        <div className="col-span-3">Slot</div>
        <div className="col-span-2 text-center">Enable</div>
        <div className="col-span-3 text-center">Start Time</div>
        <div className="col-span-3 text-center">End Time</div>
        <div className="col-span-1 text-center">Status</div>
      </div>

      {/* Schedule Rows */}
      {schedule.map((row, idx) => (
        <div key={row.label} className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/20 rounded-lg border border-border/50">
          <div className="col-span-3 text-sm font-medium">{row.label}</div>
          <div className="col-span-2 flex justify-center">
            <ModernToggle
              checked={row.enabled}
              onChange={() => setSchedule(s => s.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r))}
            />
          </div>
          <div className="col-span-3">
            <input
              className="w-full bg-background text-foreground rounded-md px-2 py-1.5 text-sm border border-border focus:border-blue-500 focus:outline-none transition-colors text-center"
              value={row.start}
              onChange={e => setSchedule(s => s.map((r, i) => i === idx ? { ...r, start: e.target.value } : r))}
            />
          </div>
          <div className="col-span-3">
            <input
              className="w-full bg-background text-foreground rounded-md px-2 py-1.5 text-sm border border-border focus:border-blue-500 focus:outline-none transition-colors text-center"
              value={row.end}
              onChange={e => setSchedule(s => s.map((r, i) => i === idx ? { ...r, end: e.target.value } : r))}
            />
          </div>
          <div className="col-span-1 flex justify-center">
            <div className={`w-6 h-6 rounded-full ${row.status ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} />
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="pt-3 flex justify-center">
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md">
          <CheckCircle className="w-4 h-4" />
          Submit
        </button>
      </div>

    </div>
  );

  // Modern Layout Sections 
  const MonitoringCards = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <CardShell id="ug" title="Under Ground Tank" icon={<Droplets className="w-5 h-5" />} showExpand={false}>
        <TankLevel percent={ugLevel} />
      </CardShell>

      <CardShell id="oh" title="Over Head Tank" icon={<Droplets className="w-5 h-5" />} showExpand={false}>
        <TankLevel percent={ohLevel} />
      </CardShell>

      <CardShell id="flow" title="Flow Meter" icon={<Activity className="w-5 h-5" />} showExpand={false}>
        <MetricDisplay
          icon={<Activity className="w-5 h-5 text-blue-500" />}
          value={flow}
          unit="m³/hr"
          label="Flow Rate"
        />
      </CardShell>

      <CardShell id="tds" title="TDS Value" icon={<Gauge className="w-5 h-5" />} showExpand={false}>
        <MetricDisplay
          icon={<Gauge className="w-5 h-5 text-red-500" />}
          value={tds}
          unit="mg/L"
          color="text-red-500"
          label="Total Dissolved Solids"
        />
      </CardShell>

      <CardShell id="cons" title="Daily Consumption" icon={<TrendingUp className="w-5 h-5" />} showExpand={false}>
        <MetricDisplay
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          value={consumption}
          unit="m³"
          color="text-green-500"
          label="Daily Usage"
        />
      </CardShell>
    </div>
  );

  const ControlCards = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center">
      <CardShell id="bp" title="BORING PUMP" icon={<Zap className="w-5 h-5" />}>
        <ControlPanel
          title="Pump"
          running={bpRunning}
          auto={bpAuto}
          onStart={() => setBpRunning(true)}
          onStop={() => setBpRunning(false)}
          onToggleAuto={() => setBpAuto(v => !v)}
          icon={<Zap className="w-4 h-4" />}
        />
      </CardShell>

      <CardShell id="ohp" title="OH PUMP" icon={<Zap className="w-5 h-5" />}>
        <ControlPanel
          title="Pump"
          running={ohpRunning}
          auto={ohpAuto}
          onStart={() => setOhpRunning(true)}
          onStop={() => setOhpRunning(false)}
          onToggleAuto={() => setOhpAuto(v => !v)}
          icon={<Zap className="w-4 h-4" />}
        />
      </CardShell>

      <CardShell id="valve" title="Valve OH" icon={<Gauge className="w-5 h-5" />}>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Valve Status</span>
            <StatusIndicator status={valveOpen} />
          </div>

          <div className="flex justify-center">
            <ModernToggle
              checked={valveAuto}
              onChange={() => setValveAuto(v => !v)}
              labels={['Manual', 'Auto']}
            />
          </div>

          <div className="flex items-center gap-3 justify-center">
            <ActionButton
              variant="close"
              onClick={() => setValveOpen(false)}
              icon={<XCircle className="w-4 h-4" />}
            >
              Close
            </ActionButton>
            <ActionButton
              variant="open"
              onClick={() => setValveOpen(true)}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Open
            </ActionButton>
          </div>
        </div>
      </CardShell>

      <CardShell id="power" title="Power Status" icon={<Power className="w-7 h-7" />}>
        <PowerStatus /> {/* bigger icon indicator */}
      </CardShell>
    </div>
  );


  return (
    <div className="my-6 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Water Management Control</h2>
          <p className="text-muted-foreground mt-1">Monitor and control water systems with real-time data</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span> */}
        </div>
      </div>

      {/* Monitoring Cards */}
      {MonitoringCards}

      {/* Control Cards */}
      {ControlCards}

      {/* Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardShell id="schedule" title="Schedule Management" icon={<Clock className="w-5 h-5" />}>
            <ScheduleTable />
          </CardShell>
        </div>
        <div className="lg:col-span-1">
          {/* Additional space for future content */}
        </div>
      </div>

      {/* Expanded Modal */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="relative rounded-2xl bg-card border border-border shadow-2xl p-8">
              <button
                aria-label="Close"
                onClick={() => setExpanded(null)}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>

              {expanded === 'ug' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                    <Droplets className="w-6 h-6 text-blue-500" />
                    Under Ground Tank Level
                  </h3>
                  <TankLevel percent={ugLevel} />
                </div>
              )}

              {expanded === 'oh' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                    <Droplets className="w-6 h-6 text-blue-500" />
                    Over Head Tank Level
                  </h3>
                  <TankLevel percent={ohLevel} />
                </div>
              )}

              {expanded === 'flow' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                    <Activity className="w-6 h-6 text-blue-500" />
                    Flow Meter
                  </h3>
                  <MetricDisplay
                    icon={<Activity className="w-16 h-16 text-blue-500" />}
                    value={flow}
                    unit="m³/hr"
                    label="Current Flow Rate"
                  />
                </div>
              )}

              {expanded === 'tds' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                    <Gauge className="w-6 h-6 text-red-500" />
                    TDS Value
                  </h3>
                  <MetricDisplay
                    icon={<Gauge className="w-16 h-16 text-red-500" />}
                    value={tds}
                    unit="mg/L"
                    color="text-red-500"
                    label="Total Dissolved Solids"
                  />
                </div>
              )}

              {expanded === 'cons' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    Daily Consumption
                  </h3>
                  <MetricDisplay
                    icon={<TrendingUp className="w-16 h-16 text-green-500" />}
                    value={consumption}
                    unit="m³"
                    color="text-green-500"
                    label="Daily Water Usage"
                  />
                </div>
              )}

              {expanded === 'bp' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-500" />
                    BORING PUMP Control
                  </h3>
                  <ControlPanel
                    title="Pump"
                    running={bpRunning}
                    auto={bpAuto}
                    onStart={() => setBpRunning(true)}
                    onStop={() => setBpRunning(false)}
                    onToggleAuto={() => setBpAuto(v => !v)}
                    icon={<Zap className="w-6 h-6" />}
                  />
                </div>
              )}

              {expanded === 'ohp' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-500" />
                    OH PUMP Control
                  </h3>
                  <ControlPanel
                    title="Pump"
                    running={ohpRunning}
                    auto={ohpAuto}
                    onStart={() => setOhpRunning(true)}
                    onStop={() => setOhpRunning(false)}
                    onToggleAuto={() => setOhpAuto(v => !v)}
                    icon={<Zap className="w-6 h-6" />}
                  />
                </div>
              )}

              {expanded === 'valve' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Gauge className="w-6 h-6 text-blue-500" />
                    Valve OH Control
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-6 h-6 text-blue-500" />
                        <span className="text-lg font-medium text-muted-foreground">Valve Status</span>
                      </div>
                      <StatusIndicator status={valveOpen} />
                    </div>

                    <ModernToggle
                      checked={valveAuto}
                      onChange={() => setValveAuto(v => !v)}
                      labels={['Manual', 'Auto']}
                    />

                    <div className="flex items-center gap-4">
                      <ActionButton
                        variant="close"
                        onClick={() => setValveOpen(false)}
                        icon={<XCircle className="w-5 h-5" />}
                      >
                        Close
                      </ActionButton>
                      <ActionButton
                        variant="open"
                        onClick={() => setValveOpen(true)}
                        icon={<CheckCircle className="w-5 h-5" />}
                      >
                        Open
                      </ActionButton>
                    </div>
                  </div>
                </div>
              )}

              {expanded === 'power' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Power className="w-6 h-6 text-blue-500" />
                    Power Status
                  </h3>
                  <PowerStatus />
                </div>
              )}

              {expanded === 'schedule' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-500" />
                    Schedule Management
                  </h3>
                  <ScheduleTable />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function DashboardContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const { isConnected, lastMessage, sendMessage } = useWebSocket();
  const { user } = useAuth();
  // Level-set inputs
  const [lowLevelSet, setLowLevelSet] = useState<string>("");
  const [highLevelSet, setHighLevelSet] = useState<string>("");
  const [levelToggleOn, setLevelToggleOn] = useState<boolean>(false);

  // Handlers to save and clear inputs
  const handleSaveLowLevel = () => {
    // TODO: replace with actual save logic/API
    console.log("Saving Low Level Set:", lowLevelSet);
    setLowLevelSet("");
  };

  const handleSaveHighLevel = () => {
    // TODO: replace with actual save logic/API
    console.log("Saving High Level Set:", highLevelSet);
    setHighLevelSet("");
  };
  const [expandedChart, setExpandedChart] = useState<"pie" | "bar" | null>(null);

  // Fields we care about
  const allowedMetrics = ["temperature", "pressure", "waterLevel"];

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchLatestTelemetry();
      if (res?.data?.length) {
        const formatted = res.data.map((entry: any) => {
          // Only keep allowed metrics
          const filteredTelemetry = Object.fromEntries(
            Object.entries(entry.telemetry).filter(([key]) =>
              allowedMetrics.includes(key)
            )
          );
          return {
            deviceId: entry.deviceId,
            timestamp: new Date().toISOString(),
            ...filteredTelemetry
          };
        });
        setTelemetryData(formatted);
      }
    };
    loadData();
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === "telemetry" && lastMessage.deviceId) {
      // Filter telemetry to allowed metrics only
      const filteredTelemetry = Object.fromEntries(
        Object.entries(lastMessage).filter(([key]) =>
          allowedMetrics.includes(key)
        )
      );

      const newPoint = {
        deviceId: lastMessage.deviceId,
        timestamp: lastMessage.timestamp || new Date().toISOString(),
        ...filteredTelemetry
      };

      setTelemetryData((prev) => [...prev.slice(-49), newPoint]);

      setDevices((prev) =>
        prev.map((device) =>
          device.id === lastMessage.deviceId
            ? {
              ...device,
              ...filteredTelemetry,
              status: "online",
              lastSeen: "Just now"
            }
            : device
        )
      );
    }
  }, [lastMessage]);


  const handleDeviceControl = (deviceId: string, action: "on" | "off") => {
    sendMessage("device_control", {
      deviceId,
      action,
      command: `${action.toUpperCase()}_DEVICE`
    });
  };

  if (!user) return null;

  // Determine which allowed metrics are present in current data
  const metricKeys = allowedMetrics.filter((metric) =>
    telemetryData.some((point) => typeof point[metric] === "number")
  );

  // Demo combined data for Flow Rate, Level, Total Flow
  const combinedDemoData = [
    { time: "08:00", flowRate: 45, level: 85, totalFlow: 1200 },
    { time: "08:15", flowRate: 47, level: 87, totalFlow: 1250 },
    { time: "08:30", flowRate: 49, level: 89, totalFlow: 1300 },
    { time: "08:45", flowRate: 51, level: 90, totalFlow: 1350 },
    { time: "09:00", flowRate: 48, level: 88, totalFlow: 1400 },
    { time: "09:15", flowRate: 46, level: 86, totalFlow: 1450 },
    { time: "09:30", flowRate: 45, level: 84, totalFlow: 1500 },
    { time: "09:45", flowRate: 43, level: 82, totalFlow: 1550 },
    { time: "10:00", flowRate: 41, level: 80, totalFlow: 1600 },
    { time: "10:15", flowRate: 40, level: 78, totalFlow: 1650 },
  ];

  return (
    <div className="flex h-screen bg-sidebar text-foreground">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
      >
        <TopNavbar
          user={{ name: user.name, role: user.role, company: user.company }}
          isConnected={isConnected}
        />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Monitor your IoT devices and real-time telemetry data
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tenant: {user.tenantId.slice(0, 8)}... • Role: {user.role}
          </p>

          {/* Only allowed charts */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            {metricKeys.map((key, idx) => (
              <TelemetryChart
                key={key}
                data={telemetryData}
                type={key as "temperature" | "pressure" | "waterLevel"}
                title={key.replace(/_/g, " ")}
                color={["#ef4444", "#3b82f6", "#10b981"][idx % 3]}
              />
            ))}
          </div> */}

          {/* Professional Energy Meter Section */}
          <EnergyMeterSection />

          {/* Operations Grid Section (between Energy Meter 3 and Device Status) */}
          <WaterManagementSection />

          {/* Level Set Controls */}
          <div className="mt-6 flex flex-col md:flex-row items-start justify-start gap-4 w-full">
            {/* Low Level Set */}
            <div className="relative rounded-xl bg-card border border-border shadow-sm p-4 w-full max-w-[280px] min-h-[180px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground flex-1 text-center">Low Level Set</h3>
                <div className="flex items-center gap-2">
                  <button aria-label="Save" className="p-1.5 rounded-md hover:bg-muted/50"><Save className="w-4 h-4 text-muted-foreground" /></button>
                  <button aria-label="Expand" className="p-1.5 rounded-md hover:bg-muted/50"><Maximize2 className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">Low Level Set:</label>
              <input
                value={lowLevelSet}
                onChange={(e) => setLowLevelSet(e.target.value)}
                placeholder="Enter value"
                className="w-full bg-background text-foreground rounded-md px-3 py-2 text-sm border border-border focus:border-blue-500 focus:outline-none transition-colors text-center placeholder:text-center"
              />
              <button onClick={handleSaveLowLevel} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold text-center">Save</button>
            </div>

            {/* High Level Set */}
            <div className="relative rounded-xl bg-card border border-border shadow-sm p-4 w-full max-w-[280px] min-h-[180px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground flex-1 text-center">High Level Set</h3>
                <div className="flex items-center gap-2">
                  <button aria-label="Save" className="p-1.5 rounded-md hover:bg-muted/50"><Save className="w-4 h-4 text-muted-foreground" /></button>
                  <button aria-label="Expand" className="p-1.5 rounded-md hover:bg-muted/50"><Maximize2 className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">High Level Set:</label>
              <input
                value={highLevelSet}
                onChange={(e) => setHighLevelSet(e.target.value)}
                placeholder="Enter value"
                className="w-full bg-background text-foreground rounded-md px-3 py-2 text-sm border border-border focus:border-blue-500 focus:outline-none transition-colors text-center placeholder:text-center"
              />
              <button onClick={handleSaveHighLevel} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold text-center">Save</button>
            </div>

            {/* Toggle Control */}
            <div className="relative rounded-xl bg-card border border-border shadow-sm p-4 w-full max-w-[280px] min-h-[180px] flex flex-col items-center">
              <div className="flex items-center justify-between mb-3 w-full">
                <h3 className="text-lg font-semibold text-foreground flex-1 text-center">Toggle Control</h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setLevelToggleOn(v => !v)}
                    className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-200 ${levelToggleOn ? 'bg-green-600' : 'bg-muted'}`}
                  >
                    <span className={`inline-block h-10 w-10 transform rounded-full bg-white shadow transition-transform duration-200 ${levelToggleOn ? 'translate-x-12' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-muted-foreground text-center">{levelToggleOn ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Charts Row: Bar Graph (left) and Resource Distribution (right) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
            {/* Bar Graph - left */}
            <div className="relative min-h-[340px] h-full">
              <button
                aria-label="Expand Bar Graph"
                onClick={() => setExpandedChart("bar")}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-md hover:bg-muted/50"
              >
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <BarGraphComponent
                title="Yearly Totals"
                data={[
                  { name: "2009", total: 45 },
                  { name: "2010", total: 52 },
                  { name: "2011", total: 68 },
                  { name: "2012", total: 80 },
                  { name: "2013", total: 77 },
                ]}
                series={[{ key: "total", label: "Total", color: "#60a5fa" }]}
                xKey="name"
                xLabel="Years"
                yLabel="Values"
                height={260}
                barSize={26}
                className="h-full w-full max-w-none"
              />
            </div>

            {/* Resource Distribution - right (unchanged size/padding) */}
            <div className="relative min-h-[340px] h-full flex items-start">
              <ResourcePieChart
                title="Resource Distribution"
                data={[
                  { name: "Water", value: 42, color: "#0ea5e9" },
                  { name: "Energy", value: 28, color: "#f97316" },
                  { name: "Chemicals", value: 18, color: "#22c55e" },
                  { name: "Maintenance", value: 12, color: "#8b5cf6" },
                ]}
                size={280}
                className="h-full mx-0 w-full max-w-[300px]"
              />
            </div>
          </div>

          <div className="mt-4">
            <StackedPowerBar height={340} />
          </div>
  
          {/* Expanded modal view for charts */}
          {expandedChart && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-6xl">
                <div className="relative">
                  <button
                    aria-label="Close"
                    onClick={() => setExpandedChart(null)}
                    className="absolute top-2 right-2 z-10 p-2 rounded-md hover:bg-muted/50"
                  >
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  {expandedChart === "pie" && (
                    <ResourcePieChart
                      title="Resource Distribution"
                      data={[
                        { name: "Water", value: 42, color: "#0ea5e9" },
                        { name: "Energy", value: 28, color: "#f97316" },
                        { name: "Chemicals", value: 18, color: "#22c55e" },
                        { name: "Maintenance", value: 12, color: "#8b5cf6" },
                      ]}
                      size={420}
                      className="mx-auto w-full max-w-none"
                    />
                  )}

                  {expandedChart === "bar" && (
                    <BarGraphComponent
                      title="Yearly Totals"
                      data={[
                        { name: "2009", total: 45 },
                        { name: "2010", total: 52 },
                        { name: "2011", total: 68 },
                        { name: "2012", total: 80 },
                        { name: "2013", total: 77 },
                      ]}
                      series={[{ key: "total", label: "Total", color: "#60a5fa" }]}
                      xKey="name"
                      xLabel="Years"
                      yLabel="Values"
                      height={450}
                      barSize={50}
                      className="w-full max-w-none"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Combined Line Chart (Flow Rate, Level, Total Flow) */}
          <div className="mt-6">
            <CombinedTelemetryChart data={combinedDemoData} />
          </div>

          {/* Location Map: left-aligned, below charts, above device status */}
          <div className="mt-6 flex">
            <CustomMap />
          </div>

          <h2 className="text-xl font-semibold mb-4">Device Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PumpControlCard
              deviceId="device_003"
              deviceName="Water Pump Station"
              userRole={user.role as "admin" | "operator" | "viewer"}
            />
          </div>

          {/* Live last message */}
          {lastMessage && (
            <div className="mt-6 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  Live Data: {lastMessage.deviceId} -{" "}
                  {JSON.stringify(lastMessage)}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <StatCard
              label="Total Devices"
              value={devices.length}
              icon="D"
              color="blue"
            />
            <StatCard
              label="Online Devices"
              value={devices.filter((d) => d.status === "online").length}
              icon="✓"
              color="green"
            />
            <StatCard
              label="Active Alerts"
              value={devices.reduce(
                (acc, d) => acc + (d.alerts?.length || 0),
                0
              )}
              icon="!"
              color="red"
            />
            <StatCard
              label="WebSocket"
              value={isConnected ? "Connected" : "Disconnected"}
              icon={isConnected ? "●" : "○"}
              color={isConnected ? "green" : "red"}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="amset-card p-4 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`w-8 h-8 bg-${color}-100 dark:bg-${color}-900 rounded-lg flex items-center justify-center`}>
          <span className={`text-${color}-600 dark:text-${color}-400 font-bold`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
