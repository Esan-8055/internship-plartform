import { Bell } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BroadcastForm } from "./BroadcastForm";

export default async function AnnouncementsPage() {
  const recentNotifications = await prisma.notification.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  // Helper to format date like "May 1"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Announcements</h1>
        <p className="text-slate-500">Broadcast to all interns and mentors.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <BroadcastForm />

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent</h2>
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <Bell size={40} className="mb-4 opacity-20" />
              <p>No recent announcements</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="group border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Bell size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {notification.message.split(":")[0] || "Update"}
                        </h4>
                        <span className="text-slate-400 text-xs font-medium">· {formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {notification.message.split(":")[1] || notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
