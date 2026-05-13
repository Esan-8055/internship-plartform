"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMentorAction } from "./actions";

export function InviteMentorDialog({ domains }: { domains: { id: string, domainName: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await inviteMentorAction(formData);
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to invite mentor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#026ae6] hover:bg-[#0256b9] rounded-xl h-11 px-6 font-bold shadow-md shadow-blue-100">
          <Plus className="mr-2 h-5 w-5" /> Invite mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Invite New Mentor</DialogTitle>
          <DialogDescription className="text-slate-500">
            Send an invitation to a new mentor to join the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domainId" className="text-sm font-bold text-slate-700">Domain</Label>
            <select 
              id="domainId" 
              name="domainId" 
              required 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50"
              disabled={domains.length === 0}
            >
              {domains.length === 0 ? (
                <option value="">No domains found</option>
              ) : (
                <>
                  <option value="">Select a domain...</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>{d.domainName}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {domains.length === 0 ? (
            <div className="space-y-4">
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                You need to set up the internship tracks (Domains) before inviting mentors.
              </p>
              <Button 
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await fetch("/api/admin/setup-domains", { method: "POST" });
                    window.location.reload();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold text-white shadow-md shadow-amber-100"
              >
                {loading ? "Setting up..." : "Click to Setup Domains Now"}
              </Button>
            </div>
          ) : (
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-[#026ae6] hover:bg-[#0256b9] rounded-xl font-bold text-white shadow-md shadow-blue-100"
            >
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
