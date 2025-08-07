'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Power, 
  PowerOff,
  Battery,
  BatteryCharging,
  MapPin,
  Clock
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'pump' | 'sensor' | 'valve';
  status: 'online' | 'offline' | 'warning';
  location: string;
  lastSeen: string;
  battery?: number;
  canControl: boolean;
  isOn?: boolean;
  readings?: Record<string, number>;
}

interface DeviceStatusCardProps {
  device: Device;
  onToggle?: (deviceId: string) => void;
  userRole: 'admin' | 'operator' | 'viewer';
  isLive: boolean;
}

export function DeviceStatusCard({ 
  device, 
  onToggle, 
  userRole, 
  isLive 
}: DeviceStatusCardProps) {
  const canControl = (userRole === 'admin' || userRole === 'operator') && device.canControl;

  const getStatusIcon = () => {
    switch (device.status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Activity className="h-4 w-4 text-yellow-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (device.status) {
      case 'online':
        return <Badge variant="success">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getBatteryIcon = () => {
    if (!device.battery) return null;
    
    if (device.battery > 80) {
      return <BatteryCharging className="h-4 w-4 text-green-500" />;
    } else if (device.battery > 20) {
      return <Battery className="h-4 w-4 text-yellow-500" />;
    } else {
      return <Battery className="h-4 w-4 text-red-500" />;
    }
  };

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'pump':
        return device.isOn ? <Power className="h-5 w-5 text-green-500" /> : <PowerOff className="h-5 w-5 text-gray-500" />;
      case 'valve':
        return device.isOn ? <Power className="h-5 w-5 text-blue-500" /> : <PowerOff className="h-5 w-5 text-gray-500" />;
      case 'sensor':
        return <Activity className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <div>
              <CardTitle className="text-lg">{device.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location and Last Seen */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{device.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{device.lastSeen}</span>
          </div>
        </div>

        {/* Battery Level */}
        {device.battery && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Battery</span>
            <div className="flex items-center space-x-2">
              {getBatteryIcon()}
              <span className="text-sm font-medium">{device.battery}%</span>
            </div>
          </div>
        )}

        {/* Device Readings */}
        {device.readings && Object.keys(device.readings).length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Current Readings</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(device.readings).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Button */}
        {canControl && device.status === 'online' && (
          <div className="pt-2">
            <Button
              onClick={() => onToggle?.(device.id)}
              variant={device.isOn ? "destructive" : "default"}
              className="w-full"
              disabled={!isLive}
            >
              {device.isOn ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Turn Off
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Turn On
                </>
              )}
            </Button>
          </div>
        )}

        {/* Live Indicator */}
        {isLive && device.status === 'online' && (
          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center space-x-2 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Live Data</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 