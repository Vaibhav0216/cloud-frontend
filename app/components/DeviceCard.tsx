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
  Square
} from 'lucide-react';

interface DeviceCardProps {
  deviceId: string;
  deviceName: string;
  userRole: 'admin' | 'operator' | 'viewer';
}

export default function DeviceCard({ deviceId, deviceName, userRole }: DeviceCardProps) {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const { sendMessage } = useWebSocket();
  
  const canControl = userRole === 'admin' || userRole === 'operator';

  const handlePumpControl = (action: 'start' | 'stop') => {
    if (!canControl) return;
    
    const payload = {
      device_name: deviceId,
      method: "COIL",
      params: { 
        cid: 4, 
        state: action === 'start' ? 1 : 0 
      }
    };

    sendMessage('device_control', payload);
    setIsRunning(action === 'start');
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {isRunning ? (
              <Power className="h-5 w-5 text-green-500" />
            ) : (
              <PowerOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <CardTitle className="text-lg">{deviceName}</CardTitle>
              <p className="text-sm text-muted-foreground">Pump Control</p>
            </div>
          </div>
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

        {/* Status and Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pump Status</span>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? 'Running' : 'Stopped'}
            </Badge>
          </div>

          {/* Manual Control Buttons */}
          {!isAutoMode && canControl && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePumpControl('start')}
                disabled={isRunning}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePumpControl('stop')}
                disabled={!isRunning}
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          )}
        </div>

        {/* Access Level Info */}
        <div className="text-xs text-muted-foreground">
          {canControl ? 
            'You have control access to this device' : 
            'View-only access'
          }
        </div>
      </CardContent>
    </Card>
  );

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