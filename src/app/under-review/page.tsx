import { CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnderReviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-hero"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mx-auto mb-6">
            <Clock size={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Application Under Review</h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for applying to the TARCIN Internship Program. Your application is currently being reviewed by our administration team. We will notify you via email once a decision has been made.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" /> Application Status Checklist
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={12} />
                </div>
                Profile details submitted
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={12} />
                </div>
                Documents uploaded
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                Admin review (Pending)
              </li>
            </ul>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
