import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/intern/tasks")({ component: InternTasks });

const tasks = [
  { t: "Implement JWT-style auth flow", d: "2026-05-15", p: "high", s: "in_progress", mentor: "Priya N." },
  { t: "Deploy backend to Lovable Cloud", d: "2026-05-16", p: "high", s: "todo", mentor: "Priya N." },
  { t: "Write project README", d: "2026-05-12", p: "low", s: "done", mentor: "Priya N." },
  { t: "Build admin dashboard", d: "2026-05-20", p: "medium", s: "todo", mentor: "Priya N." },
  { t: "Add unit tests for auth", d: "2026-05-22", p: "medium", s: "in_progress", mentor: "Priya N." },
];

const pColor: Record<string, string> = { high: "bg-destructive/10 text-destructive", medium: "bg-warning/15 text-warning", low: "bg-muted text-muted-foreground" };

function InternTasks() {
  return (
    <>
      <PageHeader title="My tasks" description="Stay on top of mentor-assigned work." />
      <div className="space-y-3">
        {tasks.map((t, i) => (
          <Card key={i} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className={pColor[t.p]}>{t.p}</Badge>
                  {t.s === "done" && <Badge className="bg-success">Completed</Badge>}
                  {t.s === "in_progress" && <Badge variant="secondary">In progress</Badge>}
                </div>
                <h3 className="font-semibold">{t.t}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due {t.d}</span>
                  <span>Mentor · {t.mentor}</span>
                </p>
              </div>
              <Button variant="outline" size="sm">Open <ExternalLink className="ml-1.5 h-3 w-3" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
