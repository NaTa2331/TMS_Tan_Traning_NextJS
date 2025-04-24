const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.listItem.createMany({
    data: [
      { title: 'Item 1', description: 'Description for item 1' },
      { title: 'Item 2', description: 'Description for item 2' },
      { title: 'Item 3', description: 'Description for item 3' },
    ],
  });

  console.log('✅ Seed data inserted');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
