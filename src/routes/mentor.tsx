import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, Upload, CalendarClock } from "lucide-react";
import { RoleLayout } from "@/components/tarcin/RoleLayout";

export const Route = createFileRoute("/mentor")({ component: MentorLayout });

const items = [
  { title: "Overview", url: "/mentor", icon: LayoutDashboard },
  { title: "Tasks", url: "/mentor/tasks", icon: ListChecks },
  { title: "Submissions", url: "/mentor/submissions", icon: Upload },
  { title: "Meetings", url: "/mentor/meetings", icon: CalendarClock },
];

function MentorLayout() {
  return (
    <RoleLayout role="Mentor" items={items} user={{ name: "Priya Nair", email: "priya@tarcin.dev" }}>
      <Outlet />
    </RoleLayout>
  );
}
