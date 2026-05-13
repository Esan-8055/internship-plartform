import { createFileRoute } from "@tanstack/react-router";
import { Users, Inbox, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, StatCard } from "@/components/tarcin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/mentor/")({ component: MentorHome });

const data = [
  { d: "Mon", s: 8 }, { d: "Tue", s: 12 }, { d: "Wed", s: 6 },
  { d: "Thu", s: 14 }, { d: "Fri", s: 10 }, { d: "Sat", s: 4 }, { d: "Sun", s: 2 },
];

const interns = [
  { n: "Aarav Sharma", p: 92, t: 16 },
  { n: "Karan Verma", p: 96, t: 18 },
  { n: "Diya Singh", p: 88, t: 14 },
  { n: "Rohan Patel", p: 78, t: 11 },
];

function MentorHome() {
  return (
    <>
      <PageHeader title="Mentor dashboard" description="Your interns at a glance." />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard label="Interns" value="12" icon={Users} accent="primary" />
        <StatCard label="Pending reviews" value="8" icon={Inbox} accent="warning" />
        <StatCard label="Approved this week" value="24" icon={CheckCircle2} accent="success" />
        <StatCard label="Hours mentored" value="42" icon={Clock} accent="primary" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Submissions this week</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 240)" />
                <XAxis dataKey="d" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="s" fill="oklch(0.48 0.18 255)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>My interns</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {interns.map((u) => (
              <div key={u.n} className="flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{u.n.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{u.n}</p>
                  <p className="text-xs text-muted-foreground">{u.t} tasks · score {u.p}</p>
                </div>
                <Badge variant="secondary">{u.p}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
