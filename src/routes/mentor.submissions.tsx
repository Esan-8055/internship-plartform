import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/mentor/submissions")({ component: MentorSubs });

const subs = [
  { i: "Aarav Sharma", t: "JWT auth implementation", d: "2h ago", url: "auth-pr.zip" },
  { i: "Karan Verma", t: "Admin dashboard v1", d: "5h ago", url: "dashboard.zip" },
  { i: "Sneha Reddy", t: "ML training notebook", d: "1d ago", url: "model.ipynb" },
];

function MentorSubs() {
  return (
    <>
      <PageHeader title="Pending reviews" description="Approve or request changes." />
      <div className="space-y-3">
        {subs.map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-gradient-primary text-primary-foreground">{s.i.split(" ").map(x => x[0]).join("")}</AvatarFallback></Avatar>
              <div className="flex-1">
                <p className="font-semibold">{s.t}</p>
                <p className="text-sm text-muted-foreground">{s.i} · {s.d}</p>
                <Badge variant="outline" className="mt-2"><FileText className="h-3 w-3 mr-1" />{s.url}</Badge>
              </div>
              <div className="flex gap-2 self-stretch md:self-auto">
                <Button variant="outline" size="sm"><XCircle className="mr-1.5 h-4 w-4" />Request changes</Button>
                <Button size="sm" className="bg-success hover:bg-success/90"><CheckCircle2 className="mr-1.5 h-4 w-4" />Approve</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
