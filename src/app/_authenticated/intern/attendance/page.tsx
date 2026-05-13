import { Check, Calendar as CalendarIcon, Flame, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";

export default async function AttendancePage() {
  const session = await getSession();
  const userId = session?.id as string;
  const userName = session?.name || "An intern";

  const attendances = await prisma.attendance.findMany({
    where: { userId },
    orderBy: { date: "asc" }
  });

  // Calculate stats using real data
  const daysPresent = attendances.length;
  const attendanceRate = daysPresent > 0 ? Math.round((daysPresent / 30) * 100) : 0;
  const currentStreak = calculateStreak(attendances);

  // Calendar logic for current month
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const presentDays = attendances
    .filter(a => new Date(a.date).getMonth() === today.getMonth())
    .map(a => new Date(a.date).getDate());

  async function handleCheckIn() {
    "use server";
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: { gte: startOfDay }
      }
    });

    if (!existing) {
      await prisma.attendance.create({
        data: {
          userId,
          checkin: now,
          date: now
        }
      });

      // Notify Admins and Mentors
      await createNotification({
        userId,
        title: "Attendance",
        message: `${userName} checked in for today.`,
        type: "ATTENDANCE",
        targetRole: "ADMIN"
      });

      await createNotification({
        userId,
        title: "Attendance",
        message: `${userName} checked in for today.`,
        type: "ATTENDANCE",
        targetRole: "MENTOR"
      });

      revalidatePath("/intern/attendance");
    }
  }

  // Check if already checked in today
  const startOfToday = new Date();
  startOfToday.setHours(0,0,0,0);
  const checkedInToday = attendances.some(a => new Date(a.date) >= startOfToday);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Attendance</h1>
          <p className="text-slate-500 font-medium">Mark your daily check-in to maintain your progress.</p>
        </div>
        <form action={handleCheckIn}>
          <Button 
            type="submit" 
            disabled={checkedInToday}
            className={`rounded-2xl font-bold h-14 px-8 shadow-xl transition-all active:scale-95 ${
              checkedInToday 
                ? "bg-green-100 text-green-700 border-2 border-green-200 cursor-default" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            }`}
          >
            {checkedInToday ? (
              <><CheckCircle2 size={20} className="mr-2" /> Checked in Today</>
            ) : (
              <><Check size={20} className="mr-2" /> Check in Now</>
            )}
          </Button>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <CalendarIcon size={64} className="text-blue-600" />
          </div>
          <p className="text-5xl font-black text-slate-900 mb-2">{daysPresent}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Days Present</p>
        </div>
        
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Clock size={64} className="text-emerald-600" />
          </div>
          <p className="text-5xl font-black text-slate-900 mb-2">{attendanceRate}%</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Attendance Rate</p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Flame size={64} className="text-orange-500" />
          </div>
          <p className="text-5xl font-black text-slate-900 mb-2">{currentStreak}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Day Streak</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black text-slate-900">{monthName} {year}</h3>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div> Present
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-100"></div> Absent
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isPresent = presentDays.includes(day);
            const isToday = today.getDate() === day;
            
            return (
              <div 
                key={day}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-all ${
                  isPresent 
                    ? "bg-green-50 text-green-600 border-2 border-green-100" 
                    : isToday
                      ? "bg-blue-50 text-blue-600 border-2 border-blue-100 ring-4 ring-blue-50"
                      : "bg-slate-50 text-slate-300"
                }`}
              >
                {day}
                {isPresent && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function calculateStreak(attendances: any[]) {
  if (attendances.length === 0) return 0;
  
  // Sort by date descending
  const sorted = [...attendances].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  
  // Check if checked in today or yesterday (to continue streak)
  const lastDate = new Date(sorted[0].date);
  lastDate.setHours(0,0,0,0);
  
  const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0; // Streak broken
  
  streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const d1 = new Date(sorted[i].date);
    const d2 = new Date(sorted[i+1].date);
    d1.setHours(0,0,0,0);
    d2.setHours(0,0,0,0);
    
    const diff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else if (diff === 0) {
      continue; // Multiple check-ins same day (shouldn't happen but safe)
    } else {
      break;
    }
  }
  
  return streak;
}
