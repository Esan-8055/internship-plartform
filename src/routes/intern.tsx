import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, CalendarCheck, Upload, Bot, Trophy } from "lucide-react";
import { RoleLayout } from "@/components/tarcin/RoleLayout";

export const Route = createFileRoute("/intern")({ component: InternLayout });

const items = [
  { title: "Overview", url: "/intern", icon: LayoutDashboard },
  { title: "Tasks", url: "/intern/tasks", icon: ListChecks },
  { title: "Attendance", url: "/intern/attendance", icon: CalendarCheck },
  { title: "Submissions", url: "/intern/submissions", icon: Upload },
  { title: "AI Coach", url: "/intern/chatbot", icon: Bot },
  { title: "Leaderboard", url: "/intern/leaderboard", icon: Trophy },
];

function InternLayout() {
  return (
    <RoleLayout role="Intern" items={items} user={{ name: "Aarav Sharma", email: "aarav@tarcin.dev" }}>
      <Outlet />
    </RoleLayout>
  );
}
