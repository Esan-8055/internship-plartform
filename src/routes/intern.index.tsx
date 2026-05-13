import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, ListChecks, TrendingUp } from "lucide-react";
import { PageHeader, StatCard } from "@/components/tarcin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/intern/")({ component: InternHome });

const trend = [
  { w: "W1", score: 60 }, { w: "W2", score: 72 }, { w: "W3", score: 78 },
  { w: "W4", score: 85 }, { w: "W5", score: 88 }, { w: "W6", score: 92 },
];

function InternHome() {
  return (
    <>
      <PageHeader title="Welcome back, Aarav 👋" description="Here's a snapshot of your TARCIN journey." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Active tasks" value="6" hint="2 due this week" icon={ListChecks} accent="primary" />
        <StatCard label="Completed" value="16" hint="of 22 assigned" icon={CheckCircle2} accent="success" />
        <StatCard label="Attendance" value="94%" hint="Last 30 days" icon={TrendingUp} accent="primary" />
        <StatCard label="Score" value="92" hint="Top 12% of cohort" icon={Award} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader><CardTitle>Performance trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 240)" />
                <XAxis dataKey="w" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.48 0.18 255)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle>Current sprint</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { t: "Build auth flow", p: 80, s: "In review" },
              { t: "Deploy on Cloud", p: 45, s: "In progress" },
              { t: "Write README", p: 100, s: "Done" },
            ].map((x) => (
              <div key={x.t}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{x.t}</span>
                  <Badge variant={x.p === 100 ? "default" : "secondary"} className={x.p === 100 ? "bg-success" : ""}>{x.s}</Badge>
                </div>
                <Progress value={x.p} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
