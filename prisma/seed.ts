/**
 * Prisma seed script — creates the initial ADMIN account.
 *
 * Run once: npx ts-node prisma/seed.ts
 * Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
 * Then: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tarcin.com";
  const adminName = process.env.ADMIN_NAME || "TARCIN Admin";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log(`Admin account already exists: ${adminEmail}`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: "ADMIN",
      status: "APPROVED",
    },
  });

  console.log(`\n✅ Admin account verified: ${adminEmail}`);

  // Seed default domains
  const defaultDomains = [
    "Full Stack",
    "AI / ML",
    "Data Science",
    "Cybersecurity",
    "Cloud / DevOps"
  ];

  console.log("Seeding domains...");
  for (const domainName of defaultDomains) {
    await prisma.domain.upsert({
      where: { domainName },
      update: {},
      create: { domainName }
    });
  }
  console.log("✅ Domains seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
