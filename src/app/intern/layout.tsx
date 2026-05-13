import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { RoleLayout, NavItem } from "@/components/layout/RoleLayout";

const internNav: NavItem[] = [
  { title: "Dashboard", url: "/intern", icon: "LayoutDashboard" },
  { title: "Tasks", url: "/intern/tasks", icon: "ClipboardList" },
  { title: "Submissions", url: "/intern/submissions", icon: "CheckCircle" },
  { title: "Attendance", url: "/intern/attendance", icon: "CalendarDays" },
  { title: "Leaderboard", url: "/intern/leaderboard", icon: "Trophy" },
  { title: "Certificates", url: "/intern/certificates", icon: "Award" },
  { title: "TARCIN AI", url: "/intern/chatbot", icon: "MessageSquare" },
];

import { prisma } from "@/lib/prisma";

export default async function InternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.status !== "APPROVED") redirect("/under-review");
  if (session.role !== "INTERN") redirect(`/${session.role.toLowerCase()}`);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { internProfile: true }
  });

  return (
    <RoleLayout
      role="Intern"
      items={internNav}
      user={{ 
        name: user?.name || "Intern", 
        email: user?.email || "",
        id: session.id,
        profileImageUrl: user?.internProfile?.profileImageUrl
      }}
    >
      {children}
    </RoleLayout>
  );
}
