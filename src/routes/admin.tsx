import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, FileCheck, Users, Layers, Megaphone, Award } from "lucide-react";
import { RoleLayout } from "@/components/tarcin/RoleLayout";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Applications", url: "/admin/applications", icon: FileCheck },
  { title: "Mentors", url: "/admin/mentors", icon: Users },
  { title: "Domains", url: "/admin/domains", icon: Layers },
  { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
  { title: "Certificates", url: "/admin/certificates", icon: Award },
];

function AdminLayout() {
  return (
    <RoleLayout role="Admin" items={items} user={{ name: "Riya Kapoor", email: "admin@tarcin.dev" }}>
      <Outlet />
    </RoleLayout>
  );
}
