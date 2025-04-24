import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a sample user
    console.log('Creating sample user...');
    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com'
      }
    });

    // Create some sample list items
    console.log('Creating sample list items...');
    await prisma.listItem.createMany({
      data: [
        {
          title: 'Sample Item 1',
          description: 'This is a sample item description',
          userId: user.id
        },
        {
          title: 'Sample Item 2',
          description: 'Another sample item with a longer description that demonstrates how the text wraps in the UI.',
          userId: user.id
        },
        {
          title: 'Sample Item 3',
          description: 'A third sample item to show how the list pagination works',
          userId: user.id
        }
      ]
    });

    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });