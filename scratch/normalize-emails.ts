import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const lowerEmail = user.email.toLowerCase();
    if (lowerEmail !== user.email) {
      await prisma.user.update({
        where: { id: user.id },
        data: { email: lowerEmail },
      });
      console.log(`Updated email for user ${user.id}: ${user.email} -> ${lowerEmail}`);
    }
  }
  console.log('Email normalization complete.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
