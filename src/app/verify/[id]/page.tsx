import { prisma } from "@/lib/prisma";
import { CheckCircle2, Award, Calendar, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VerifyCertificatePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: { 
      user: {
        include: {
          internProfile: true
        }
      }
    }
  });

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 shadow-2xl shadow-slate-200 border border-slate-100 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-6">
            <ShieldCheck size={40} className="opacity-50" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Certificate</h1>
          <p className="text-slate-500 mb-8">
            The certificate ID you are looking for does not exist in our records or has been revoked.
          </p>
          <Link href="/" className="inline-flex h-12 px-8 rounded-xl bg-slate-900 text-white font-bold items-center hover:bg-slate-800 transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 py-12">
      {/* Branding */}
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-100 group-hover:scale-105 transition-transform">
          π
        </div>
        <span className="text-3xl font-black tracking-tighter text-slate-900">TARCIN</span>
      </Link>

      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-blue-100 border border-slate-100 max-w-2xl w-full relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-6 border-4 border-white shadow-lg">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Verified Certificate</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Official TARCIN Validation</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                  <User size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Intern Name</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{certificate.user.name}</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                  <Award size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Domain</span>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {certificate.user.internProfile?.preferredDomain || "Internship Program"}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Calendar size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Completion Date</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="pt-6 border-t border-dashed border-slate-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Certificate ID</p>
                  <code className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{certificate.id}</code>
                </div>
                <Link 
                  href={certificate.fileUrl || '#'} 
                  target="_blank"
                  className="h-12 px-8 rounded-2xl bg-blue-600 text-white font-bold flex items-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  View Document
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-sm font-medium">
        © 2026 TARCIN Internship Portal. All rights reserved.
      </p>
    </div>
  );
}
