"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAttendance } from "../actions";

export function AttendanceMarker({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"NONE" | "CHECKED_IN" | "COMPLETED">("NONE");
  const [lastAction, setLastAction] = useState<Date | null>(null);

  useEffect(() => {
    async function checkStatus() {
      const res = await fetch("/api/intern/attendance-status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        if (data.lastAction) setLastAction(new Date(data.lastAction));
      }
    }
    checkStatus();
  }, []);

  const handleAction = async () => {
    setLoading(true);
    const res = await markAttendance(userId);
    if (res.success) {
      // Refresh status
      const checkRes = await fetch("/api/intern/attendance-status");
      if (checkRes.ok) {
        const data = await checkRes.json();
        setStatus(data.status);
        if (data.lastAction) setLastAction(new Date(data.lastAction));
      }
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  if (status === "COMPLETED") {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Attendance Completed</h3>
            <p className="text-sm text-slate-500">You've checked out for today. See you tomorrow!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status === "CHECKED_IN" ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
          <Clock size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">
            {status === "CHECKED_IN" ? "Currently Working" : "Ready to Start?"}
          </h3>
          <p className="text-sm text-slate-500">
            {status === "CHECKED_IN" 
              ? `Checked in at ${lastAction?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : "Mark your attendance for today."}
          </p>
        </div>
      </div>

      <Button 
        onClick={handleAction}
        disabled={loading}
        className={`h-11 px-6 rounded-xl font-bold shadow-md transition-all ${
          status === "CHECKED_IN" 
            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : (
          status === "CHECKED_IN" ? (
            <><LogOut className="mr-2 h-4 w-4" /> Check Out</>
          ) : (
            <><Clock className="mr-2 h-4 w-4" /> Check In</>
          )
        )}
      </Button>
    </div>
  );
}
