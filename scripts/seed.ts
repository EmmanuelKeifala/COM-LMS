const {PrismaClient} = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    // Create B.Pharm year 1 level
    const level = await database.level.findUnique({
      where: {
        name: 'Pre-Pharmacy & Pre-Med',
      },
    });

    // Create categories under B.Pharm year 1 level
    await database.category.createMany({
      data: [
        {name: 'Math', levelId: level.id},
        {name: 'Physics', levelId: level.id},
        {name: 'Chemistry', levelId: level.id},
        {name: 'Biology', levelId: level.id},
        {name: 'Communication Skills', levelId: level.id},
        // {name: 'Into. to Pharmacy', levelId: level.id},
      ],
    });

    console.log('Success');
  } catch (error) {
    console.log('Error seeding the database levels', error);
  } finally {
    await database.$disconnect();
  }
}

main();
