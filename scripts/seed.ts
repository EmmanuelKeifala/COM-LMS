// {name: 'Chemistry'},
// {name: 'Physics'},
// {name: 'Math'},
// {name: 'Biology'},
// {name: 'Communication Skills'},

const {PrismaClient} = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.level.createMany({
      data: [
        {name: 'Pre-Pharmacy & Pre-Med'},
        {name: 'B.Phram year 1'},
        {name: 'B.Phram year 2'},
        {name: 'B.Phram year 3'},
        {name: 'B.Phram year 4'},
        {name: 'B.Phram year 5'},
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
