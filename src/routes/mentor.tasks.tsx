import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/mentor/tasks")({ component: MentorTasks });

const tasks = [
  { t: "Implement JWT auth", a: "Aarav S.", d: "May 15", p: "high" },
  { t: "Build admin dashboard", a: "Karan V.", d: "May 20", p: "medium" },
  { t: "ML model fine-tune", a: "Sneha R.", d: "May 18", p: "high" },
  { t: "Setup CI pipeline", a: "Rohan P.", d: "May 25", p: "low" },
];

function MentorTasks() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Assigned tasks" description="Create and track work for your interns." actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-primary"><Plus className="mr-2 h-4 w-4" />New task</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create new task</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title</Label><Input placeholder="Task name" /></div>
              <div><Label>Description</Label><Textarea rows={4} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Assign to</Label><Input placeholder="Intern" /></div>
                <div><Label>Due date</Label><Input type="date" /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => setOpen(false)} className="bg-gradient-primary">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Task</TableHead><TableHead>Assignee</TableHead><TableHead>Due</TableHead><TableHead>Priority</TableHead></TableRow></TableHeader>
          <TableBody>
            {tasks.map((t, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{t.t}</TableCell>
                <TableCell>{t.a}</TableCell>
                <TableCell className="text-muted-foreground">{t.d}</TableCell>
                <TableCell><Badge variant="outline" className={t.p === "high" ? "border-destructive text-destructive" : t.p === "medium" ? "border-warning text-warning" : ""}>{t.p}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
