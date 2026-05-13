import { GraduationCap, Users, FileText, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminCharts } from "./components/AdminCharts";

export default async function AdminDashboard() {
  // Fetch real data from Postgres
  const totalInterns = await prisma.user.count({ where: { role: "INTERN", status: "APPROVED" } });
  const activeMentors = await prisma.mentor.count();
  const pendingApps = await prisma.user.count({ where: { role: "INTERN", status: "PENDING" } });
  const certsIssued = await prisma.certificate.count();

  // For charts, we need status breakdown
  const approvedCount = totalInterns;
  const pendingCount = pendingApps;
  const rejectedCount = await prisma.user.count({ where: { role: "INTERN", status: "REJECTED" } });

  // Domain breakdown - calculate intern counts
  const domains = await prisma.domain.findMany();
  const interns = await prisma.user.findMany({
    where: { role: "INTERN", status: "APPROVED" },
    include: { internProfile: true }
  });

  const barData = domains.map(d => ({
    name: d.domainName,
    value: interns.filter(i => i.internProfile?.preferredDomain === d.domainName).length
  }));

  const stats = [
    { label: "Total interns", value: totalInterns.toString(), icon: GraduationCap, bg: "bg-[#eff6ff]", color: "text-[#2563eb]" },
    { label: "Active mentors", value: activeMentors.toString(), icon: Users, bg: "bg-[#eff6ff]", color: "text-[#2563eb]" },
    { label: "Pending applications", value: pendingApps.toString(), icon: FileText, bg: "bg-[#fff7ed]", color: "text-[#ea580c]" },
    { label: "Certificates issued", value: certsIssued.toString(), icon: Award, bg: "bg-[#f0fdf4]", color: "text-[#16a34a]" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin overview</h1>
        <p className="text-slate-500">Cohort 2026 · TARCIN command center.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Applications status</h2>
          <AdminCharts 
            type="donut" 
            data={[
              { name: "Approved", value: approvedCount, color: "#10b981" },
              { name: "Pending", value: pendingCount, color: "#f59e0b" },
              { name: "Rejected", value: rejectedCount, color: "#ef4444" }
            ]} 
          />
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span className="text-sm font-medium text-slate-600">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="text-sm font-medium text-slate-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-sm font-medium text-slate-600">Rejected</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Interns per domain</h2>
          <AdminCharts 
            type="bar" 
            data={barData} 
          />
        </div>
      </div>
    </div>
  );
}
