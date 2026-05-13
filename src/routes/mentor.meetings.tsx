import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Plus } from "lucide-react";

export const Route = createFileRoute("/mentor/meetings")({ component: Meetings });

const meetings = [
  { t: "Weekly 1:1 with Aarav", d: "Tomorrow · 4:00 PM", link: "meet.google.com/abc-defg" },
  { t: "Sprint review · Full Stack pod", d: "Fri · 11:00 AM", link: "meet.google.com/xyz-1234" },
  { t: "Career planning · Karan", d: "Mon · 3:00 PM", link: "zoom.us/j/9876543210" },
];

function Meetings() {
  return (
    <>
      <PageHeader title="Meetings" description="Schedule 1:1s and group reviews." actions={<Button className="bg-gradient-primary"><Plus className="mr-2 h-4 w-4" />Schedule meeting</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {meetings.map((m, i) => (
          <Card key={i} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center"><Calendar className="h-5 w-5 text-primary" /></div>
                <div className="flex-1">
                  <p className="font-semibold">{m.t}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{m.d}</p>
                  <Button variant="link" size="sm" className="px-0 mt-2"><Video className="h-3.5 w-3.5 mr-1.5" />{m.link}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
