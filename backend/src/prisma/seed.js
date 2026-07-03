const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log('Seeding database...');

    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);

    const admin = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL || 'admin@bluefageevents.com' },
      update: {},
      create: {
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@bluefageevents.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Admin user: ${admin.email}`);

    const packages = [
      {
        name: 'Silver Package',
        description: 'Perfect for intimate gatherings and small events.',
        price: 2500.00,
        features: ['Event Planning', 'Venue Decoration', 'Basic Catering', 'Photography (4 hrs)', 'Event Coordinator'],
        isFeatured: false,
        badge: null,
        sortOrder: 1,
      },
      {
        name: 'Gold Package',
        description: 'Our most popular package for memorable celebrations.',
        price: 5000.00,
        features: ['Full Event Planning', 'Premium Decoration', 'Gourmet Catering', 'Photography (8 hrs)', 'Videography', 'DJ/Music', 'Event Coordinator', 'Invitations'],
        isFeatured: true,
        badge: 'Most Popular',
        sortOrder: 2,
      },
      {
        name: 'Platinum Package',
        description: 'The ultimate luxury experience for your special day.',
        price: 10000.00,
        features: ['Full Event Planning & Design', 'Luxury Decoration', 'Premium Catering & Bar', 'Photography (Full Day)', 'Cinematic Videography', 'Live Band', 'Event Coordinator Team', 'Custom Invitations', 'Transportation', 'Guest Accommodation'],
        isFeatured: true,
        badge: 'Premium',
        sortOrder: 3,
      },
    ];

    for (const pkg of packages) {
      await prisma.package.upsert({
        where: { name: pkg.name },
        update: pkg,
        create: pkg,
      });
    }
    console.log(`${packages.length} packages seeded`);

    console.log('\n--- Seed Complete ---');
    console.log(`Admin Login: ${process.env.ADMIN_EMAIL || 'admin@bluefageevents.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

seed();
