import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentorMeetingsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Meetings</h1>
          <p className="text-slate-500">Schedule 1-on-1s and weekly syncs.</p>
        </div>
        <Button>Schedule Meeting</Button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-[400px]">
        <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#2e68e6] mb-4">
          <CalendarDays size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Calendar</h2>
        <p className="text-slate-500 max-w-md">
          Store your Google Meet or Zoom links here so interns can easily join their scheduled reviews.
        </p>
      </div>
    </div>
  );
}
