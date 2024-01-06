'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import {Card} from '@/components/ui/card';

interface ChartProps {
  data: {
    name: string;
    students: number;
  }[];
}

export const Chart = ({data}: ChartProps) => {
  return (
    <Card>
      <ResponsiveContainer
        width="100%"
        height={350}
        className="overflow-x-auto">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `${Math.round(value)}`}
          />
          <Tooltip
            formatter={(value: number) => `${Math.floor(value)}`}
            contentStyle={{
              color: 'black',
            }}
          />
          <Bar dataKey="students" fill="#0369a1" radius={[2, 2, 0.5, 0.5]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
