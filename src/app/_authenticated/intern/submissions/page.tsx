import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { NewSubmissionDialog } from "./NewSubmissionDialog";

export default async function SubmissionsPage() {
  const session = await getSession();
  const userId = session?.id as string;

  const tasks = await prisma.task.findMany({
    where: { 
      assignedToId: userId,
      status: { in: ["SUBMITTED", "APPROVED", "REJECTED"] }
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch pending tasks that can be submitted
  const pendingTasks = await prisma.task.findMany({
    where: {
      assignedToId: userId,
      status: { in: ["TODO", "IN_PROGRESS", "REJECTED"] }
    }
  });


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">approved</span>;
      case "REJECTED":
        return <span className="bg-[#dc2626] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">needs revision</span>;
      case "SUBMITTED":
        return <span className="bg-[#f59e0b] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">pending</span>;
      default:
        return <span className="bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">{status.toLowerCase()}</span>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Submissions</h1>
          <p className="text-slate-500">Track every artifact you've shipped.</p>
        </div>
        <NewSubmissionDialog tasks={pendingTasks} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-medium">Task</th>
              <th className="py-4 px-6 font-medium">Submitted</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="py-4 px-6 font-bold text-slate-900">{task.title}</td>
                <td className="py-4 px-6 font-medium text-slate-500">{formatDate(new Date(task.updatedAt))}</td>
                <td className="py-4 px-6">{getStatusBadge(task.status)}</td>
                <td className="py-4 px-6 text-right font-bold text-slate-900">
                  {task.score !== null ? task.score : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
