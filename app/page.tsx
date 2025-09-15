
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import PumpControlCard from "./components/PumpControlCard";
import TelemetryChart from "./components/TelemetryChart";
import ProtectedRoute from "./components/ProtectedRoute";
import { useWebSocket } from "./contexts/WebSocketProvider";
import { useAuth } from "./contexts/AuthContext";

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
    lineVoltage: { ry: 415, yb: 412, rb: 418 },
    phaseVoltage: { r: 240, y: 238, b: 242 },
    current: { r: 15.2, y: 14.8, b: 15.5 },
    frequency: 50.2,
    watt: 8.5,
    runningTime: 45,
    pumpStatus: 'ON',
    tripStatus: 'OFF',
    valveStatus: 'OFF'
  });

  // Expanded card state (modal-style)
  const [expanded, setExpanded] = useState<'1' | '2' | '3' | null>(null);

  const [energyMeter2, setEnergyMeter2] = useState<EnergyMeterData>({
    lineVoltage: { ry: 420, yb: 415, rb: 422 },
    phaseVoltage: { r: 243, y: 240, b: 245 },
    current: { r: 16.1, y: 15.7, b: 16.4 },
    frequency: 49.8,
    watt: 9.2,
    runningTime: 38,
    pumpStatus: 'OFF',
    tripStatus: 'OFF',
    valveStatus: 'OFF'
  });

  const [energyMeter3, setEnergyMeter3] = useState<EnergyMeterData>({
    lineVoltage: { ry: 415, yb: 412, rb: 418 },
    phaseVoltage: { r: 240, y: 238, b: 242 },
    current: { r: 15.2, y: 14.8, b: 15.5 },
    frequency: 50.2,
    watt: 8.5,
    runningTime: 45,
    pumpStatus: 'ON',
    tripStatus: 'OFF',
    valveStatus: 'OFF'
  });

  // Control Handlers
  const handlePumpControl = async (meterId: '1' | '2' | '3', action: 'start' | 'stop' | 'enable') => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      
      const response = await fetch(`/api/energy-meter-${meterId}/control`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) throw new Error(`Failed to ${action} pump`);
      
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
        <h2 className="text-2xl font-bold text-foreground">Energy Monitoring</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
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

function DashboardContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const { isConnected, lastMessage, sendMessage } = useWebSocket();
  const { user } = useAuth();

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

  return (
    <div className="flex h-screen bg-sidebar text-foreground">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            {metricKeys.map((key, idx) => (
              <TelemetryChart
                key={key}
                data={telemetryData}
                type={key as "temperature" | "pressure" | "waterLevel"}
                title={key.replace(/_/g, " ")}
                color={["#ef4444", "#3b82f6", "#10b981"][idx % 3]}
              />
            ))}
          </div>

          {/* Professional Energy Meter Section */}
          <EnergyMeterSection />

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
