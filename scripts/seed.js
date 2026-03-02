/**
 * MySQL Database Seeder
 * Seeds initial data into the database using raw SQL
 */

require('dotenv').config();

const { db, testConnection, disconnect } = require('../config/database');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Could not connect to database');
    }

    // Note: You should manually run schema.sql first to create tables
    
    // 1. Create default admin user
    console.log('👤 Creating default admin user...');
    try {
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      await db.users.create({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL || 'safalwolee@gmail.com',
        password: adminPassword,
        role: 'ADMIN',
        isActive: true
      });
      console.log('✅ Admin user created');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('⏭️  Admin user already exists');
      } else {
        throw error;
      }
    }

    // 2. Create general settings
    console.log('\n⚙️  Creating general settings...');
    try {
      await db.generalSettings.create({
        siteName: 'Marigold English Boarding School',
        siteNameSecond: 'Excellence in Education',
        siteDescription: 'A leading educational institution committed to providing quality education',
        mainContactEmail: 'info@marigold.edu.np',
        mainContactPhone: '+977-9857811111',
        schoolAddress: '123 Education Street, Knowledge City'
      });
      console.log('✅ General settings created');
    } catch (error) {
      console.log('⏭️  General settings may already exist');
    }

    // 3. Seed homepage content
    console.log('\n🏠 Seeding homepage content...');
    await db.homepageContent.upsertBySectionAndKey('hero', 'main_title', {
      title: 'Where Learning Meets Excellence',
      content: 'Inspiring students with knowledge, values, and opportunities to grow.',
      isActive: true
    });
    
    await db.homepageContent.upsertBySectionAndKey('hero', 'badge', {
      content: 'Excellence in Education Since 1995',
      isActive: true
    });

    await db.homepageContent.upsertBySectionAndKey('hero', 'primary_button', {
      title: 'Apply Now',
      linkUrl: '/contact.html',
      isActive: true
    });

    console.log('✅ Homepage content seeded');

    // 4. Seed sample event
    console.log('\n📅 Seeding sample events...');
    await db.eventsContent.upsertBySectionAndKey('notices', 'welcome_notice', {
      title: 'Welcome to New Academic Year 2024',
      content: 'We are excited to welcome all students to the new academic year!',
      description: 'Important information about the new academic session',
      category: 'notice',
      eventDate: new Date(),
      isActive: true,
      orderIndex: 1
    });
    console.log('✅ Sample events seeded');

    // 5. Seed contact content
    console.log('\n📞 Seeding contact content...');
    await db.contactContent.upsertBySectionAndKey('contact_main', 'contact_email', {
      title: 'Email',
      content: 'info@marigold.edu.np',
      metadata: 'mail',
      isActive: true
    });

    await db.contactContent.upsertBySectionAndKey('contact_main', 'contact_phone', {
      title: 'Phone',
      content: '+977-9857811111',
      metadata: 'phone',
      isActive: true
    });

    await db.contactContent.upsertBySectionAndKey('location_section', 'school_address', {
      title: 'Address',
      content: '123 Education Street, Knowledge City',
      metadata: 'map-pin',
      isActive: true
    });
    console.log('✅ Contact content seeded');

    // 6. Seed academics content
    console.log('\n📚 Seeding academics content...');
    await db.academicsContent.upsertBySectionAndKey('programs', 'program_overview', {
      title: 'Our Academic Programs',
      description: 'Comprehensive education from early years to secondary level',
      isActive: true
    });
    console.log('✅ Academics content seeded');

    // 7. Seed about content
    console.log('\n ℹ️  Seeding about content...');
    await db.aboutContent.upsertBySectionAndKey('mission', 'mission_statement', {
      title: 'Our Mission',
      content: 'To provide quality education that empowers students with knowledge, skills, and values to become responsible global citizens.',
      isActive: true
    });

    await db.aboutContent.upsertBySectionAndKey('mission', 'vision_statement', {
      title: 'Our Vision',
      content: 'To be a leading educational institution that inspires excellence, fosters innovation, and prepares students for global citizenship.',
      isActive: true
    });
    console.log('✅ About content seeded');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Login with: admin@marigold.edu.np / admin123');
    console.log('   2. Update site settings in admin panel');
    console.log('   3. Add more content as needed\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await disconnect();
  }
}

// Run seeder
seed();
