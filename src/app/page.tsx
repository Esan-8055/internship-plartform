"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Code2,
  Brain,
  BarChart2,
  Shield,
  Cloud,
  GraduationCap,
  Users,
  Award,
  Monitor,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Intersection observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Stats counter component ─────────────────────────────────────────────────
function StatItem({ value, suffix, label, inView }: { value: number; suffix: string; label: string; inView: boolean }) {
  const count = useCounter(value, 1800, inView);
  return (
    <div className="flex flex-col">
      <span className="text-3xl font-black text-gray-900">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-gray-500 mt-1">{label}</span>
    </div>
  );
}

// ─── Dashboard preview card ───────────────────────────────────────────────────
function DashboardCard() {
  return (
    <div className="relative">
      {/* Glow effect behind the card */}
      <div className="absolute -inset-4 bg-blue-400/20 blur-2xl rounded-3xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-[360px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
              AS
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Aarav Sharma</p>
              <p className="text-xs text-gray-400">Full Stack · Week 4</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            On track
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { value: "18", label: "Tasks" },
            { value: "16", label: "Submitted" },
            { value: "92", label: "Score" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {[
            { task: "Build auth flow", status: "Due today", color: "text-red-500 bg-red-50 border-red-100" },
            { task: "Deploy on Cloud", status: "Tomorrow", color: "text-amber-500 bg-amber-50 border-amber-100" },
            { task: "Write README", status: "Done", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          ].map((item) => (
            <div
              key={item.task}
              className="flex items-center justify-between py-2.5 px-3 bg-gray-50/70 rounded-xl border border-gray-100"
            >
              <span className="text-sm font-medium text-gray-700">{item.task}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsInView(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <GraduationCap size={22} />,
      title: "Guided onboarding",
      desc: "Apply, get reviewed, and start your journey with a verified mentor.",
    },
    {
      icon: <Users size={22} />,
      title: "Mentor workflows",
      desc: "Assign tasks, review submissions, schedule 1:1 meetings effortlessly.",
    },
    {
      icon: <Award size={22} />,
      title: "Verified certificates",
      desc: "Branded TARCIN certificates auto-generated on program completion.",
    },
    {
      icon: <Monitor size={22} />,
      title: "AI career coach",
      desc: "Chat with an AI mentor for resumes, interviews, and skills paths.",
    },
  ];

  const domains = [
    { icon: <Code2 size={28} />, label: "Full Stack" },
    { icon: <Brain size={28} />, label: "AI / ML" },
    { icon: <BarChart2 size={28} />, label: "Data Science" },
    { icon: <Shield size={28} />, label: "Cybersecurity" },
    { icon: <Cloud size={28} />, label: "Cloud / DevOps" },
  ];

  const steps = [
    {
      num: "01",
      title: "Apply",
      desc: "Sign up with email OTP, complete onboarding with your skills and resume.",
    },
    {
      num: "02",
      title: "Get matched",
      desc: "Admins approve and assign you to a domain mentor based on your interests.",
    },
    {
      num: "03",
      title: "Build & earn",
      desc: "Ship tasks, get reviewed, track progress, and earn a verified certificate.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-200">
              <span className="text-white font-black text-sm tracking-tight">TC</span>
            </div>
            <span className="text-lg font-black tracking-tight">
              <span className="text-gray-900">TAR</span>
              <span className="text-blue-600">CIN</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Domains", "How it works"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-px active:translate-y-0"
            >
              Get started <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            {["Features", "Domains", "How it works"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-gray-600 py-1"
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="text-sm font-semibold text-gray-700 py-2">
                Sign in
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-xl"
              >
                Get started <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-white pt-20 pb-24 px-6">
          {/* Subtle background shapes */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-8">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Internship cohort 2026 · Now open
                </div>

                <h1 className="text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-6">
                  <span className="text-gray-900">Unlock The Tech.</span>
                  <br />
                  <span className="text-blue-600">Unleash The World.</span>
                </h1>

                <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-10">
                  TARCIN is the all-in-one internship management platform
                  connecting ambitious interns with elite mentors across the
                  world's most in-demand tech domains.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-14">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                  >
                    Apply as intern <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-7 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    Join as mentor
                  </Link>
                </div>

                {/* Stats */}
                <div ref={statsRef as React.RefObject<HTMLDivElement>} className="flex items-center gap-10 pt-6 border-t border-gray-100">
                  <StatItem value={2400} suffix="+" label="Interns trained" inView={statsInView} />
                  <div className="w-px h-10 bg-gray-200" />
                  <StatItem value={180} suffix="+" label="Active mentors" inView={statsInView} />
                  <div className="w-px h-10 bg-gray-200" />
                  <StatItem value={96} suffix="%" label="Completion rate" inView={statsInView} />
                </div>
              </div>

              {/* Right — dashboard card */}
              <div className="hidden lg:flex justify-center items-center">
                <DashboardCard />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Section label */}
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">
              The Platform
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <h2 className="text-4xl font-black text-gray-900 leading-tight max-w-md">
                Everything an internship<br />program needs.
              </h2>
              <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                From application to certification — interns, mentors, and admins
                each get a tailored workspace built for outcomes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group bg-white border border-gray-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOMAINS ────────────────────────────────────────────────────────── */}
        <section id="domains" className="py-24 px-6 bg-gray-50/70">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">
                Domains
              </p>
              <h2 className="text-4xl font-black text-gray-900">
                Five tracks. Infinite outcomes.
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
              {domains.map((d) => (
                <div
                  key={d.label}
                  className="group bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                    {d.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{d.label}</span>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div id="how-it-works" className="pt-8">
              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((s, i) => (
                  <div key={s.num} className="relative">
                    {/* Connector line */}
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[60%] right-0 h-px bg-gradient-to-r from-blue-200 to-transparent" />
                    )}
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                      <p className="text-5xl font-black text-blue-600/80 mb-4 leading-none">
                        {s.num}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS / TRUST BAR ───────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">
              Trusted by interns across leading tech companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 grayscale">
              {["Google", "Microsoft", "Amazon", "Meta", "Infosys", "TCS"].map((co) => (
                <span key={co} className="text-xl font-black text-gray-900 tracking-tight">
                  {co}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF CARDS ─────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-gray-50/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                What our interns say
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Real stories from real people who accelerated their careers with TARCIN.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya K.",
                  role: "Full Stack · Cohort 2025",
                  quote:
                    "TARCIN gave me hands-on experience that I couldn't get anywhere else. Landed a job within a week of completing the program.",
                },
                {
                  name: "Rahul M.",
                  role: "AI/ML · Cohort 2025",
                  quote:
                    "The mentor-matching is incredible. My mentor reviewed my code daily and pushed me to ship production-grade projects.",
                },
                {
                  name: "Sneha L.",
                  role: "Data Science · Cohort 2025",
                  quote:
                    "The verified certificate from TARCIN was the first thing every recruiter asked about. Worth every effort.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 px-8 py-16 text-center shadow-2xl shadow-blue-200">
              {/* decorative circles */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="relative text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to unleash your potential?
              </h2>
              <p className="relative text-blue-100 text-base mb-10 max-w-md mx-auto">
                Join the next TARCIN cohort. Build real products, learn from
                world-class mentors.
              </p>
              <Link
                href="/onboarding"
                className="relative inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
              >
                Start your application <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">TC</span>
            </div>
            <div>
              <p className="text-sm font-black">
                <span className="text-gray-900">TAR</span>
                <span className="text-blue-600">CIN</span>
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest -mt-0.5">
                Unlock the tech · Unleash the world
              </p>
            </div>
          </Link>
          <p className="text-sm text-gray-400">© 2026 TARCIN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
