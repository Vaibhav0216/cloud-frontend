'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DeviceStatusCard } from '../components/DeviceStatusCard';
import { useWebSocket } from '../contexts/WebSocketProvider';
import { useTenant } from '../contexts/TenantProvider';
import { 
  Search, 
  Filter, 
  Plus, 
  Wifi, 
  WifiOff, 
  Activity,
  Settings
} from 'lucide-react';

import { Device, PumpDevice, SensorDevice, ValveDevice } from '../types/device';

interface User {
  role: 'admin' | 'operator' | 'viewer';
}

export default function DevicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'warning'>('all');
  
  const { lastMessage, isConnected } = useWebSocket();
  const { hasFeature } = useTenant();

  // Mock devices data (in real app, this would come from API)
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'pump-001',
      name: 'Main Water Pump',
      type: 'pump' as const,
      status: 'online' as const,
      location: 'Sector A',
      lastSeen: '2 minutes ago',
      battery: 85,
      canControl: true,
      isOn: true,
      readings: {
        pressure: 2.3,
        flow: 45.2
      }
    } as PumpDevice,
    {
      id: 'sensor-001',
      name: 'Temperature Sensor #1',
      type: 'sensor' as const,
      status: 'online' as const,
      location: 'Field North',
      lastSeen: '1 minute ago',
      battery: 92,
      canControl: false,
      isOn: false,
      readings: {
        temperature: 23.5
      }
    } as SensorDevice,
    {
      id: 'valve-001',
      name: 'Irrigation Valve A1',
      type: 'valve' as const,
      status: 'warning' as const,
      location: 'Sector B',
      lastSeen: '15 minutes ago',
      battery: 25,
      canControl: true,
      isOn: false,
      readings: {
        pressure: 1.8
      }
    } as ValveDevice,
    {
      id: 'pump-002',
      name: 'Backup Pump',
      type: 'pump' as const,
      status: 'offline' as const,
      location: 'Sector C',
      lastSeen: '2 hours ago',
      battery: 50,
      canControl: true,
      isOn: false,
      readings: {
        pressure: 0,
        flow: 0
      }
    } as PumpDevice,
    {
      id: 'sensor-002',
      name: 'Humidity Sensor',
      type: 'sensor' as const,
      status: 'online' as const,
      location: 'Greenhouse A',
      lastSeen: 'Just now',
      battery: 78,
      canControl: false,
      isOn: false,
      readings: {
        temperature: 22.1
      }
    } as SensorDevice,
    {
      id: 'valve-002',
      name: 'Emergency Shutoff Valve',
      type: 'valve' as const,
      status: 'online' as const,
      location: 'Main Line',
      lastSeen: '5 minutes ago',
      battery: 95,
      canControl: true,
      isOn: true,
      readings: {
        pressure: 2.8
      }
    } as ValveDevice
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('amset-user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  // Update devices with real-time telemetry data
  useEffect(() => {
    if (lastMessage && lastMessage.eventType === 'INSERT') {
      const deviceId = lastMessage.data?.deviceId;
      if (deviceId) {
        setDevices(prev => prev.map(device => {
          if (device.id === deviceId) {
            const baseUpdate = {
              ...device,
              status: 'online' as const,
              lastSeen: 'Just now'
            };

            // Type guard to ensure we handle each device type correctly
            switch (device.type) {
              case 'pump':
                return {
                  ...baseUpdate,
                  type: 'pump' as const,
                  readings: {
                    pressure: Number(lastMessage.data?.pressure) || 0,
                    flow: Number(lastMessage.data?.flow) || 0
                  }
                };
              case 'sensor':
                return {
                  ...baseUpdate,
                  type: 'sensor' as const,
                  readings: {
                    temperature: Number(lastMessage.data?.temperature) || 0
                  }
                };
              case 'valve':
                return {
                  ...baseUpdate,
                  type: 'valve' as const,
                  readings: {
                    pressure: Number(lastMessage.data?.pressure) || 0
                  }
                };
              default:
                return device;
            }
          }
          return device;
        }));
      }
    }
  }, [lastMessage]);

  const handleDeviceToggle = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || !('isOn' in device)) return;

    const newState = !device.isOn;
    
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          isOn: newState
        } as Device;
      }
      return d;
    }));

    // In a real implementation, you would send a message to control the device
    console.log(`Device ${deviceId} ${newState ? 'turned on' : 'turned off'}`);
  };

  // Filter devices based on search and status
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Devices</h1>
          <p className="text-muted-foreground">Manage and monitor all connected IoT devices across your infrastructure</p>
        </div>
        
        {user.role === 'admin' && hasFeature('deviceControl') && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {devices.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {onlineDevices}
            </div>
            <p className="text-xs text-muted-foreground">
              Operational devices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {warningDevices}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {offlineDevices}
            </div>
            <p className="text-xs text-muted-foreground">
              Disconnected devices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'online' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('online')}
          >
            <Wifi className="mr-2 h-4 w-4" />
            Online
          </Button>
          <Button
            variant={filterStatus === 'warning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('warning')}
          >
            <Activity className="mr-2 h-4 w-4" />
            Warning
          </Button>
          <Button
            variant={filterStatus === 'offline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('offline')}
          >
            <WifiOff className="mr-2 h-4 w-4" />
            Offline
          </Button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <DeviceStatusCard
            key={device.id}
            device={device}
            onToggle={hasFeature('deviceControl') ? handleDeviceToggle : undefined}
            userRole={user.role}
            isLive={isConnected}
          />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No devices found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 