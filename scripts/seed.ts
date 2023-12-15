// {name: 'Chemistry'},
// {name: 'Physics'},
// {name: 'Math'},
// {name: 'Biology'},
// {name: 'Communication Skills'},

const {PrismaClient} = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {name: 'Anatomy'},
        {name: 'Physiology'},
        {name: 'Biochemistry'},
        {name: 'Pharmaceutical Chemistry'},
        {name: 'Pharmacognosy'},
        {name: 'Into. to Pharmacy'},
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
