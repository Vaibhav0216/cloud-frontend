'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Cpu,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
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
    <div
      className={`amset-sidebar relative h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 shadow-lg`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-600 bg-slate-800/50 backdrop-blur-md">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 shadow-lg flex items-center justify-center relative overflow-hidden">
              <span className="text-white font-bold text-sm relative z-10">A</span>
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <span className="ml-3 font-bold text-white text-lg tracking-wide">AMSET</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-blue-900/30 text-slate-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        {!isCollapsed && (
          <div className="text-xs font-semibold uppercase text-slate-500 mb-4 tracking-widest px-2">
            Navigation
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActiveItem(item.label)}
              className={`flex items-center px-3 py-2 mb-2 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/10 text-blue-400 shadow-md font-semibold'
                  : 'text-slate-400 hover:bg-blue-900/20 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                <div
                  className={`absolute left-[-10px] top-0 h-full w-[3px] bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full transform transition-transform duration-300 ${
                    isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                  }`}
                />
              </div>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Connection Status */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl backdrop-blur-md shadow-md">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-2 tracking-wider">
              Connection Status
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 animate-ping shadow-green-500/30 shadow-sm" />
              <span className="text-sm text-slate-200">Connected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
