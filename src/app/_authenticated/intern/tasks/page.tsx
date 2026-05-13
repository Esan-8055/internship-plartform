import { Calendar, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import Link from "next/link";

export default async function TasksPage() {
  const session = await getSession();
  const userId = session?.id as string;

  let tasks = await prisma.task.findMany({
    where: { assignedToId: userId },
    include: { assignedBy: true },
    orderBy: { deadline: "asc" },
  });


  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <span className="bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">high</span>;
      case "medium":
        return <span className="bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">medium</span>;
      case "low":
        return <span className="bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">low</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">{priority}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TODO":
        return null;
      case "IN_PROGRESS":
        return <span className="bg-[#eff4ff] text-[#026ae6] px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">In progress</span>;
      case "APPROVED":
      case "COMPLETED":
        return <span className="bg-[#ecfdf5] text-[#059669] px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">Completed</span>;
      case "SUBMITTED":
        return <span className="bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">Submitted</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My tasks</h1>
        <p className="text-slate-500">Stay on top of mentor-assigned work.</p>
      </div>

      <div className="space-y-4 mt-8">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="flex gap-2 mb-3">
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{task.title}</h3>
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <Calendar size={14} className="mr-1.5 text-slate-400" />
                <span>Due {task.deadline.toISOString().split("T")[0]}</span>
                <span className="mx-2">•</span>
                <span>Mentor · {task.assignedBy?.name || "Unassigned"}</span>
              </div>
            </div>
            <Link href={`/intern/tasks/${task.id}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Open <ExternalLink size={16} className="text-slate-500" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
