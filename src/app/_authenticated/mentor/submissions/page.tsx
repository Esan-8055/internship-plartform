import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { revalidatePath } from "next/cache";

export default async function MentorSubmissionsPage() {
  const session = await getSession();
  const mentorUserId = session?.id as string;

  // Get mentor's domain to filter submissions
  const mentor = await prisma.mentor.findUnique({
    where: { userId: mentorUserId },
    include: { domain: true }
  });

  // Fetch submitted tasks for interns in the mentor's domain
  const submissions = await prisma.task.findMany({
    where: {
      status: "SUBMITTED",
      assignedTo: {
        internProfile: { preferredDomain: mentor?.domain?.domainName || undefined }
      }
    },
    include: { assignedTo: true },
    orderBy: { updatedAt: "desc" }
  });

  async function updateSubmission(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const action = formData.get("action") as string;
    const score = parseInt(formData.get("score") as string) || null;

    if (action === "approve") {
      await prisma.task.update({
        where: { id },
        data: { status: "APPROVED", score }
      });
    } else if (action === "reject") {
      await prisma.task.update({
        where: { id },
        data: { status: "REJECTED" }
      });
    }
    revalidatePath("/mentor/submissions");
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Submissions</h1>
        <p className="text-slate-500">Review and grade task submissions from interns.</p>
      </div>
      
      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-[400px]">
          <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#2e68e6] mb-4">
            <ClipboardList size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No pending submissions</h2>
          <p className="text-slate-500">Submissions from your domain will appear here when interns complete tasks.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      {sub.priority}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{sub.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{sub.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Intern: <span className="font-semibold text-slate-900">{sub.assignedTo.name}</span></span>
                    <span>Submitted: <span className="font-semibold">{new Date(sub.updatedAt).toLocaleDateString()}</span></span>
                  </div>
                </div>
                
                <form action={updateSubmission} className="flex items-center gap-3">
                  <input type="hidden" name="id" value={sub.id} />
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Score (0-100)</label>
                    <input 
                      type="number" 
                      name="score" 
                      min="0" 
                      max="100" 
                      className="w-24 h-9 px-2 border rounded-md text-sm" 
                      placeholder="90"
                    />
                  </div>
                  <div className="flex gap-2 self-end">
                    <Button type="submit" name="action" value="approve" size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button type="submit" name="action" value="reject" size="sm" variant="destructive">
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
