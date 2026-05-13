import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/mentors")({ component: Mentors });

const mentors = [
  { n: "Priya Nair", e: "priya@tarcin.dev", d: "Full Stack", interns: 12 },
  { n: "Arun Krishnan", e: "arun@tarcin.dev", d: "AI / ML", interns: 9 },
  { n: "Neha Bhatt", e: "neha@tarcin.dev", d: "Cybersecurity", interns: 7 },
  { n: "Rajesh Khanna", e: "rajesh@tarcin.dev", d: "Cloud / DevOps", interns: 6 },
];

function Mentors() {
  return (
    <>
      <PageHeader title="Mentors" description="Invite and manage your mentorship team." actions={<Button className="bg-gradient-primary"><Plus className="mr-2 h-4 w-4" />Invite mentor</Button>} />
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Domain</TableHead><TableHead>Interns</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {mentors.map((m) => (
              <TableRow key={m.e}>
                <TableCell className="font-medium">{m.n}</TableCell>
                <TableCell className="text-muted-foreground">{m.e}</TableCell>
                <TableCell><Badge variant="secondary">{m.d}</Badge></TableCell>
                <TableCell>{m.interns}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
