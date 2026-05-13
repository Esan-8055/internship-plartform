import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Megaphone, Send } from "lucide-react";

export const Route = createFileRoute("/admin/announcements")({ component: Announcements });

const past = [
  { t: "Cohort 2026 kickoff", d: "May 1", body: "Welcome to TARCIN! Orientation begins Monday." },
  { t: "New AI/ML projects live", d: "Apr 28", body: "10 new ML problem sets added to the platform." },
];

function Announcements() {
  return (
    <>
      <PageHeader title="Announcements" description="Broadcast to all interns and mentors." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle>Compose</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title</Label><Input placeholder="Announcement title" /></div>
            <div><Label>Message</Label><Textarea rows={6} placeholder="Write your message…" /></div>
            <Button className="w-full bg-gradient-primary"><Send className="mr-2 h-4 w-4" />Send to all</Button>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle>Recent</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {past.map((p, i) => (
              <div key={i} className="flex gap-3 pb-4 last:pb-0 border-b last:border-0 border-border">
                <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0"><Megaphone className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="font-semibold text-sm">{p.t} <span className="text-xs text-muted-foreground font-normal ml-1">· {p.d}</span></p>
                  <p className="text-sm text-muted-foreground mt-1">{p.body}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
