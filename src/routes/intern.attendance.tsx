import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/intern/attendance")({ component: Attendance });

function Attendance() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const present = new Set([1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29, 30]);
  return (
    <>
      <PageHeader title="Attendance" description="Mark daily check-in to keep your streak alive." actions={<Button className="bg-gradient-primary"><Check className="mr-2 h-4 w-4" />Check in today</Button>} />
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card><CardHeader><CardTitle className="text-3xl">22</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Days present</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-3xl">94%</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Attendance rate</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-3xl">12</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Current streak</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>May 2026</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => (
              <div key={d} className={`aspect-square rounded-lg grid place-items-center text-sm font-medium border ${present.has(d) ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground border-border"}`}>{d}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
