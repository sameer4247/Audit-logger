import { prisma } from '../src/db/prisma';
import { Role } from '../src/prisma/generated/primsa/enums';

async function main() {
  const users = [
    { name: 'Jane Doe', credentials: 'b627aece004bd856038b8021969a1b872e19f40b685262435e7b09448f81c4df', role: Role.admin}, //use x-api-key : "user_e46b45fc764cf5866158ad619ef51a4c630a5758cc3abb8e"
    { name: 'Bob the Builder', credentials: '6df1343c154a34fc0edad7a58c11339e04a79e04d20f985c638160f63a5ef676', role: Role.reviewer} //use x-api-key :"user_1c1a160a55f6fd78ef589078feaf0dd5149ca8332f66a969"
  ];
  const res = [];
  for (const u of users) {
  res.push(await prisma.user.upsert({
      where: { credentials: u.credentials },
      update: { name: u.name, role: u.role },
      create: { name: u.name, credentials: u.credentials, role: u.role }
    }));
  };

  const books = [
     {"title":"The Book 1","authors":"Author Name 1","publishedBy":"Publisher", createdBy:res[0].id},
     {"title":"The Book 2","authors":"Author Name 2","publishedBy":"Publisher", createdBy: res[1].id}
  ];
 
  await prisma.book.createMany({data:books});
}

main()
  .then((res) => {
    console.log('Seed completed', res);
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
