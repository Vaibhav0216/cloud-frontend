'use client';

import { useState } from 'react';
import { 
  Cpu, 
  Power, 
  PowerOff, 
  Activity,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface DeviceData {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  lastSeen: string;
  temperature: number;
  pressure: number;
  waterLevel: number;
  alerts: Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
  }>;
}

interface DeviceCardProps {
  device: DeviceData;
  userRole: 'admin' | 'operator' | 'viewer';
  onControl: (deviceId: string, action: 'on' | 'off') => void;
}

export default function DeviceCard({ device, userRole, onControl }: DeviceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const canControl = userRole === 'admin' || userRole === 'operator';

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'status-online' : 'status-offline';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'alert-critical';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  return (
    <div className="amset-card p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Cpu size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {device.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {device.type}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getStatusColor(device.status)}`}>
            <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {device.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Data */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {device.temperature}°C
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {device.pressure} PSI
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Pressure</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {device.waterLevel}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Water Level</div>
        </div>
      </div>

      {/* Last Seen */}
      <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Clock size={14} />
        <span>Last seen: {device.lastSeen}</span>
      </div>

      {/* Alerts */}
      {device.alerts.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Alerts ({device.alerts.length})
            </span>
          </div>
          <div className="space-y-1">
            {device.alerts.map((alert, index) => (
              <div key={index} className={`text-xs p-2 rounded ${getAlertColor(alert.type)}`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      {canControl && device.status === 'online' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onControl(device.id, 'on')}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Power size={16} />
            <span>Turn ON</span>
          </button>
          <button
            onClick={() => onControl(device.id, 'off')}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PowerOff size={16} />
            <span>Turn OFF</span>
          </button>
        </div>
      )}

      {/* Real-time Indicator */}
      {device.status === 'online' && (
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-green-500">
            <Activity size={14} className="pulse-animation" />
            <span className="text-xs">Live Data</span>
          </div>
        </div>
      )}
    </div>
  );
} 