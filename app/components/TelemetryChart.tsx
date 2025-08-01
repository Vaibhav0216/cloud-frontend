'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Thermometer, Gauge, Droplets } from 'lucide-react';

interface TelemetryData {
  timestamp: string;
  temperature: number;
  pressure: number;
  waterLevel: number;
}

interface TelemetryChartProps {
  data: TelemetryData[];
  type: 'temperature' | 'pressure' | 'waterLevel';
  title: string;
  color: string;
}

export default function TelemetryChart({ data, type, title, color }: TelemetryChartProps) {
  // Debug: Log chart data
  // console.log(`📈 ${title} chart data:`, data);
  
  const getIcon = () => {
    switch (type) {
      case 'temperature': return <Thermometer size={20} />;
      case 'pressure': return <Gauge size={20} />;
      case 'waterLevel': return <Droplets size={20} />;
      default: return <Thermometer size={20} />;
    }
  };

  const getUnit = () => {
    switch (type) {
      case 'temperature': return '°C';
      case 'pressure': return 'PSI';
      case 'waterLevel': return '%';
      default: return '';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="amset-card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-blue-600 dark:text-blue-400">
          {getIcon()}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `${value}${getUnit()}`}
            />
            <Tooltip 
              labelFormatter={formatTimestamp}
              formatter={(value: any) => [`${value}${getUnit()}`, title]}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={type} 
              stroke={color} 
              fill={color}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Current Value Display */}
      {data.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {data[data.length - 1][type]}{getUnit()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current {title}
          </div>
        </div>
      )}
    </div>
  );
} 