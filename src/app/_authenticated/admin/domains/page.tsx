import { Code, Sparkles, LineChart, Shield, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

const IconMap: any = {
  "Full Stack": Code,
  "AI / ML": Sparkles,
  "Data Science": LineChart,
  "Cybersecurity": Shield,
  "Cloud / DevOps": Briefcase,
};

export default async function AdminDomainsPage() {
  const domains = await prisma.domain.findMany({
    include: {
      _count: {
        select: { mentors: true }
      }
    }
  });

  // Calculate interns per domain based on preferredDomain in profile
  const interns = await prisma.user.findMany({
    where: { role: "INTERN", status: "APPROVED" },
    include: { internProfile: true }
  });

  const getInternCount = (domainName: string) => {
    return interns.filter(i => i.internProfile?.preferredDomain === domainName).length;
  };

  // Fallback dummy data for initial show
  const hasNoDomains = domains.length === 0;

  async function initializeDomains() {
    "use server";
    const defaultDomains = ["Full Stack", "AI / ML", "Data Science", "Cybersecurity", "Cloud / DevOps"];
    for (const d of defaultDomains) {
      await prisma.domain.upsert({ where: { domainName: d }, update: {}, create: { domainName: d } });
    }
    revalidatePath("/admin/domains");
    revalidatePath("/admin/mentors");
  }

  const displayDomains = domains.length > 0 ? domains.map(d => ({
    id: d.id,
    name: d.domainName,
    mentorCount: d._count.mentors,
    internCount: getInternCount(d.domainName),
    icon: IconMap[d.domainName] || Code
  })) : [];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Domains</h1>
          <p className="text-slate-500">Five tracks driving the cohort.</p>
        </div>
        {hasNoDomains && (
          <form action={initializeDomains}>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Initialize Default Domains
            </Button>
          </form>
        )}
      </div>

      {hasNoDomains ? (
        <div className="bg-blue-50 p-12 rounded-2xl border border-blue-100 text-center">
          <p className="text-blue-700 font-medium mb-4">No domains found in your database.</p>
          <p className="text-blue-600 text-sm">Click the button above to set up the default internship tracks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayDomains.map((domain, i) => {
          const Icon = domain.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#026ae6] flex items-center justify-center text-white mb-6 shadow-md shadow-blue-100 group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-8">{domain.name}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-slate-900">{domain.mentorCount}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mentors</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-slate-900">{domain.internCount}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interns</p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
