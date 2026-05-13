import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";

// This layout just validates the session server-side.
// Each role's pages use RoleLayout for their sidebar/topbar.
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.status !== "APPROVED") {
    redirect("/under-review");
  }

  return <>{children}</>;
}
