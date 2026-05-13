import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, FileCheck, Award } from "lucide-react";
import { PageHeader, StatCard } from "@/components/tarcin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

const status = [
  { name: "Approved", value: 156, color: "oklch(0.62 0.16 155)" },
  { name: "Pending", value: 42, color: "oklch(0.78 0.15 75)" },
  { name: "Rejected", value: 18, color: "oklch(0.6 0.22 25)" },
];
const byDomain = [
  { d: "Full Stack", t: 124 },
  { d: "AI / ML", t: 98 },
  { d: "Data Science", t: 76 },
  { d: "Cybersecurity", t: 54 },
  { d: "Cloud", t: 42 },
];

function AdminHome() {
  return (
    <>
      <PageHeader title="Admin overview" description="Cohort 2026 · TARCIN command center." />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard label="Total interns" value="216" icon={GraduationCap} accent="primary" />
        <StatCard label="Active mentors" value="34" icon={Users} accent="primary" />
        <StatCard label="Pending applications" value="42" icon={FileCheck} accent="warning" />
        <StatCard label="Certificates issued" value="89" icon={Award} accent="success" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Applications status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={status} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {status.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tasks per domain</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={byDomain} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 240)" />
                <XAxis dataKey="d" stroke="oklch(0.5 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="t" fill="oklch(0.48 0.18 255)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
