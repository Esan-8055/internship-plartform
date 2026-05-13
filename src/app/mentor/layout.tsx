import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { RoleLayout, NavItem } from "@/components/layout/RoleLayout";

const mentorNav: NavItem[] = [
  { title: "Dashboard",   url: "/mentor",             icon: "LayoutDashboard" },
  { title: "Tasks",       url: "/mentor/tasks",        icon: "Briefcase" },
  { title: "Submissions", url: "/mentor/submissions",  icon: "ClipboardList" },
  { title: "Meetings",    url: "/mentor/meetings",     icon: "Calendar" },
  { title: "Attendance",  url: "/mentor/attendance",   icon: "Clock" },
];

import { prisma } from "@/lib/prisma";

export default async function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.status !== "APPROVED") redirect("/under-review");
  if (session.role !== "MENTOR") redirect(`/${session.role.toLowerCase()}`);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  return (
    <RoleLayout
      role="Mentor"
      items={mentorNav}
      user={{ 
        name: user?.name || "Mentor", 
        email: user?.email || "",
        id: session.id,
      }}
    >
      {children}
    </RoleLayout>
  );
}
