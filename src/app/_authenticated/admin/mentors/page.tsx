import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InviteMentorDialog } from "./InviteMentorDialog";

export default async function AdminMentorsPage() {
  const mentors = await prisma.mentor.findMany({
    include: {
      user: true,
      domain: true,
    }
  });

  // Calculate interns per mentor (based on domain for now as we don't have direct assignment in schema)
  const internsPerDomain = await prisma.user.groupBy({
    by: ['role', 'status'],
    where: { role: "INTERN", status: "APPROVED" },
    _count: true
  });

  async function deleteMentor(formData: FormData) {
    "use server";
    const mentorId = formData.get("mentorId") as string;
    if (!mentorId || mentorId.length < 5) return; // Ignore mock IDs like "1", "2"

    try {
      await prisma.mentor.delete({ where: { id: mentorId } });
      revalidatePath("/admin/mentors");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // Fallback dummy data for initial show
  const displayMentors = mentors.length > 0 ? mentors.map(m => ({
    id: m.id,
    name: m.user.name,
    email: m.user.email,
    domain: m.domain?.domainName || "General",
    internCount: 12, // Dummy count
  })) : [
    { id: "1", name: "Priya Nair", email: "priya@tarcin.dev", domain: "Full Stack", internCount: 12 },
    { id: "2", name: "Arun Krishnan", email: "arun@tarcin.dev", domain: "AI / ML", internCount: 9 },
    { id: "3", name: "Neha Bhatt", email: "neha@tarcin.dev", domain: "Cybersecurity", internCount: 7 },
    { id: "4", name: "Rajesh Khanna", email: "rajesh@tarcin.dev", domain: "Cloud / DevOps", internCount: 6 },
  ];

  const domains = await prisma.domain.findMany();

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mentors</h1>
          <p className="text-slate-500">Invite and manage your mentorship team.</p>
        </div>
        <InviteMentorDialog domains={domains} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-100 text-slate-400">
            <tr>
              <th className="py-4 px-6 font-medium">Name</th>
              <th className="py-4 px-6 font-medium">Email</th>
              <th className="py-4 px-6 font-medium">Domain</th>
              <th className="py-4 px-6 font-medium text-center">Interns</th>
              <th className="py-4 px-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayMentors.map((mentor) => (
              <tr key={mentor.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-bold text-slate-900">{mentor.name}</td>
                <td className="py-5 px-6 text-slate-500">{mentor.email}</td>
                <td className="py-5 px-6">
                  <span className="bg-[#eff6ff] text-[#2563eb] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {mentor.domain}
                  </span>
                </td>
                <td className="py-5 px-6 text-center font-bold text-slate-700">{mentor.internCount}</td>
                <td className="py-5 px-6 text-right">
                  {mentor.id.length > 5 && (
                    <form action={deleteMentor}>
                      <input type="hidden" name="mentorId" value={mentor.id} />
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                        <Trash2 size={18} />
                      </Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
