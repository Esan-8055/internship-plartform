"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, LogOut, Search, LayoutDashboard, FileText, Users, Award, Megaphone,
  Globe, UserPlus, Briefcase, ClipboardList, Calendar, CheckCircle, MessageSquare,
  Trophy, CalendarDays, Clock
} from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  SidebarProvider, SidebarTrigger, SidebarInset, useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/NotificationBell";

const IconMap = {
  LayoutDashboard,
  FileText,
  Users,
  Award,
  Megaphone,
  Globe,
  UserPlus,
  Briefcase,
  ClipboardList,
  Calendar,
  CheckCircle,
  MessageSquare,
  Trophy,
  CalendarDays,
  Clock
} as const;

export type NavItem = {
  title: string;
  url: string;
  icon: keyof typeof IconMap;
};

import { useSocket } from "@/hooks/use-socket";

import { GlobalSearch } from "@/components/GlobalSearch";

export function RoleLayout({
  role,
  items,
  user,
  children,
}: {
  role: "Intern" | "Mentor" | "Admin";
  items: NavItem[];
  user: { name: string; email: string; id: string; profileImageUrl?: string | null };
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Initialize real-time connection with role and userId
  const { isConnected } = useSocket(role, user.id);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <RoleSidebar items={items} role={role} />
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          <header className="h-16 bg-[#f8fafc] flex items-center px-6 gap-4">
            <SidebarTrigger className="md:hidden" />
            <GlobalSearch />
            <div className="ml-auto flex items-center gap-4">

              <NotificationBell />
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{role}</p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm overflow-hidden">
                  {user.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                    {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function RoleSidebar({ items, role }: { items: NavItem[]; role: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 bg-white">
      <SidebarHeader className="p-6 pb-4">
        {collapsed ? (
          <div className="h-10 w-10 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
            π
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200 transition-transform group-hover:scale-105">
              π
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">TARCIN</span>
          </Link>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-3 pt-6">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {role}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));
                const Icon = IconMap[item.icon];
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`h-11 px-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-50 text-blue-600 font-bold" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3.5">
                        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 mt-auto">
        {!collapsed && (
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 leading-relaxed">
            Unlock The Tech<br />
            Unleash The World
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
