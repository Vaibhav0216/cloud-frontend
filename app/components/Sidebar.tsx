'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from "lucide-react";
import {
  LayoutDashboard,
  Cpu,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Clock,
  CalendarDays,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Cpu, label: 'Devices', href: '/devices' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
 
  { 
    icon: BarChart3, 
    label: 'Reports', 
    href: '/reports',
    hasDropdown: true,
    dropdownItems: [
      { icon: FileText, label: 'Log Report', href: '/reports/log' },
      { icon: Calendar, label: 'Hourly Report', href: '/reports/hourly' },
      { icon: Clock, label: 'Daily Report', href: '/reports/daily' },
      { icon: CalendarDays, label: 'Monthly Report', href: '/reports/monthly' },
    ]
  },
  { icon: User, label: 'User Log', href: '/user-log' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname() || '/';
  const [expandedDropdowns, setExpandedDropdowns] = useState<string[]>([]);

  const toggleDropdown = (label: string) => {
    setExpandedDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  // helpers
  const isPathActive = (href?: string) => !!href && (pathname === href || pathname.startsWith(href + '/'));

  // auto-open Reports when route is under /reports
  useEffect(() => {
    if (pathname.startsWith('/reports')) {
      setExpandedDropdowns((prev) => (prev.includes('Reports') ? prev : [...prev, 'Reports']));
    }
  }, [pathname]);

  return (
    <div
      className={`amset-sidebar relative h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-sidebar border-r border-sidebar-border text-sidebar-foreground`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[10px] border-b border-sidebar-border bg-sidebar/50 backdrop-blur-md">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-accent shadow-lg flex items-center justify-center relative overflow-hidden">
              <span className="text-sidebar-primary-foreground font-bold text-sm relative z-10">
                A
              </span>
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <span className="ml-3 font-bold text-sidebar-foreground text-lg tracking-wide">
              AMSET
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-sidebar-accent/20 text-sidebar-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        {!isCollapsed && (
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-4 tracking-widest px-2">
            Navigation
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.hasDropdown ? pathname.startsWith('/reports') : isPathActive(item.href);
          const isDropdownExpanded = expandedDropdowns.includes(item.label);

          if (item.hasDropdown) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`flex items-center justify-between w-full px-3 py-2 mb-2 rounded-xl transition-colors relative group ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      <div
                        className={`absolute left-[-10px] top-0 h-full w-[3px] bg-gradient-to-b from-sidebar-primary to-sidebar-accent rounded-r-full transform transition-transform duration-300 ${
                          isActive
                            ? 'scale-y-100'
                            : 'scale-y-0 group-hover:scale-y-100'
                        }`}
                      />
                    </div>
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    isDropdownExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {/* Dropdown Items */}
                {!isCollapsed && isDropdownExpanded && (
                  <div className="ml-6 mb-2 space-y-1">
                    {item.dropdownItems?.map((dropdownItem) => {
                      const DropdownIcon = dropdownItem.icon;
                      const isDropdownActive = isPathActive(dropdownItem.href);
                      
                      return (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className={`flex items-center px-3 py-2 rounded-lg transition-colors relative group ${
                            isDropdownActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-500 hover:text-white'
                          }`}
                        >
                          <DropdownIcon className="w-4 h-4" />
                          <span className="ml-3 text-sm">{dropdownItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-3 py-2 mb-2 rounded-xl transition-colors relative group ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-500 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                <div
                  className={`absolute left-[-10px] top-0 h-full w-[3px] bg-gradient-to-b from-sidebar-primary to-sidebar-accent rounded-r-full transform transition-transform duration-300 ${
                    isActive
                      ? 'scale-y-100'
                      : 'scale-y-0 group-hover:scale-y-100'
                  }`}
                />
              </div>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Connection Status */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-popover border border-border p-4 rounded-xl backdrop-blur-md shadow-md">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-2 tracking-wider">
              Connection Status
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-ping shadow-green-500/30 shadow-sm" />
              <span className="text-sm text-foreground">Connected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
