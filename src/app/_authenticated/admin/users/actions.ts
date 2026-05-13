"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  try {
    // Manually cleanup relations first (Fallback for missing cascades)
    await prisma.$transaction([
      prisma.task.deleteMany({ where: { OR: [{ assignedToId: userId }, { assignedById: userId }] } }),
      prisma.attendance.deleteMany({ where: { userId } }),
      prisma.certificate.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.internProfile.deleteMany({ where: { userId } }),
      prisma.mentor.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user failed:", error);
    return { error: "Failed to delete user" };
  }
}

export async function updateUser(userId: string, data: { name: string; role: any; status: any }) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update user failed:", error);
    return { error: "Failed to update user" };
  }
}
