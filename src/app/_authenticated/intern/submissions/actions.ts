"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function submitTaskAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const taskId = formData.get("taskId") as string;
    const submissionUrl = formData.get("submissionUrl") as string;

    if (!taskId || !submissionUrl) {
      throw new Error("Missing required fields");
    }

    // 1. Update Task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "SUBMITTED",
        // Storing in description as a fallback if submissionUrl field was not added yet
        // But since we added it to schema, we'll try to use it
        // @ts-ignore
        submissionUrl: submissionUrl,
        // @ts-ignore
        submissionDate: new Date(),
      },
      include: {
        assignedBy: true
      }
    });

    // 2. Notify Mentor
    await createNotification({
      userId: task.assignedById,
      title: "New Submission",
      message: `${session.name} submitted work for "${task.title}".`,
      type: "SUBMISSION"
    });

    revalidatePath("/intern/submissions");
    revalidatePath("/intern/tasks");
    
    return { success: true };

  } catch (error: any) {
    console.error("[SUBMIT_TASK_ERROR]:", error);
    return { success: false, error: error.message };
  }
}
