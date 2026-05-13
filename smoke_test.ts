import { validateEnv } from './src/lib/validate-env.ts';
import { prisma } from './src/lib/prisma.ts';

async function smokeTest() {
  console.log('🚀 Starting TARCIN Smoke Test...');

  // 1. Validate Environment
  validateEnv();

  // 2. Test DB Connection
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful.');
    
    const userCount = await prisma.user.count();
    console.log(`📊 Current Users in DB: ${userCount}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  // 3. Check Critical Tables
  try {
    const domains = await prisma.domain.findMany();
    console.log(`🌐 Domains configured: ${domains.length}`);
    if (domains.length === 0) {
      console.warn('⚠️ Warning: No domains found. Search and onboarding might be limited.');
    }
  } catch (err) {
    console.error('❌ Failed to fetch domains:', err);
  }

  console.log('✨ Smoke test completed successfully.');
  process.exit(0);
}

smokeTest();
