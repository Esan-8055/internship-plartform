import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, Download } from "lucide-react";

export const Route = createFileRoute("/admin/certificates")({ component: Certificates });

const cert = [
  { n: "Aarav Sharma", d: "Full Stack", m: "Priya Nair", s: "ready" },
  { n: "Sneha Reddy", d: "AI / ML", m: "Arun Krishnan", s: "issued" },
  { n: "Karan Verma", d: "Full Stack", m: "Priya Nair", s: "ready" },
  { n: "Diya Singh", d: "Data Science", m: "Neha Bhatt", s: "issued" },
];

function Certificates() {
  return (
    <>
      <PageHeader title="Certificates" description="Generate branded TARCIN certificates of completion." />
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Intern</TableHead><TableHead>Domain</TableHead><TableHead>Mentor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {cert.map((c) => (
              <TableRow key={c.n}>
                <TableCell className="font-medium">{c.n}</TableCell>
                <TableCell>{c.d}</TableCell>
                <TableCell className="text-muted-foreground">{c.m}</TableCell>
                <TableCell><Badge className={c.s === "issued" ? "bg-success" : "bg-warning text-warning-foreground"}>{c.s}</Badge></TableCell>
                <TableCell className="text-right">
                  {c.s === "issued"
                    ? <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Download</Button>
                    : <Button size="sm" className="bg-gradient-primary"><Award className="h-4 w-4 mr-1.5" />Generate</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
