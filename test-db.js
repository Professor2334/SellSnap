const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_zubxpaP6mOv8@ep-empty-snow-ab5nif21.eu-west-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  console.log("Attempting concurrent connections...");
  try {
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(prisma.$queryRawUnsafe('SELECT 1'));
    }
    await Promise.all(promises);
    console.log('Successfully completed 20 queries');
  } catch (e) {
    console.error('Failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
