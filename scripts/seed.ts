const {PrismaClient} = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    // Create B.Pharm year 1 level
    const level = await database.level.findUnique({
      where: {
        name: 'B.Pharm year 2',
      },
    });

    // Create categories under B.Pharm year 1 level
    await database.category.createMany({
      data: [
        {name: 'Community Medicine', levelId: level.id},
        {name: 'Pharmaceutical Chemistry', levelId: level.id},
        {name: 'Physiology', levelId: level.id},
        {name: 'Clinical Pharmacy', levelId: level.id},
        {name: 'Pharmacy Jurisprudence', levelId: level.id},
        {name: 'First Aid', levelId: level.id},
        {name: 'Pharmaceutics general  & technology', levelId: level.id},
        {name: 'Pharmaceutics microbiology', levelId: level.id},
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
