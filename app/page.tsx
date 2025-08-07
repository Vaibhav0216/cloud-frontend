"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import DeviceCard from "./components/DeviceCard";
import TelemetryChart from "./components/TelemetryChart";
import ProtectedRoute from "./components/ProtectedRoute";
import { useWebSocket } from "./contexts/WebSocketProvider";
import { useAuth } from "./contexts/AuthContext";

// Define device type
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

// Mock devices data - in a real app, this would come from your AWS API
const mockDevices: Device[] = [
  {
    id: "28af4427-7e55-4c75-9f3a-99652ded4610", // Real device ID from your data
    name: "Water Pump Station",
    type: "IoT Pump Controller",
    status: "online",
    lastSeen: "Just now",
    temperature: 40, // From your real data
    pressure: 110, // From your real data
    waterLevel: 78, // From your real data
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

const mockTelemetryData = [
  {
    timestamp: "2024-01-15T10:00:00Z",
    temperature: 38.5,
    pressure: 108.2,
    waterLevel: 76.5
  },
  {
    timestamp: "2024-01-15T10:05:00Z",
    temperature: 39.2,
    pressure: 109.1,
    waterLevel: 77.1
  },
  {
    timestamp: "2024-01-15T10:10:00Z",
    temperature: 40.0,
    pressure: 110.0,
    waterLevel: 78.0
  },
  {
    timestamp: "2024-01-15T10:15:00Z",
    temperature: 40.5,
    pressure: 110.5,
    waterLevel: 78.2
  },
  {
    timestamp: "2024-01-15T10:20:00Z",
    temperature: 40.0,
    pressure: 110.0,
    waterLevel: 78.0
  }
];

function DashboardContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [devices, setDevices] = useState(mockDevices);
  const [telemetryData, setTelemetryData] = useState(mockTelemetryData);
  const { isConnected, lastMessage, sendMessage } = useWebSocket();
  const { user, logout } = useAuth();

  // Debug: Log current telemetry data
  // useEffect(() => {
  //   console.log("📊 Current telemetry data:", telemetryData);
  // }, [telemetryData]);

  useEffect(() => {
    if (lastMessage) {
      try {
        console.log("Processing WebSocket message:", lastMessage);

        // Handle different message types
        switch (lastMessage.type) {
          case "telemetry":
            // Update telemetry data with real-time data
            const newTelemetryPoint = {
              timestamp: lastMessage.timestamp,
              temperature: lastMessage.temperature,
              pressure: lastMessage.pressure,
              waterLevel: lastMessage.waterLevel
            };

            console.log(
              "🔄 Updating telemetry charts with:",
              newTelemetryPoint
            );
            console.log(
              "🔄 Previous telemetry data length:",
              telemetryData.length
            );

            // Force update by creating a new array
            const updatedTelemetryData = [
              ...telemetryData.slice(-4),
              newTelemetryPoint
            ];
            console.log("🔄 New telemetry data:", updatedTelemetryData);
            setTelemetryData(updatedTelemetryData);

            // Update device data with real telemetry
            setDevices((prev) =>
              prev.map((device) =>
                device.id === lastMessage.deviceId
                  ? {
                      ...device,
                      temperature: lastMessage.temperature,
                      pressure: lastMessage.pressure,
                      waterLevel: lastMessage.waterLevel,
                      status: "online", // Device is online if we're receiving data
                      lastSeen: "Just now",
                      // Add alerts based on telemetry data
                      alerts: [
                        ...(lastMessage.isFault
                          ? [
                              {
                                type: "critical" as const,
                                message: "Device fault detected"
                              }
                            ]
                          : []),
                        ...(lastMessage.temperature > 50
                          ? [
                              {
                                type: "warning" as const,
                                message: "High temperature alert"
                              }
                            ]
                          : []),
                        ...(lastMessage.waterLevel < 20
                          ? [
                              {
                                type: "warning" as const,
                                message: "Low water level"
                              }
                            ]
                          : [])
                      ]
                    }
                  : device
              )
            );

            console.log("📊 Updated dashboard with real telemetry:", {
              temperature: lastMessage.temperature,
              pressure: lastMessage.pressure,
              waterLevel: lastMessage.waterLevel,
              deviceId: lastMessage.deviceId
            });
            break;

          case "device_status":
            // Update device status
            setDevices((prev) =>
              prev.map((device) =>
                device.id === lastMessage.deviceId
                  ? {
                      ...device,
                      status: lastMessage.status,
                      lastSeen: "Just now"
                    }
                  : device
              )
            );
            break;

          case "alert":
            // Handle new alerts
            console.log("New alert received:", lastMessage);
            break;

          default:
            console.log("Unknown message type:", lastMessage.type);
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  const handleDeviceControl = (deviceId: string, action: "on" | "off") => {
    console.log(`Controlling device ${deviceId}: ${action}`);
    // Send device control command via WebSocket
    sendMessage("device_control", {
      deviceId,
      action,
      command: `${action.toUpperCase()}_DEVICE`
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
          user={{
            name: user.name,
            role: user.role,
            company: user.company
          }}
          isConnected={isConnected}
        />

        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your IoT devices and real-time telemetry data
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tenant: {user.tenantId.slice(0, 8)}... • Role: {user.role}
            </p>
          </div>

          {/* Telemetry Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <TelemetryChart
              data={telemetryData}
              type="temperature"
              title="Temperature"
              color="#ef4444"
            />
            <TelemetryChart
              data={telemetryData}
              type="pressure"
              title="Pressure"
              color="#3b82f6"
            />
            <TelemetryChart
              data={telemetryData}
              type="waterLevel"
              title="Water Level"
              color="#10b981"
            />
          </div>

          {/* Device Cards */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Device Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  userRole={user.role as "admin" | "operator" | "viewer"}
                  onControl={handleDeviceControl}
                />
              ))}
            </div>
          </div>

          {/* Real-time Data Indicator */}
          {lastMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Live Data: {lastMessage.deviceId} - Temp:{" "}
                  {lastMessage.temperature}°C, Pressure: {lastMessage.pressure}{" "}
                  PSI, Water: {lastMessage.waterLevel}%
                </span>
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                Chart Data Points: {telemetryData.length} | Latest:{" "}
                {telemetryData[telemetryData.length - 1]?.timestamp}
              </div>
            </div>
          )}

          {/* WebSocket Debug Panel */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">WebSocket Connection Debug</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-blue-600 dark:text-blue-400">User ID:</span>
                <div className="font-mono text-blue-700 dark:text-blue-300 truncate">
                  {user.id.slice(0, 8)}...
                </div>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Tenant ID:</span>
                <div className="font-mono text-blue-700 dark:text-blue-300 truncate">
                  {user.tenantId.slice(0, 8)}...
                </div>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Token Status:</span>
                <div className="font-mono text-blue-700 dark:text-blue-300">
                  {localStorage.getItem('token') ? 'Present' : 'Missing'}
                </div>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Last Message:</span>
                <div className="font-mono text-blue-700 dark:text-blue-300">
                  {lastMessage ? 'Received' : 'None'}
                </div>
              </div>
            </div>
            {!isConnected && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300">
                <strong>Connection Issue:</strong> WebSocket is not connected. 
                <br />
                <strong>Common causes:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Network connectivity issues</li>
                  <li>AWS API Gateway unreachable</li>
                  <li>Invalid or expired JWT token</li>
                  <li>Firewall blocking WebSocket connections</li>
                </ul>
                <br />
                Check browser console (F12) for detailed error messages. 
                The connection will automatically retry every 5 seconds, or refresh the page to reconnect immediately.
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="amset-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Devices
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {devices.length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    D
                  </span>
                </div>
              </div>
            </div>

            <div className="amset-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Online Devices
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {devices.filter((d) => d.status === "online").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ✓
                  </span>
                </div>
              </div>
            </div>

            <div className="amset-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active Alerts
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {devices.reduce(
                      (acc, device) => acc + device.alerts.length,
                      0
                    )}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    !
                  </span>
                </div>
              </div>
            </div>

            <div className="amset-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    WebSocket
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isConnected ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">AWS API Gateway</p>
                  {isConnected && (
                    <p className="text-xs text-green-500 mt-1">
                      ✓ JWT Authenticated
                    </p>
                  )}
                </div>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isConnected
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      isConnected
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isConnected ? "●" : "○"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
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
