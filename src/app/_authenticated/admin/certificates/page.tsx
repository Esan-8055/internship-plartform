"use client";

import { useState, useEffect } from "react";
import { Award, Plus, FileText, Download, Loader2, CheckCircle, AlertCircle, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Intern = {
  id: string;
  name: string;
  internProfile: {
    preferredDomain: string | null;
  } | null;
};

type Certificate = {
  id: string;
  issueDate: string;
  fileUrl: string;
  user: {
    name: string;
  };
};

export default function CertificatesPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    domain: "",
    mentorName: "John Mentor",
    startDate: "01 May 2026",
    endDate: "30 June 2026",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [internsRes, certsRes] = await Promise.all([
        fetch("/api/admin/eligible-interns"),
        fetch("/api/admin/certificates")
      ]);
      
      if (internsRes.ok) setInterns(await internsRes.json());
      if (certsRes.ok) setCertificates(await certsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError("");
    setSuccess("");

    const selectedIntern = interns.find(i => i.id === formData.userId);
    if (!selectedIntern) {
      setError("Please select an intern.");
      setGenerating(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          internName: selectedIntern.name,
          domain: formData.domain || selectedIntern.internProfile?.preferredDomain || "Full Stack Development"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Generation failed");
      }

      setSuccess("Certificate generated successfully!");
      fetchData(); // Refresh lists
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/certificates/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCertificates(prev => prev.filter(c => c.id !== deleteId));
        setDeleteId(null);
        fetchData(); // Also refresh intern list as they might become eligible again
      }
    } catch (err) {
      console.error("Failed to delete certificate:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display tracking-tight">Certificates</h1>
          <p className="text-slate-500">Generate and issue official internship completions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Generation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} /> Issue New
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-medium border border-green-100 flex items-center gap-2">
                  <CheckCircle size={14} /> {success}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Intern</label>
                <select 
                  required
                  value={formData.userId}
                  onChange={(e) => {
                    const intern = interns.find(i => i.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      userId: e.target.value,
                      domain: intern?.internProfile?.preferredDomain || ""
                    });
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50/50"
                >
                  <option value="">Select an intern...</option>
                  {interns.map((intern) => (
                    <option key={intern.id} value={intern.id}>{intern.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Domain / Track</label>
                <Input 
                  placeholder="e.g. Full Stack Development"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Start Date</label>
                  <Input 
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">End Date</label>
                  <Input 
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Mentor Name</label>
                <Input 
                  value={formData.mentorName}
                  onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>

              <Button 
                type="submit" 
                disabled={generating}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                {generating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" size={18} />}
                Generate Certificate
              </Button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recently Generated</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{certificates.length} Issued</span>
            </div>
            
            {certificates.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 rotate-3">
                  <Award size={32} />
                </div>
                <p className="text-slate-500 font-medium">No certificates issued yet.</p>
                <p className="text-xs text-slate-400 mt-1">Generated certificates will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{cert.user.name}</p>
                        <p className="text-xs text-slate-500">ID: {cert.id.slice(0, 15)}... · {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={cert.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center h-10 rounded-xl px-4 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-transparent hover:border-blue-200 transition-all"
                      >
                        <Download className="mr-2 h-3.5 w-3.5" /> PDF
                      </a>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100">
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem 
                            className="text-slate-600 gap-2 cursor-pointer"
                            onClick={() => {
                              // Edit logic: Populate form with this intern's details
                              // Note: We'd need more data from the cert record to fully populate (like domain used)
                              // For now, it just sets the intern
                              setFormData({ ...formData, userId: cert.id.split('-')[1] || "" }); 
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <Edit2 size={14} /> Re-issue / Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 gap-2 cursor-pointer"
                            onClick={() => setDeleteId(cert.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the certificate from the database and delete the file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
