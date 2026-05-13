import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Briefcase, Code2, GraduationCap, LineChart, MessageSquare, ShieldCheck, Sparkles, Users } from "lucide-react";
import { TarcinLogo } from "@/components/tarcin/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TARCIN — Internship Management Platform" },
      { name: "description", content: "TARCIN: Unlock The Tech, Unleash The World. End-to-end internship management for interns, mentors, and admins." },
      { property: "og:title", content: "TARCIN — Internship Management Platform" },
      { property: "og:description", content: "Unlock The Tech, Unleash The World." },
    ],
  }),
  component: Landing,
});

const domains = [
  { icon: Code2, name: "Full Stack" },
  { icon: Sparkles, name: "AI / ML" },
  { icon: LineChart, name: "Data Science" },
  { icon: ShieldCheck, name: "Cybersecurity" },
  { icon: Briefcase, name: "Cloud / DevOps" },
];

const features = [
  { icon: GraduationCap, title: "Guided onboarding", desc: "Apply, get reviewed, and start your journey with a verified mentor." },
  { icon: Users, title: "Mentor workflows", desc: "Assign tasks, review submissions, schedule 1:1 meetings effortlessly." },
  { icon: Award, title: "Verified certificates", desc: "Branded TARCIN certificates auto-generated on program completion." },
  { icon: MessageSquare, title: "AI career coach", desc: "Chat with an AI mentor for resumes, interviews, and skills paths." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <TarcinLogo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-smooth">Features</a>
            <a href="#domains" className="hover:text-foreground transition-smooth">Domains</a>
            <a href="#how" className="hover:text-foreground transition-smooth">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
            <Button asChild className="bg-gradient-primary shadow-elegant hover:opacity-95">
              <Link to="/login">Get started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Internship cohort 2026 · Now open
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Unlock The Tech.<br />
              <span className="text-gradient-primary">Unleash The World.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              TARCIN is the all-in-one internship management platform connecting ambitious interns with elite mentors across the world's most in-demand tech domains.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary shadow-elegant hover:opacity-95">
                <Link to="/login">Apply as intern <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Join as mentor</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm">
              <Stat n="2.4k+" label="Interns trained" />
              <Stat n="180+" label="Active mentors" />
              <Stat n="96%" label="Completion rate" />
            </div>
          </div>

          {/* Hero card mock */}
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative bg-card rounded-2xl shadow-elegant border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary" />
                  <div>
                    <p className="text-sm font-semibold">Aarav Sharma</p>
                    <p className="text-xs text-muted-foreground">Full Stack · Week 4</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">On track</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{ k: "Tasks", v: "18" }, { k: "Submitted", v: "16" }, { k: "Score", v: "92" }].map((m) => (
                  <div key={m.k} className="bg-secondary rounded-lg p-3">
                    <p className="text-2xl font-bold text-foreground">{m.v}</p>
                    <p className="text-xs text-muted-foreground">{m.k}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5">
                {[{ t: "Build auth flow", d: "Due today", s: "destructive" }, { t: "Deploy on Cloud", d: "Tomorrow", s: "warning" }, { t: "Write README", d: "Done", s: "success" }].map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2.5">
                    <span className="text-sm">{t.t}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${t.s}/10 text-${t.s}`}>{t.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">The platform</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">Everything an internship program needs.</h2>
          <p className="mt-4 text-muted-foreground">From application to certification — interns, mentors, and admins each get a tailored workspace built for outcomes.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-gradient-card border border-border rounded-xl p-6 shadow-card hover:shadow-elegant transition-smooth">
              <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className="bg-secondary/40 border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Domains</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Five tracks. Infinite outcomes.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {domains.map((d) => (
              <div key={d.name} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-elegant transition-smooth">
                <d.icon className="h-7 w-7 mx-auto text-primary mb-3" />
                <p className="font-semibold text-sm">{d.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Apply", d: "Sign up with email OTP, complete onboarding with your skills and resume." },
            { n: "02", t: "Get matched", d: "Admins approve and assign you to a domain mentor based on your interests." },
            { n: "03", t: "Build & earn", d: "Ship tasks, get reviewed, track progress, and earn a verified certificate." },
          ].map((s) => (
            <div key={s.n} className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <p className="text-5xl font-bold text-gradient-primary">{s.n}</p>
              <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">Ready to unleash your potential?</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto">Join the next TARCIN cohort. Build real products, learn from world-class mentors.</p>
            <Button asChild size="lg" className="mt-8 bg-card text-primary hover:bg-card/90">
              <Link to="/login">Start your application <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <TarcinLogo showTagline />
          <p className="text-sm text-muted-foreground">© 2026 TARCIN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-foreground">{n}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
