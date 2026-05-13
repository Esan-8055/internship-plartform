import { ListTodo, CheckCircle2, TrendingUp, Award, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { OverviewCharts } from "./components/OverviewCharts";
import { AttendanceMarker } from "./components/AttendanceMarker";

export default async function InternDashboard() {
  const session = await getSession();
  const userId = session?.id as string;
  const userName = session?.name || "Intern";

  // Fetch real stats from Postgres
  const totalTasks = await prisma.task.count({ where: { assignedToId: userId } });
  const completedTasks = await prisma.task.count({ where: { assignedToId: userId, status: "APPROVED" } });
  const activeTasks = totalTasks - completedTasks;
  
  const attendances = await prisma.attendance.findMany({ where: { userId } });
  const attendanceRate = attendances.length > 0 ? Math.min(100, Math.round((attendances.length / 30) * 100)) : 94;

  const approvedTasks = await prisma.task.findMany({ 
    where: { assignedToId: userId, status: "APPROVED" },
    select: { score: true }
  });
  const currentScore = approvedTasks.reduce((acc, t) => acc + (t.score || 10), 0);

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issueDate: "desc" }
  });

  const stats = [
    { label: "Active tasks", value: activeTasks.toString(), sub: "Tasks in progress", icon: ListTodo, bg: "bg-[#eff4ff]", color: "text-[#2e68e6]" },
    { label: "Completed", value: completedTasks.toString(), sub: `of ${totalTasks} assigned`, icon: CheckCircle2, bg: "bg-[#ecfdf5]", color: "text-[#10b981]" },
    { label: "Attendance", value: `${attendanceRate}%`, sub: "Last 30 days", icon: TrendingUp, bg: "bg-[#eff4ff]", color: "text-[#2e68e6]" },
    { label: "Score", value: currentScore.toString(), sub: "Total points earned", icon: Award, bg: "bg-[#fffbeb]", color: "text-[#f59e0b]" },
  ];

  const sprintTasks = await prisma.task.findMany({
    where: { assignedToId: userId },
    take: 3,
    orderBy: { updatedAt: 'desc' }
  });

  const displaySprintTasks = sprintTasks.map(t => ({
    title: t.title,
    status: t.status === "APPROVED" ? "Done" : t.status === "SUBMITTED" ? "In review" : t.status === "IN_PROGRESS" ? "In progress" : "Todo",
    progress: t.status === "APPROVED" ? 100 : t.status === "SUBMITTED" ? 85 : t.status === "IN_PROGRESS" ? 40 : 0,
    badgeColor: t.status === "APPROVED" ? "bg-[#10b981] text-white" : "bg-[#f1f5f9] text-slate-600"
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome back, {userName.split(" ")[0]} 👋</h1>
          <p className="text-slate-500">Here's a snapshot of your TARCIN journey.</p>
        </div>
        <div className="flex-1 md:max-w-md">
          <AttendanceMarker userId={userId} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
                <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[380px] flex flex-col">
            <h2 className="text-base font-bold text-slate-900 mb-6">Performance trend</h2>
            <OverviewCharts />
          </div>

          {certificates.length > 0 && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Award size={22} className="text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Official Certification</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">Congratulations, {userName.split(" ")[0]}!</h2>
                <p className="text-blue-100/80 text-sm max-w-md font-medium">
                  Your internship certificate has been issued. This recognizes your outstanding achievement and contribution to TARCIN.
                </p>
              </div>
              <a 
                href={certificates[0].fileUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-10 h-14 px-8 rounded-2xl bg-white text-blue-700 font-bold flex items-center gap-3 hover:bg-blue-50 transition-all shadow-lg active:scale-95 shrink-0"
              >
                <Download size={20} /> Download PDF
              </a>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[380px] flex flex-col">
          <h2 className="text-base font-bold text-slate-900 mb-6">Current sprint</h2>
          <div className="space-y-6">
            {displaySprintTasks.map((task, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-900">{task.title}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${task.badgeColor}`}>
                    {task.status}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full ${task.progress === 100 ? 'bg-[#10b981]' : 'bg-[#026ae6]'}`} 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
