'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from '../components/ui/switch';
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

  const handlePumpControl = async (action: 'start' | 'stop') => {
    if (!canControl) return;

    const token = localStorage.getItem("token"); // or whatever key you use
    if (!token) {
        console.error("No auth token found in localStorage");
        return;
    }

    const payload = {
        device_name: "Device_003",
        method: "COIL",
        params: {
        cid: 10,
        state: action === 'start' ? 1 : 0
        }
    };

    try {
        const res = await fetch(
        "https://nrj1481m2k.execute-api.ap-south-1.amazonaws.com/dev/device/publish",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        }
        );

        if (!res.ok) {
        console.error("Failed to send command", await res.text());
        return;
        }

        const data = await res.json();
        console.log("Command sent:", data);
        setIsRunning(action === 'start');
    } catch (err) {
        console.error("Error sending command:", err);
    }
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
}
