// Plain Node.js seed — no TypeScript, no ts-node needed
// Run with: node prisma/seed.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tarcin.com';
  const adminName  = process.env.ADMIN_NAME  || 'TARCIN Admin';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log(`\n✅ Admin already exists: ${adminEmail}\n`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email:  adminEmail,
      name:   adminName,
      role:   'ADMIN',
      status: 'APPROVED',
    },
  });

  console.log('\n✅ Admin account created!');
  console.log('   Email :', admin.email);
  console.log('   Name  :', admin.name);
  console.log('   Role  :', admin.role);
  console.log('\n→ Go to http://localhost:3000/login');
  console.log('→ Enter email:', admin.email);
  console.log('→ OTP will appear HERE in the terminal (dev mode)\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
