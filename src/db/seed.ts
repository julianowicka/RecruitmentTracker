import { db } from './index';
import { applications, notes, statusHistory } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Dodanie przykładowych aplikacji
    const [app1] = await db
      .insert(applications)
      .values({
        company: 'TechCorp',
        role: 'Senior Frontend Developer',
        status: 'hr_interview',
        link: 'https://techcorp.com/careers/senior-frontend',
        salaryMin: 15000,
        salaryMax: 20000,
      })
      .returning();

    const [app2] = await db
      .insert(applications)
      .values({
        company: 'StartupXYZ',
        role: 'Full Stack Engineer',
        status: 'applied',
        link: 'https://startupxyz.com/jobs',
        salaryMin: 12000,
        salaryMax: 18000,
      })
      .returning();

    const [app3] = await db
      .insert(applications)
      .values({
        company: 'BigCompany',
        role: 'React Developer',
        status: 'offer',
        salaryMin: 18000,
        salaryMax: 22000,
      })
      .returning();

    // Dodanie notatek
    await db.insert(notes).values([
      {
        applicationId: app1.id,
        content: 'Pierwsza rozmowa HR przeszła dobrze. Czekam na feedback.',
      },
      {
        applicationId: app1.id,
        content: 'Przygotować się do rozmowy technicznej - React patterns, TypeScript.',
      },
      {
        applicationId: app3.id,
        content: 'Otrzymałem ofertę! Pensja: 20k PLN. Deadline odpowiedzi: 7 dni.',
      },
    ]);

    // Dodanie historii zmian statusów
    await db.insert(statusHistory).values([
      {
        applicationId: app1.id,
        fromStatus: 'applied',
        toStatus: 'hr_interview',
      },
      {
        applicationId: app3.id,
        fromStatus: 'applied',
        toStatus: 'tech_interview',
      },
      {
        applicationId: app3.id,
        fromStatus: 'tech_interview',
        toStatus: 'offer',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`   - Created ${3} applications`);
    console.log(`   - Created ${3} notes`);
    console.log(`   - Created ${3} status history entries`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();

