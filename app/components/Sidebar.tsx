'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Bell, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Cpu, label: 'Devices', href: '/devices' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className={`amset-sidebar transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold text-lg">AMSET</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (  
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActiveItem(item.label)}
              className={`amset-nav-item ${activeItem === item.label ? 'active' : ''}`}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </a>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-2">Connection Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation"></div>
              <span className="text-sm text-gray-300">Connected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 