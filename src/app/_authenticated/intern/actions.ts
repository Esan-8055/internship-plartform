"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";

export async function markAttendance(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        }
      }
    });

    if (existing) {
      if (existing.checkout) {
        return { error: "You have already completed your attendance for today." };
      }
      // Check out
      await prisma.attendance.update({
        where: { id: existing.id },
        data: { checkout: new Date() }
      });
    } else {
      // Check in
      await prisma.attendance.create({
        data: {
          userId,
          checkin: new Date(),
          date: new Date(),
        }
      });
      
      // Notify Admin and Mentor
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { internProfile: true }
      });

      if (user) {
        // Find mentor for this domain
        const domainName = user.internProfile?.preferredDomain;
        if (domainName) {
          const mentor = await prisma.mentor.findFirst({
            where: { domain: { domainName } },
            include: { user: true }
          });

          if (mentor) {
            await createNotification({
              userId: mentor.user.id,
              title: "Attendance Marked",
              message: `${user.name} has checked in for today.`,
              type: "INFO"
            });
          }
        }

        // Notify Admins
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        for (const admin of admins) {
          await createNotification({
            userId: admin.id,
            title: "Attendance Marked",
            message: `${user.name} has checked in for today.`,
            type: "INFO"
          });
        }
      }
    }

    revalidatePath("/intern");
    revalidatePath("/admin/attendance"); // Assuming we'll create this
    revalidatePath("/mentor/attendance"); // Assuming we'll create this
    return { success: true };
  } catch (error) {
    console.error("Attendance marking failed:", error);
    return { error: "Failed to mark attendance" };
  }
}
