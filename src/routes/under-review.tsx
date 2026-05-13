import { createFileRoute, Link } from "@tanstack/react-router";
import { TarcinLogo } from "@/components/tarcin/Logo";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/under-review")({
  head: () => ({ meta: [{ title: "Under review — TARCIN" }] }),
  component: UnderReview,
});

function UnderReview() {
  return (
    <div className="min-h-screen bg-gradient-hero grid place-items-center px-4">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-10 shadow-elegant">
        <div className="flex justify-center mb-6"><TarcinLogo size="lg" /></div>
        <div className="h-16 w-16 mx-auto rounded-full bg-warning/15 grid place-items-center mb-5">
          <Clock className="h-8 w-8 text-warning animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold">Application under review</h1>
        <p className="text-muted-foreground mt-3">Our team is reviewing your profile. You'll receive an email when a decision is made — usually within 24–48 hours.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <Button variant="outline" asChild><Link to="/">Back home</Link></Button>
          <Button asChild className="bg-gradient-primary"><Link to="/intern">Preview dashboard</Link></Button>
        </div>
      </div>
    </div>
  );
}
