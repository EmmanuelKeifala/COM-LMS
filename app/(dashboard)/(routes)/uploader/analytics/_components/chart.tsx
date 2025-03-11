'use client';
import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ChartProps {
  data: {
    name: string;
    students: number;
  }[];
  title?: string;
  subtitle?: string;
}

export const Chart = React.memo(({ data, title = "Student Distribution", subtitle }: ChartProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            {`${payload[0].value.toLocaleString()} Students`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Memoize the chart configuration
  const chartConfig = useMemo(
    () => ({
      xAxis: {
        dataKey: 'name',
        stroke: '#64748b',
        fontSize: 12,
        tickLine: false,
        axisLine: true,
        padding: { left: 20, right: 20 },
      },
      yAxis: {
        stroke: '#64748b',
        fontSize: 12,
        tickLine: false,
        axisLine: true,
        tickFormatter: (value: number) => `${value.toLocaleString()}`,
        width: 80,
      },
      grid: {
        strokeDasharray: '3 3',
        stroke: '#e2e8f0',
      },
      bar: {
        dataKey: 'students',
        fill: '#3b82f6',
        radius: [6, 6, 0, 0] as [number, number, number, number],
        maxBarSize: 60,
      },
    }),
    []
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid {...chartConfig.grid} />
              <XAxis {...chartConfig.xAxis} />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
              <Bar {...chartConfig.bar} name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

Chart.displayName = 'Chart';

export default Chart;