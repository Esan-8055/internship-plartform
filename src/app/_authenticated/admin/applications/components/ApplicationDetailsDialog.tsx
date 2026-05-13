"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, GraduationCap, Linkedin, FileText, Globe, MapPin, Calendar, Briefcase, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ApplicationDetailsDialogProps {
  app: {
    id: string;
    name: string;
    email: string;
    initials: string;
    domain: string;
    university: string;
    department: string;
    phone: string;
    skills: string[];
    linkedin?: string;
    resumeUrl?: string;
    profileImageUrl?: string;
    createdAt: string;
  };
}

export function ApplicationDetailsDialog({ app }: ApplicationDetailsDialogProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
          <Eye className="mr-2 h-4 w-4" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="bg-gradient-to-br from-[#026ae6] to-[#014ba3] p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Briefcase size={120} />
          </div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/30 shadow-2xl overflow-hidden">
              {!imgError && app.profileImageUrl ? (
                <img 
                  src={app.profileImageUrl.includes('mock-avatar-url.com') 
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=0284c7&color=fff&size=200` 
                    : app.profileImageUrl} 
                  alt={app.name} 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)} 
                />
              ) : (
                <span className="text-white/90 drop-shadow-sm">{app.initials}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-3xl font-black tracking-tight">{app.name}</DialogTitle>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {app.domain}
                </Badge>
              </div>
              <p className="text-blue-100 flex items-center gap-2 font-medium">
                <GraduationCap size={16} /> {app.university}
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-8 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{app.email}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 group hover:border-indigo-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-slate-700">{app.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                Academic Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{app.university}</p>
                  <p className="text-xs font-medium text-slate-500">{app.department || "No department specified"}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={16} />
                  <p className="text-xs font-medium uppercase tracking-wider">Applied on {new Date(app.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </section>

            <Separator className="bg-slate-100" />

            {/* Skills */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {app.skills.length > 0 ? (
                  app.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-tight hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-default">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic font-medium">No skills listed</p>
                )}
              </div>
            </section>

            <Separator className="bg-slate-100" />

            {/* Links */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                Professional Links
              </h3>
              <div className="flex flex-wrap gap-4">
                {app.linkedin && (
                  <Button variant="outline" className="h-12 rounded-xl font-bold gap-2 text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200" asChild>
                    <a href={app.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={18} /> LinkedIn Profile
                    </a>
                  </Button>
                )}
                {app.resumeUrl && (
                  <Button variant="outline" className="h-12 rounded-xl font-bold gap-2 text-rose-600 border-rose-100 bg-rose-50 hover:bg-rose-100 hover:border-rose-200" asChild>
                    <a 
                      href={app.resumeUrl.includes('mock-resume-url.com') 
                        ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
                        : app.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FileText size={18} /> View Resume
                    </a>
                  </Button>
                )}
                {!app.linkedin && !app.resumeUrl && (
                  <p className="text-sm text-slate-400 italic font-medium">No professional links provided</p>
                )}
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <DialogClose asChild>
            <Button variant="ghost" className="font-bold text-slate-500 rounded-xl px-8 hover:bg-slate-200">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
