import { prisma } from '../src/db/prisma';
import { Role } from '../src/prisma/generated/primsa/enums';

async function main() {
  const users = [
    { name: 'Jane Doe', credentials: '31241fsfs14124142', role: 'admin' },
    { name: 'Bob the Builder', credentials: 'asfa231d241414c23213', role: 'reviewer' }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { credentials: u.credentials },
      update: { name: u.name, role: u.role as typeof Role },
      create: { name: u.name, credentials: u.credentials, role: u.role }
    });
  }
}

main()
  .then(() => {
    console.log('Seed completed');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
