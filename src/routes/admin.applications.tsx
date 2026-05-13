import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/applications")({ component: Applications });

const apps = [
  { n: "Ananya Bose", c: "BITS Pilani", d: "AI / ML", s: "Python, PyTorch, NLP" },
  { n: "Vikram Singh", c: "IIT Bombay", d: "Full Stack", s: "React, Node, Postgres" },
  { n: "Tara Mehta", c: "NIT Trichy", d: "Cybersecurity", s: "Burp, Linux, Networking" },
  { n: "Yash Gupta", c: "VIT Vellore", d: "Cloud / DevOps", s: "AWS, Terraform, K8s" },
];

function Applications() {
  return (
    <>
      <PageHeader title="Applications" description="Review and approve new interns." />
      <div className="space-y-3">
        {apps.map((a) => (
          <Card key={a.n} className="p-5 flex flex-col md:flex-row md:items-center gap-4 shadow-card">
            <Avatar className="h-12 w-12"><AvatarFallback className="bg-gradient-primary text-primary-foreground">{a.n.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">{a.n}</h3>
                <Badge variant="outline">{a.d}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{a.c}</p>
              <p className="text-xs text-muted-foreground mt-1">Skills: {a.s}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1.5" />View</Button>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30"><X className="h-4 w-4 mr-1.5" />Reject</Button>
              <Button size="sm" className="bg-success hover:bg-success/90"><Check className="h-4 w-4 mr-1.5" />Approve</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
