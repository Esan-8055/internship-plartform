import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TarcinLogo } from "@/components/tarcin/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — TARCIN" }] }),
  component: Onboarding,
});

const DOMAINS = ["Full Stack", "AI / ML", "Data Science", "Cybersecurity", "Cloud / DevOps"];

function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center"><TarcinLogo showTagline size="lg" /></div>
        <div className="bg-card rounded-2xl shadow-elegant border border-border p-8 md:p-10">
          <h1 className="text-3xl font-bold tracking-tight">Tell us about yourself</h1>
          <p className="text-muted-foreground mt-2">Complete your profile so a mentor can review your application.</p>

          <form className="mt-8 space-y-5" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/under-review" }); }}>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name"><Input required placeholder="Jane Doe" /></Field>
              <Field label="Phone"><Input required placeholder="+91 98765 43210" /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="College / University"><Input required placeholder="IIT Delhi" /></Field>
              <Field label="Department"><Input required placeholder="Computer Science" /></Field>
            </div>
            <Field label="Preferred domain">
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select a domain" /></SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Skills (comma separated)"><Input placeholder="React, TypeScript, Python" /></Field>
            <Field label="Why TARCIN?"><Textarea rows={4} placeholder="Tell us about your goals..." /></Field>
            <Field label="Resume">
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl px-4 py-8 cursor-pointer hover:border-primary transition-smooth">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload PDF (max 5MB)</span>
                <input type="file" accept=".pdf" className="hidden" />
              </label>
            </Field>
            <Button type="submit" className="w-full h-11 bg-gradient-primary shadow-elegant">Submit application</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
