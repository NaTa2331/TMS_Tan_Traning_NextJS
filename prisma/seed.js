import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Seeding database...');

  // 1. Tạo user mẫu
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
    },
  });

  // 2. Tạo các list item gắn với user
  await prisma.listItem.createMany({
    data: [
      {
        title: 'Sample Item 1',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 2',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
    ],
  });

  console.log('✅ Done seeding!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
