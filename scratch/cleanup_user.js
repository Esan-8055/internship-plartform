import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = "verseofvishnu@gmail.com";
  
  console.log(`Cleaning up user: ${email}`);
  
  try {
    // Delete mentor first due to foreign key
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.mentor.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
      console.log("Successfully deleted user and mentor profile.");
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
