import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/intern/leaderboard")({ component: Leaderboard });

const top = [
  { n: "Sneha Reddy", d: "AI / ML", s: 98 },
  { n: "Karan Verma", d: "Full Stack", s: 96 },
  { n: "Aarav Sharma", d: "Full Stack", s: 92, me: true },
  { n: "Diya Singh", d: "Data Science", s: 90 },
  { n: "Rohan Patel", d: "Cybersecurity", s: 88 },
  { n: "Meera Joshi", d: "Cloud / DevOps", s: 86 },
  { n: "Arjun Iyer", d: "AI / ML", s: 84 },
];

function Leaderboard() {
  return (
    <>
      <PageHeader title="Leaderboard" description="Live rankings across all TARCIN cohorts." />
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {top.slice(0, 3).map((u, i) => (
          <Card key={u.n} className={`p-6 text-center shadow-card ${i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-gradient-card"}`}>
            <Trophy className={`h-8 w-8 mx-auto mb-3 ${i === 0 ? "text-primary-foreground" : i === 1 ? "text-muted-foreground" : "text-warning"}`} />
            <p className="text-xs uppercase tracking-wider opacity-80">Rank #{i + 1}</p>
            <p className="text-xl font-bold mt-1">{u.n}</p>
            <p className="text-sm opacity-80">{u.d}</p>
            <p className="text-3xl font-bold mt-3">{u.s}</p>
          </Card>
        ))}
      </div>
      <Card className="divide-y divide-border">
        {top.map((u, i) => (
          <div key={u.n} className={`flex items-center gap-4 p-4 ${u.me ? "bg-primary/5" : ""}`}>
            <span className="w-8 text-center font-bold text-muted-foreground">{i + 1}</span>
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{u.n.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
            <div className="flex-1">
              <p className="font-medium">{u.n} {u.me && <span className="text-xs text-primary">(you)</span>}</p>
              <p className="text-xs text-muted-foreground">{u.d}</p>
            </div>
            <p className="font-bold text-lg">{u.s}</p>
          </div>
        ))}
      </Card>
    </>
  );
}
