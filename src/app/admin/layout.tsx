import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { RoleLayout, NavItem } from "@/components/layout/RoleLayout";

const adminNav: NavItem[] = [
  { title: "Dashboard",     url: "/admin",                   icon: "LayoutDashboard" },
  { title: "Applications",  url: "/admin/applications",      icon: "FileText" },
  { title: "User Mgmt",     url: "/admin/users",             icon: "Users" },
  { title: "Mentors",       url: "/admin/mentors",           icon: "Briefcase" },
  { title: "Certificates",  url: "/admin/certificates",      icon: "Award" },
  { title: "Domains",       url: "/admin/domains",           icon: "Globe" },
  { title: "Attendance",    url: "/admin/attendance",        icon: "Clock" },
  { title: "Announcements", url: "/admin/announcements",     icon: "Megaphone" },
];

import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.status !== "APPROVED") redirect("/under-review");
  if (session.role !== "ADMIN") redirect(`/${session.role.toLowerCase()}`);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { internProfile: true }
  });

  return (
    <RoleLayout
      role="Admin"
      items={adminNav}
      user={{ 
        name: user?.name || "Admin", 
        email: user?.email || "",
        id: session.id,
        profileImageUrl: user?.internProfile?.profileImageUrl
      }}
    >
      {children}
    </RoleLayout>
  );
}
