import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const defaultDomains = [
      "Full Stack",
      "AI / ML",
      "Data Science",
      "Cybersecurity",
      "Cloud / DevOps"
    ];

    for (const domainName of defaultDomains) {
      await prisma.domain.upsert({
        where: { domainName },
        update: {},
        create: { domainName }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to setup domains" }, { status: 500 });
  }
}
