import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1.5">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, accent }: { label: string; value: string; hint?: string; icon: React.ComponentType<{ className?: string }>; accent?: "primary" | "success" | "warning" }) {
  const accentClass = accent === "success" ? "bg-success/10 text-success" : accent === "warning" ? "bg-warning/15 text-warning" : "bg-primary/10 text-primary";
  return (
    <Card className="bg-gradient-card shadow-card border-border">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardDescription>{label}</CardDescription>
        <div className={`h-9 w-9 rounded-lg grid place-items-center ${accentClass}`}><Icon className="h-4 w-4" /></div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl font-bold">{value}</CardTitle>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}
