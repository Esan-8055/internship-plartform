import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { Clock, Calendar, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default async function MentorAttendancePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find mentor's domain
  const mentor = await prisma.mentor.findUnique({
    where: { userId: session.id },
    include: { domain: true }
  });

  if (!mentor || !mentor.domain) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500">You need to be assigned to a domain to view intern attendance.</p>
      </div>
    );
  }

  const domainName = mentor.domain.domainName;

  // Fetch interns in this mentor's domain
  const interns = await prisma.user.findMany({
    where: { 
      role: "INTERN", 
      status: "APPROVED",
      internProfile: { preferredDomain: domainName }
    },
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Intern Attendance</h1>
          <p className="text-slate-500 tracking-tight">Monitoring {domainName} track interns.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-600 shadow-sm">
          <Calendar size={16} className="text-blue-600" />
          {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Track Interns</p>
          <p className="text-3xl font-bold text-slate-900">{totalInterns}</p>
        </Card>
        <Card className="p-6 rounded-2xl border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Present Today</p>
          <p className="text-3xl font-bold text-slate-900">{presentToday}</p>
        </Card>
        <Card className="p-6 rounded-2xl border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Domain</p>
          <p className="text-lg font-bold text-slate-900 mt-2">{domainName}</p>
        </Card>
        <Card className="p-6 rounded-2xl border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Attendance Rate</p>
          <p className="text-3xl font-bold text-slate-900">{totalInterns > 0 ? Math.round((presentToday/totalInterns)*100) : 0}%</p>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search track intern..." className="pl-10 h-11 bg-slate-50 border-none rounded-xl" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="p-4 pl-6">Intern</th>
                <th className="p-4">Check-in Time</th>
                <th className="p-4">Check-out Time</th>
                <th className="p-4 pr-6">Activity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                    No interns found in the {domainName} track.
                  </td>
                </tr>
              ) : (
                interns.map((intern) => {
                  const att = intern.attendances[0];
                  return (
                    <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-100">
                            {intern.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{intern.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{intern.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-semibold font-mono">
                        {att ? att.checkin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-semibold font-mono">
                        {att?.checkout ? att.checkout.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                      </td>
                      <td className="p-4 pr-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          att ? (att.checkout ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100') : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            att ? (att.checkout ? 'bg-green-600' : 'bg-amber-600') : 'bg-red-600'
                          }`} />
                          {att ? (att.checkout ? "Completed" : "Logged In") : "Absent"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
