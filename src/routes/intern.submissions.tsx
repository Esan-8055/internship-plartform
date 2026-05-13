import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/intern/submissions")({ component: Submissions });

const subs = [
  { t: "Auth flow", d: "May 10", s: "approved", score: 95 },
  { t: "README", d: "May 8", s: "approved", score: 90 },
  { t: "Landing page", d: "May 5", s: "needs_revision", score: null },
  { t: "API design doc", d: "May 2", s: "pending", score: null },
];

function Submissions() {
  return (
    <>
      <PageHeader title="Submissions" description="Track every artifact you've shipped." actions={<Button className="bg-gradient-primary"><Upload className="mr-2 h-4 w-4" />New submission</Button>} />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subs.map((s, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{s.t}</TableCell>
                <TableCell className="text-muted-foreground">{s.d}</TableCell>
                <TableCell>
                  <Badge className={s.s === "approved" ? "bg-success" : s.s === "needs_revision" ? "bg-destructive" : "bg-warning text-warning-foreground"}>
                    {s.s.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{s.score ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
