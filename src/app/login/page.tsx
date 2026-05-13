"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      // Redirect based on backend response (e.g. /intern, /onboarding)
      router.push(data.redirectUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-surface to-surface"></div>
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative z-10">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                T
              </div>
              <span className="text-2xl font-black tracking-tight text-primary">TARCIN</span>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">
              {step === 1 ? "Sign in to your internship portal" : "Enter the 6-digit code sent to your email"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>
              </div>

              <Button disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold shadow-[0_0_20px_var(--primary-glow)] hover:scale-[1.02] transition-transform">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>Send OTP <ArrowRight className="ml-2" size={18} /></>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                  One-Time Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="123456" 
                    maxLength={6}
                    className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/20 tracking-widest font-mono text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>
              </div>

              <Button disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold shadow-[0_0_20px_var(--primary-glow)] hover:scale-[1.02] transition-transform">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>Verify & Login <ArrowRight className="ml-2" size={18} /></>
                )}
              </Button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full mt-4 text-sm text-slate-500 font-medium hover:text-primary transition-colors"
                disabled={loading}
              >
                Use a different email
              </button>
            </form>
          )}
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/onboarding" className="text-primary font-bold hover:underline">
              Apply as an Intern
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
