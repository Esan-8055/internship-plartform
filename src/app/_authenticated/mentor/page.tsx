import { Users, Mail, CheckCircle2, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { MentorCharts } from "./components/MentorCharts";

export default async function MentorDashboard() {
  const session = await getSession();
  const userId = session?.id as string;

  // Get mentor details
  const mentor = await prisma.mentor.findUnique({
    where: { userId },
    include: { domain: true }
  });

  const domainName = mentor?.domain?.domainName;

  // Stats
  const internCount = await prisma.user.count({
    where: { 
      role: "INTERN", 
      status: "APPROVED",
      internProfile: { preferredDomain: domainName || undefined }
    }
  });

  const pendingReviews = await prisma.task.count({
    where: {
      status: "SUBMITTED",
      assignedTo: {
        internProfile: { preferredDomain: domainName || undefined }
      }
    }
  });

  const approvedThisWeek = await prisma.task.count({
    where: {
      status: "APPROVED",
      updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      assignedById: userId
    }
  });

  const stats = [
    { label: "My Interns", value: internCount.toString(), icon: Users, bg: "bg-[#eff4ff]", color: "text-[#2e68e6]" },
    { label: "Pending reviews", value: pendingReviews.toString(), icon: Mail, bg: "bg-[#fff7ed]", color: "text-[#f97316]" },
    { label: "Approved (7d)", value: approvedThisWeek.toString(), icon: CheckCircle2, bg: "bg-[#ecfdf5]", color: "text-[#10b981]" },
    { label: "Hours mentored", value: "42", icon: Clock, bg: "bg-[#eff4ff]", color: "text-[#2e68e6]" }, // Mock for now
  ];

  // My Interns list
  const interns = await prisma.user.findMany({
    where: { 
      role: "INTERN", 
      status: "APPROVED",
      internProfile: { preferredDomain: domainName || undefined }
    },
    take: 5,
    include: { 
      tasksReceived: { where: { status: "APPROVED" }, select: { score: true } } 
    }
  });

  const myInterns = interns.map(i => {
    const totalScore = i.tasksReceived.reduce((acc, t) => acc + (t.score || 0), 0);
    const avgScore = i.tasksReceived.length > 0 ? Math.round(totalScore / i.tasksReceived.length) : 0;
    return {
      initials: i.name.split(" ").map(n => n[0]).join(""),
      name: i.name,
      tasks: i.tasksReceived.length,
      score: avgScore
    };
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Mentor dashboard</h1>
        <p className="text-slate-500">Managing {domainName || "General"} cohort.</p>
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
              <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[400px] flex flex-col">
          <h2 className="text-base font-bold text-slate-900 mb-6">Submissions trend</h2>
          <MentorCharts />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[400px] flex flex-col overflow-hidden">
          <h2 className="text-base font-bold text-slate-900 mb-6">My interns</h2>
          <div className="space-y-6 overflow-y-auto pr-2">
            {myInterns.length === 0 ? (
              <p className="text-sm text-slate-500 text-center mt-10">No interns in your domain yet.</p>
            ) : (
              myInterns.map((intern, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#026ae6] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {intern.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">{intern.name}</p>
                      <p className="text-xs text-slate-500">{intern.tasks} tasks · avg {intern.score}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {intern.score}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
