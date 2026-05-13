import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TarcinLogo } from "@/components/tarcin/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TARCIN" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [step, setStep] = useState<"email" | "otp" | "role">("email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden md:flex bg-gradient-primary text-primary-foreground p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <div className="relative">
          <TarcinLogo showTagline />
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">Unlock The Tech.<br />Unleash The World.</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-md">Join thousands of interns building real-world skills with elite mentorship.</p>
        </div>
        <div className="relative text-sm text-primary-foreground/70">© 2026 TARCIN</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8"><TarcinLogo showTagline /></div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            {step === "email" && "Sign in with your email — we'll send a one-time code."}
            {step === "otp" && `Enter the 6-digit code sent to ${email}`}
            {step === "role" && "Choose how you'd like to enter the demo."}
          </p>

          {step === "email" && (
            <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("otp"); }}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" required placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-gradient-primary shadow-elegant">Send code <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          )}

          {step === "otp" && (
            <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("role"); }}>
              <div className="space-y-2">
                <Label>One-time code</Label>
                <Input maxLength={6} placeholder="••••••" className="h-12 text-center tracking-[0.5em] text-lg font-semibold" />
              </div>
              <Button type="submit" className="w-full h-11 bg-gradient-primary shadow-elegant">Verify</Button>
              <button type="button" onClick={() => setStep("email")} className="text-sm text-muted-foreground hover:text-foreground">← Use a different email</button>
            </form>
          )}

          {step === "role" && (
            <div className="mt-8 space-y-3">
              {[
                { r: "intern", label: "Intern dashboard", to: "/intern" },
                { r: "mentor", label: "Mentor dashboard", to: "/mentor" },
                { r: "admin", label: "Admin console", to: "/admin" },
                { r: "onboard", label: "New here — start onboarding", to: "/onboarding" },
              ].map((o) => (
                <button
                  key={o.r}
                  onClick={() => navigate({ to: o.to })}
                  className="w-full text-left bg-card border border-border hover:border-primary rounded-xl px-4 py-3.5 transition-smooth flex items-center justify-between group"
                >
                  <span className="font-medium">{o.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                </button>
              ))}
              <p className="text-xs text-muted-foreground pt-2">Demo mode — pick a role to preview the experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
