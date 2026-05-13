import { prisma } from "./prisma";
import { io } from "socket.io-client";

// This helper is for server-side use only (API routes or Server Actions)
export async function createNotification({
  userId,
  title,
  message,
  type,
  targetRole, // Optional: if provided, emit to the whole room
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  targetRole?: "ADMIN" | "MENTOR" | "INTERN" | "ALL";
}) {
  // 1. Determine target users
  const targetUserIds: string[] = [];

  if (targetRole && targetRole !== "ALL") {
    const users = await prisma.user.findMany({
      where: { role: targetRole as any },
      select: { id: true },
    });
    targetUserIds.push(...users.map((u) => u.id));
  } else if (targetRole === "ALL") {
    const users = await prisma.user.findMany({
      select: { id: true },
    });
    targetUserIds.push(...users.map((u) => u.id));
  } else {
    targetUserIds.push(userId);
  }

  // 2. Save to Database using bulk insert for performance
  if (targetUserIds.length > 0) {
    await prisma.notification.createMany({
      data: targetUserIds.map((id) => ({
        userId: id,
        message: `${title}: ${message}`,
        type,
      })),
    });
  }

  // 3. Emit via Socket.io
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const socket = io(appUrl);
    socket.emit("send-notification", {
      target: targetRole || userId,
      title,
      message,
    });
    setTimeout(() => socket.disconnect(), 100);
  } catch (err) {
    console.error("Socket notification failed:", err);
  }

  return { success: true };
}
