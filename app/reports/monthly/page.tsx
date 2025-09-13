'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/TopNavbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Calendar, 
  Clock, 
  Table, 
  BarChart3, 
  Download, 
  Filter,
  Home,
  FileText,
  Clock3,
  CalendarDays,
  TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LogRecord {
  srNo: number;
  date: string;
  time: string;
  level: number;
  flowRate: number;
  totalFlow: number;
}

interface ChartData {
  time: string;
  level: number;
  flowRate: number;
  totalFlow: number;
}

function MonthlyReportContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { isConnected } = useWebSocket();
  const pathname = usePathname();
  
  // Filter states for monthly reports
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');
  
  // View states
  const [showTable, setShowTable] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('monthly-report');

  // Mock data for demonstration
  const mockLogData: LogRecord[] = [
    { srNo: 1, date: '2024-01-15', time: '08:00:00', level: 85.2, flowRate: 45.3, totalFlow: 1200.5 },
    { srNo: 2, date: '2024-01-15', time: '08:15:00', level: 87.1, flowRate: 47.8, totalFlow: 1250.2 },
    { srNo: 3, date: '2024-01-15', time: '08:30:00', level: 89.5, flowRate: 49.2, totalFlow: 1300.8 },
    { srNo: 4, date: '2024-01-15', time: '08:45:00', level: 91.3, flowRate: 51.7, totalFlow: 1350.1 },
    { srNo: 5, date: '2024-01-15', time: '09:00:00', level: 88.7, flowRate: 48.9, totalFlow: 1400.3 },
    { srNo: 6, date: '2024-01-15', time: '09:15:00', level: 86.4, flowRate: 46.2, totalFlow: 1450.7 },
    { srNo: 7, date: '2024-01-15', time: '09:30:00', level: 84.8, flowRate: 44.6, totalFlow: 1500.9 },
    { srNo: 8, date: '2024-01-15', time: '09:45:00', level: 82.1, flowRate: 42.3, totalFlow: 1550.4 },
    { srNo: 9, date: '2024-01-15', time: '10:00:00', level: 79.6, flowRate: 40.1, totalFlow: 1600.8 },
    { srNo: 10, date: '2024-01-15', time: '10:15:00', level: 77.3, flowRate: 38.7, totalFlow: 1650.2 }
  ];

  const chartData: ChartData[] = mockLogData.map(record => ({
    time: record.time,
    level: record.level,
    flowRate: record.flowRate,
    totalFlow: record.totalFlow
  }));

  const handleShowRecord = () => {
    setShowTable(true);
    setShowGraph(false);
  };

  const handleShowGraph = () => {
    setShowTable(false);
    setShowGraph(true);
  };

  const handleExportExcel = () => {
    // In a real application, this would generate and download an Excel file
    console.log('Exporting to Excel...');
    alert('Excel export functionality would be implemented here');
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'log-report', label: 'Log Report', icon: FileText },
    { id: 'hourly-report', label: 'Hourly Report', icon: Clock3 },
    { id: 'daily-report', label: 'Daily Report', icon: CalendarDays },
    { id: 'monthly-report', label: 'Monthly Report', icon: TrendingUp }
  ];

  if (!user) return null;

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
          <div className="space-y-6">
            {/* Header with Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Reports Dashboard</h1>
                  <p className="text-muted-foreground">View and analyze system data across different time periods</p>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              {/* <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                        activeTab === tab.id
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div> */}
            </div>

            {/* Filters Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter size={20} />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">From Month</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="month"
                        value={fromMonth}
                        onChange={(e) => setFromMonth(e.target.value)}
                        className="pl-10"
                        placeholder="Select start month"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">To Month</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="month"
                        value={toMonth}
                        onChange={(e) => setToMonth(e.target.value)}
                        className="pl-10"
                        placeholder="Select end month"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleShowRecord} className="flex items-center space-x-2">
                <Table size={16} />
                <span>Show Record</span>
              </Button>
              
              <Button onClick={handleShowGraph} variant="outline" className="flex items-center space-x-2">
                <BarChart3 size={16} />
                <span>Show Graph</span>
              </Button>
              
              <Button 
                onClick={handleExportExcel} 
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Download size={16} />
                <span>Export to Excel</span>
              </Button>
            </div>

            {/* Table View */}
            {showTable && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Table size={20} />
                    <span>Log Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-foreground">Sr. No</th>
                          <th className="text-left p-3 font-medium text-foreground">Date</th>
                          <th className="text-left p-3 font-medium text-foreground">Time</th>
                          <th className="text-left p-3 font-medium text-foreground">Level (%)</th>
                          <th className="text-left p-3 font-medium text-foreground">Flow Rate (L/min)</th>
                          <th className="text-left p-3 font-medium text-foreground">Total Flow (L)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockLogData.map((record) => (
                          <tr key={record.srNo} className="border-b hover:bg-muted/50">
                            <td className="p-3 text-foreground">{record.srNo}</td>
                            <td className="p-3 text-foreground">{record.date}</td>
                            <td className="p-3 text-foreground">{record.time}</td>
                            <td className="p-3 text-foreground">{record.level}</td>
                            <td className="p-3 text-foreground">{record.flowRate}</td>
                            <td className="p-3 text-foreground">{record.totalFlow}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Graph View */}
            {showGraph && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 size={20} />
                    <span>Data Visualization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="level" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="Level (%)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="flowRate" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Flow Rate (L/min)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalFlow" 
                          stroke="#F59E0B" 
                          strokeWidth={2}
                          name="Total Flow (L)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Default View - Show when no table or graph is selected */}
            {!showTable && !showGraph && (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Data Displayed</h3>
                    <p className="text-muted-foreground">
                      Use the "Show Record" or "Show Graph" buttons above to view your data
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MonthlyReportPage() {
  return (
    <ProtectedRoute>
      <MonthlyReportContent />
    </ProtectedRoute>
  );
}
