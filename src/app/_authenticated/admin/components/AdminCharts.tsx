"use client";

import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";

interface AdminChartsProps {
  type: "donut" | "bar";
  data: any[];
}

export function AdminCharts({ type, data }: AdminChartsProps) {
  if (type === "donut") {
    // If no data, provide dummy data matching screenshot
    const chartData = data.some(d => d.value > 0) ? data : [
      { name: "Approved", value: 120, color: "#10b981" },
      { name: "Pending", value: 42, color: "#f59e0b" },
      { name: "Rejected", value: 25, color: "#ef4444" }
    ];

    return (
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const barData = data.length > 0 && data.some(d => d.value > 0) ? data : [
    { name: "Full Stack", value: 124 },
    { name: "AI / ML", value: 98 },
    { name: "Data Science", value: 76 },
    { name: "Cybersecurity", value: 54 },
    { name: "Cloud", value: 42 },
  ];

  return (
    <div className="h-[280px] w-full -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" fill="#026ae6" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
