
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
                type={key}
                title={key.replace(/_/g, " ")}
                color={["#ef4444", "#3b82f6", "#10b981"][idx % 3]}
              />
            ))}
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
