"use client";

import { useState } from "react";
import { UserPlus, Mail, User, Phone, GraduationCap, BookOpen, Link as LinkIcon, Briefcase, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const DOMAINS = [
  "Web Development",
  "AI / ML",
  "UI/UX Design",
  "Digital Marketing",
  "Content / Media",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  college: "",
  department: "",
  linkedin: "",
  preferredDomain: "",
};

export default function CreateInternPage() {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDomain = (domain: string) => {
    setFormData({ ...formData, preferredDomain: domain });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/create-intern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create account.");

      setSuccess(`✓ Account created for ${formData.name}. They can now log in with OTP at ${formData.email}`);
      setFormData({ ...EMPTY_FORM });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <UserPlus size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Intern Account</h1>
          <p className="text-slate-500">Only admins can create accounts. Interns log in via OTP after you create their account.</p>
        </div>
      </div>

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
          <CheckCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b">Account Details (Required)</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User size={15} className="text-primary" /> Full Name
                </label>
                <Input
                  name="name"
                  required
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail size={15} className="text-primary" /> Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Optional Profile Fields */}
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b">Profile Details (Optional)</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone size={15} className="text-primary" /> Phone
                </label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <GraduationCap size={15} className="text-primary" /> College / University
                </label>
                <Input
                  name="college"
                  placeholder="Tech University"
                  value={formData.college}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <BookOpen size={15} className="text-primary" /> Department
                </label>
                <Input
                  name="department"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <LinkIcon size={15} className="text-primary" /> LinkedIn URL
                </label>
                <Input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Domain Selection */}
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b flex items-center gap-2">
              <Briefcase size={16} className="text-primary" /> Domain Assignment (Optional)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DOMAINS.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => handleDomain(domain)}
                  className={`rounded-xl border p-3 text-center text-sm font-medium transition-all ${
                    formData.preferredDomain === domain
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 text-slate-600 hover:border-primary/40"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2" size={18} /> Creating Account…</>
              ) : (
                <><UserPlus size={18} className="mr-2" /> Create Intern Account</>
              )}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Admin creates the intern account with their email here.</li>
          <li>Intern visits <strong>/login</strong> and enters their email.</li>
          <li>An OTP is sent to their email.</li>
          <li>They enter the OTP and are immediately logged in to their dashboard.</li>
        </ol>
      </Card>
    </div>
  );
}
