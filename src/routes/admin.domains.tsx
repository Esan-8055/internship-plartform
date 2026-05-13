import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card } from "@/components/ui/card";
import { Code2, Sparkles, LineChart, ShieldCheck, Briefcase } from "lucide-react";

export const Route = createFileRoute("/admin/domains")({ component: Domains });

const domains = [
  { n: "Full Stack", i: Code2, m: 12, intern: 124 },
  { n: "AI / ML", i: Sparkles, m: 9, intern: 98 },
  { n: "Data Science", i: LineChart, m: 6, intern: 76 },
  { n: "Cybersecurity", i: ShieldCheck, m: 4, intern: 54 },
  { n: "Cloud / DevOps", i: Briefcase, m: 3, intern: 42 },
];

function Domains() {
  return (
    <>
      <PageHeader title="Domains" description="Five tracks driving the cohort." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((d) => (
          <Card key={d.n} className="p-6 bg-gradient-card shadow-card hover:shadow-elegant transition-smooth">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground mb-4"><d.i className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold">{d.n}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-2xl font-bold">{d.m}</p>
                <p className="text-xs text-muted-foreground">Mentors</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-2xl font-bold">{d.intern}</p>
                <p className="text-xs text-muted-foreground">Interns</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
