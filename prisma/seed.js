import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Seeding database...');

  // 1. Tạo user mẫu
  const user = await prisma.user.create({
    data: {
      name: 'Admin User 2',
      email: 'admin2@example.com',
    },
  });

  // 2. Tạo các list item gắn với user
  await prisma.listItem.createMany({
    data: [
      {
        title: 'Sample Item 15',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 16',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
      {
        title: 'Sample Item 3',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 4',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
      {
        title: 'Sample Item 5',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 6',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
      {
        title: 'Sample Item 7',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 8',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
      {
        title: 'Sample Item 9',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 10',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
      {
        title: 'Sample Item 11',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 12',
        description: 'Another longer sample item description.',
        userId: user.id,
      },
      {
        title: 'Sample Item 13',
        description: 'This is a sample item description',
        userId: user.id,
      },
      {
        title: 'Sample Item 14',
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
