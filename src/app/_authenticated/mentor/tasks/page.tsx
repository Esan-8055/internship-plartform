import { Briefcase, Plus, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { revalidatePath } from "next/cache";

export default async function MentorTasksPage() {
  const session = await getSession();
  const mentorUserId = session?.id as string;

  // Get mentor's domain
  const mentor = await prisma.mentor.findUnique({
    where: { userId: mentorUserId },
    include: { domain: true }
  });

  const domainId = mentor?.domainId;

  // Get interns in the same domain
  const interns = await prisma.user.findMany({
    where: { 
      role: "INTERN",
      status: "APPROVED",
      internProfile: { preferredDomain: mentor?.domain?.domainName || undefined }
    },
    orderBy: { name: "asc" }
  });

  // Get tasks created by this mentor
  const tasks = await prisma.task.findMany({
    where: { assignedById: mentorUserId },
    include: { assignedTo: true },
    orderBy: { createdAt: "desc" }
  });

  async function createTask(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadline = new Date(formData.get("deadline") as string);
    const assignedToId = formData.get("assignedToId") as string;
    const priority = formData.get("priority") as string;

    if (!title || !assignedToId) return;

    await prisma.task.create({
      data: {
        title,
        description,
        deadline,
        assignedById: mentorUserId,
        assignedToId,
        priority: priority || "medium",
        status: "TODO"
      }
    });
    revalidatePath("/mentor/tasks");
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Tasks</h1>
          <p className="text-slate-500">Manage and assign tasks to your interns in {mentor?.domain?.domainName || "General"}.</p>
        </div>
      </div>

      {/* Create Task Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4 text-blue-600">Assign New Task</h2>
        <form action={createTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Title</label>
            <input required name="title" className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" placeholder="e.g., Implement Auth Flow" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign To Intern</label>
            <select required name="assignedToId" className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm">
              <option value="">Select Intern...</option>
              {interns.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline</label>
            <input required type="date" name="deadline" className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <select name="priority" className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" className="w-full p-3 rounded-md border border-slate-200 text-sm min-h-[80px]" placeholder="Detailed instructions..." />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full md:w-auto bg-blue-600">
              <Plus className="mr-2 h-4 w-4" /> Create & Assign Task
            </Button>
          </div>
        </form>
      </div>
      
      {/* Task List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold">Assigned Tasks</div>
        {tasks.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">No tasks assigned yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{task.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center text-xs text-slate-500">
                      <User size={12} className="mr-1" /> {task.assignedTo.name}
                    </span>
                    <span className="flex items-center text-xs text-slate-500">
                      <Clock size={12} className="mr-1" /> {new Date(task.deadline).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      task.priority === "high" ? "bg-red-100 text-red-600" : 
                      task.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                  task.status === "APPROVED" ? "bg-green-100 text-green-700" :
                  task.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
