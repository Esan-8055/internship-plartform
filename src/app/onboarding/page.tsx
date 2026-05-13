"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Upload, Briefcase, GraduationCap, Link as LinkIcon, User, Mail, Phone, BookOpen, Loader2, FileText, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    linkedin: "",
    domain: "",
    skills: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.domain) {
      setError("Please select a preferred domain.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (resumeFile) data.append("resume", resumeFile);
      if (imageFile) data.append("image", imageFile);

      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Submission failed");

      router.push(result.redirectUrl || "/under-review");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
              T
            </div>
            <span className="text-3xl font-black tracking-tight text-primary">TARCIN</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-primary/5 border-b border-primary/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Internship Application</h1>
            <p className="text-slate-500">Tell us about yourself to unlock the tech world.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-primary"/> Full Name
                </label>
                <Input name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail size={16} className="text-primary"/> Email Address
                </label>
                <Input name="email" required type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone size={16} className="text-primary"/> Phone Number
                </label>
                <Input name="phone" required type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <GraduationCap size={16} className="text-primary"/> College / University
                </label>
                <Input name="college" required value={formData.college} onChange={handleChange} placeholder="Tech University" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-primary"/> Department
                </label>
                <Input name="department" required value={formData.department} onChange={handleChange} placeholder="Computer Science" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <LinkIcon size={16} className="text-primary"/> LinkedIn Profile URL
                </label>
                <Input name="linkedin" required type="url" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/johndoe" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-primary"/> Technical Skills (comma separated)
                </label>
                <Input name="skills" required value={(formData as any).skills || ""} onChange={handleChange} placeholder="React, Node.js, Python, Figma" className="h-11 rounded-xl bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="text-primary" size={20} /> Domain Preference
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Web Development', 'AI / ML', 'UI/UX Design', 'Digital Marketing', 'Content / Media'].map((domain) => (
                  <label key={domain} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="domain" 
                      value={domain}
                      onChange={handleChange}
                      className="peer sr-only" 
                    />
                    <div className="rounded-xl border border-slate-200 p-4 text-center hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all font-medium text-sm text-slate-600">
                      {domain}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Upload className="text-primary" size={20} /> Documents
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  onClick={() => resumeInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group
                    ${resumeFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf" 
                    ref={resumeInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110
                    ${resumeFile ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                    {resumeFile ? <FileText size={20} /> : <Upload size={20} />}
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : 'Max file size 5MB'}
                  </p>
                </div>
                
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group
                    ${imageFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg, image/png" 
                    ref={imageInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110
                    ${imageFile ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                    {imageFile ? <ImageIcon size={20} /> : <User size={20} />}
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {imageFile ? imageFile.name : 'Upload Profile Picture'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG (Max 2MB)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button disabled={loading} className="w-full h-14 rounded-xl text-lg font-semibold shadow-[0_0_20px_var(--primary-glow)] hover:scale-[1.01] transition-transform">
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>Submit Application <ArrowRight className="ml-2" size={20} /></>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
