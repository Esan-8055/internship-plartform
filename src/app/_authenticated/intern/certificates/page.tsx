import { Award, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { Button } from "@/components/ui/button";

export default async function InternCertificatesPage() {
  const session = await getSession();
  const userId = session?.id as string;

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issueDate: "desc" }
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Certificates</h1>
        <p className="text-slate-500 font-medium">Download and verify your official TARCIN credentials.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No certificates yet</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Complete your internship tasks and maintenance requirements to receive your official certification.
          </p>
          <Button disabled className="rounded-xl h-12 px-8 font-bold bg-slate-100 text-slate-400">
            Check Status
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-48 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-300 overflow-hidden relative">
                  <Award size={48} className="text-blue-100" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Verified Credential</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Internship Achievement</h3>
                  <p className="text-slate-500 font-medium mb-4">Issued on {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <a 
                      href={cert.fileUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-12 px-6 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                      <Download size={18} /> Download PDF
                    </a>
                    <a 
                      href={`/verify/${cert.id}`} 
                      target="_blank"
                      className="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      <ExternalLink size={18} /> Verify Link
                    </a>
                  </div>
                </div>

                <div className="hidden lg:block text-right">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Certificate ID</p>
                  <p className="text-sm font-mono font-bold text-slate-400">{cert.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Benefits Card */}
      <div className="bg-slate-900 rounded-[40px] p-10 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full translate-y-1/2 translate-x-1/4 blur-[100px]"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-4">Why verify?</h2>
          <p className="text-slate-400 font-medium leading-relaxed mb-8">
            Every TARCIN certificate comes with a unique encrypted ID and QR code. Employers can instantly verify your skills and internship duration by scanning the code or using your public verification link.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-blue-400" />
              </div>
              <p className="text-sm font-bold text-slate-200">Shareable on LinkedIn & Portfolios</p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-blue-400" />
              </div>
              <p className="text-sm font-bold text-slate-200">Industry-standard PDF Format</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
