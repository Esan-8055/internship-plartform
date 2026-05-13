"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const lineData = [
  { name: 'Week 1', score: 60 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 78 },
  { name: 'Week 4', score: 85 },
  { name: 'Week 5', score: 88 },
  { name: 'Week 6', score: 92 },
];

export function OverviewCharts() {
  return (
    <div className="flex-1 min-h-0 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            dy={10}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#026ae6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#fff', stroke: '#026ae6', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#026ae6', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
