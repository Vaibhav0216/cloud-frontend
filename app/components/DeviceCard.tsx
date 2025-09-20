'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useWebSocket } from '../contexts/WebSocketProvider';
import { 
  Power, 
  PowerOff,
  Play,
  Square,
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface Alert {
  type: 'warning' | 'error' | 'info';
  message: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  temperature: number;
  pressure: number;
  waterLevel: number;
  lastSeen: string;
  alerts: Alert[];
}

interface DeviceCardProps {
  device: Device;
  userRole: 'admin' | 'operator' | 'viewer';
  onControl: (deviceId: string, action: 'on' | 'off') => void;
}

export default function DeviceCard({ device, userRole, onControl }: DeviceCardProps) {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const { sendMessage } = useWebSocket();

  const canControl = userRole === 'admin' || userRole === 'operator';

  const handlePumpControl = (action: 'start' | 'stop') => {
    if (!canControl) return;

    const payload = {
      device_name: device.id,
      method: "COIL",
      params: { 
        cid: 4, 
        state: action === 'start' ? 1 : 0 
      }
    };

    sendMessage('device_control', payload);
    setIsRunning(action === 'start');
  };

  const getStatusColor = (status: string) => status === 'online' ? 'text-green-500' : 'text-red-500';
  const getAlertColor = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <CardHeader className="pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isRunning ? (
            <Power className="h-5 w-5 text-green-500" />
          ) : (
            <PowerOff className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <CardTitle className="text-lg">{device.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{device.type}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor(device.status)}`}>
          <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {device.status === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Operation Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Operation Mode</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Auto</span>
            <Switch
              checked={!isAutoMode}
              onCheckedChange={(checked: boolean) => setIsAutoMode(!checked)}
              disabled={!canControl}
            />
            <span className="text-sm text-muted-foreground">Manual</span>
          </div>
        </div>

        {/* Pump Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Pump Status</span>
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? 'Running' : 'Stopped'}
          </Badge>
        </div>

        {/* Manual Control */}
        {!isAutoMode && canControl && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePumpControl('start')}
              disabled={isRunning}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" /> Start
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePumpControl('stop')}
              disabled={!isRunning}
              className="w-full"
            >
              <Square className="h-4 w-4 mr-2" /> Stop
            </Button>
          </div>
        )}

        {/* Telemetry */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{device.temperature}°C</div>
            <div className="text-xs text-muted-foreground">Temperature</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{device.pressure} PSI</div>
            <div className="text-xs text-muted-foreground">Pressure</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{device.waterLevel}%</div>
            <div className="text-xs text-muted-foreground">Water Level</div>
          </div>
        </div>

        {/* Alerts */}
        {device.alerts.length > 0 && (
          <div className="space-y-1">
            {device.alerts.map((alert, index) => (
              <div key={index} className={`text-xs p-2 rounded ${getAlertColor(alert.type)}`}>
                {alert.message}
              </div>
            ))}
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

        {/* Live Indicator */}
        {device.status === 'online' && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-green-500">
            <Activity size={14} className="animate-pulse" />
            <span className="text-xs">Live Data</span>
          </div>
        )}

        {/* Access Level */}
        <div className="text-xs text-muted-foreground">
          {canControl ? 'You have control access to this device' : 'View-only access'}
        </div>
      </CardContent>
    </Card>

    
  );
}
