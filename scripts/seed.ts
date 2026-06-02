// Seed: ilk kullanıcı + organizasyon oluştur (Türkçe yorumlar)
// Çalıştırma: pnpm dlx tsx scripts/seed.ts
import { PrismaClient, Provider, Role } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

const EMAIL = process.env.SEED_EMAIL || 'admin@postiz.local';
const PASSWORD = process.env.SEED_PASSWORD || 'Admin12345!';
const COMPANY = process.env.SEED_COMPANY || 'Postiz Dev';

async function main() {
  const existing = await prisma.user.findFirst({
    where: { email: EMAIL, providerName: Provider.LOCAL },
  });

  if (existing) {
    console.log(`Kullanıcı zaten var: ${EMAIL} (id=${existing.id})`);
    return;
  }

  const apiKey = randomBytes(10).toString('hex');

  const org = await prisma.organization.create({
    data: {
      name: COMPANY,
      apiKey,
      allowTrial: true,
      isTrailing: true,
      users: {
        create: {
          role: Role.SUPERADMIN,
          user: {
            create: {
              activated: true,
              email: EMAIL,
              password: hashSync(PASSWORD, 10),
              providerName: Provider.LOCAL,
              providerId: '',
              timezone: 0,
              isSuperAdmin: true,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      users: { select: { user: { select: { id: true, email: true } } } },
    },
  });

  console.log('---------------------------------------------');
  console.log('Seed tamamlandı.');
  console.log('Organizasyon:', org.name, `(id=${org.id})`);
  console.log('Kullanıcı   :', org.users[0].user.email);
  console.log('Şifre       :', PASSWORD);
  console.log('Giriş       : http://localhost:4200/auth/login');
  console.log('---------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
