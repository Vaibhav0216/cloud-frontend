'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../components/ui/table';
import { Monitor, Wifi, XCircle } from 'lucide-react'; // 🔹 Added XCircle
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

type DeviceStatus = 'Online' | 'Offline';

interface DeviceRow {
  id: number;
  name: string;
  location: string;
  status: DeviceStatus;
  lastActive: string;
}

export default function DevicesPage() {
  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dummy user (replace with actual logged-in user data from context or API)
  const user = {
    name: 'Admin User',
    role: 'Admin',
    company: 'SmartFarm Inc.',
  };

  // Example connection state (replace with actual socket or API connection state)
  const [isConnected] = useState(true);

  const devices: DeviceRow[] = [
    { id: 1, name: 'Main Water Pump', location: 'Sector A', status: 'Online', lastActive: 'Just now' },
    { id: 2, name: 'Temperature Sensor #1', location: 'Field North', status: 'Online', lastActive: '1 min ago' },
    { id: 3, name: 'Irrigation Valve A1', location: 'Sector B', status: 'Offline', lastActive: '2 hours ago' },
    { id: 4, name: 'Backup Pump', location: 'Sector C', status: 'Offline', lastActive: 'Yesterday' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar user={user} isConnected={isConnected} />

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Devices</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registered Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Overview of connected devices and latest activity.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr No</TableHead>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((d) => {
                    const isOnline = d.status === 'Online';
                    return (
                      <TableRow key={d.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{d.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Monitor size={16} className="text-muted-foreground" />
                            <span>{d.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span>{d.location}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isOnline ? (
                              <Wifi size={16} className="text-green-500" />
                            ) : (
                              <XCircle size={16} className="text-red-500" />
                            )}
                            <Badge
                              className={isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                            >
                              {d.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{d.lastActive}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
