import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { message, targetRole } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let targetUsers = [];
    if (targetRole === "ALL") {
      targetUsers = await prisma.user.findMany({ select: { id: true } });
    } else {
      targetUsers = await prisma.user.findMany({ 
        where: { role: targetRole as any }, 
        select: { id: true } 
      });
    }

    if (targetUsers.length > 0) {
      const notifications = targetUsers.map(u => ({
        userId: u.id,
        message,
        type: "ANNOUNCEMENT",
      }));
      
      await prisma.notification.createMany({
        data: notifications,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Broadcast API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
