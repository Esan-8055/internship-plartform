"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";
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
import { submitTaskAction } from "./actions";

export function NewSubmissionDialog({ tasks }: { tasks: { id: string, title: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitTaskAction(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
          window.location.reload();
        }, 2000);
      } else {
        setError(res.error || "Failed to submit");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0284c7] hover:bg-[#026ae6] rounded-xl font-semibold h-11 px-5 shadow-sm">
          <Upload size={18} className="mr-2" /> New submission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">New Submission</DialogTitle>
          <DialogDescription className="text-slate-500">
            Submit your work for review by a mentor.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Submission Received!</h3>
            <p className="text-sm text-slate-500">Your mentor has been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="taskId" className="text-sm font-bold text-slate-700">Select Task</Label>
              <select 
                id="taskId" 
                name="taskId" 
                required 
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              >
                <option value="">Choose a task...</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submissionUrl" className="text-sm font-bold text-slate-700">Project URL (GitHub / Drive / Loom)</Label>
              <Input 
                id="submissionUrl" 
                name="submissionUrl" 
                placeholder="https://github.com/..." 
                required 
                className="h-12 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || tasks.length === 0} 
              className="w-full h-12 bg-[#0284c7] hover:bg-[#026ae6] rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" size={18} />}
              {tasks.length === 0 ? "No pending tasks" : "Submit Artifact"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
