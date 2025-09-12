'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/TopNavbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketProvider';

function MonthlyReportContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { isConnected } = useWebSocket();

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
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Monthly Report Page</h1>
                <p className="text-muted-foreground">View monthly analytics and long-term trends</p>
              </div>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Monthly Analytics</h2>
                <p className="text-muted-foreground">
                  This section will contain monthly analytics, comprehensive reports,
                  and long-term performance trends. Add detailed charts and insights here.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Long-term Trends</h2>
                <p className="text-muted-foreground">
                  This section will display long-term trends, seasonal patterns,
                  and predictive analytics. Add forecasting and comparison tools here.
                </p>
              </div>
            </div>
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
