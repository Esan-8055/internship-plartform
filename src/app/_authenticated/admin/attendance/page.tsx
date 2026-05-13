import { prisma } from "@/lib/prisma";
import { Clock, User, Calendar, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function AdminAttendancePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch all approved interns
  const interns = await prisma.user.findMany({
    where: { role: "INTERN", status: "APPROVED" },
    include: {
      internProfile: true,
      attendances: {
        where: {
          date: { gte: today }
        }
      }
    }
  });

  const totalInterns = interns.length;
  const presentToday = interns.filter(i => i.attendances.length > 0).length;
  const absentToday = totalInterns - presentToday;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance Tracking</h1>
        <p className="text-slate-500">Monitor intern presence across all domains.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-2xl border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Interns</p>
          <p className="text-3xl font-bold text-slate-900">{totalInterns}</p>
        </Card>
        <Card className="p-6 rounded-2xl border-slate-200">
          <p className="text-sm font-medium text-green-600 mb-1">Present Today</p>
          <p className="text-3xl font-bold text-green-700">{presentToday}</p>
        </Card>
        <Card className="p-6 rounded-2xl border-slate-200">
          <p className="text-sm font-medium text-red-600 mb-1">Absent Today</p>
          <p className="text-3xl font-bold text-red-700">{absentToday}</p>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search intern..." className="pl-10 h-10 bg-slate-50 border-none rounded-xl" />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
            <Calendar size={16} />
            {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Intern</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Check-in</th>
                <th className="p-4">Check-out</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interns.map((intern) => {
                const att = intern.attendances[0];
                return (
                  <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                          {intern.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{intern.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {intern.internProfile?.preferredDomain || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {att ? att.checkin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {att?.checkout ? att.checkout.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                    </td>
                    <td className="p-4 pr-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        att ? (att.checkout ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600') : 'bg-red-50 text-red-600'
                      }`}>
                        {att ? (att.checkout ? "Completed" : "Active") : "Absent"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
