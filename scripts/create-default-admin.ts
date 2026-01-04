/**
 * Script to create a default admin user for testing
 * Run with: npx ts-node scripts/create-default-admin.ts
 */

// Load environment variables from .env.local
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const mongoose = require('mongoose');
const User = require('../models/User').default;
const { hashPassword } = require('../lib/auth');

async function createDefaultAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI environment variable is not set');
    console.error('Please check your .env.local file');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Default admin credentials
    const defaultAdmin = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
    };

    // Check if admin already exists
    const existingUser = await User.findOne({ email: defaultAdmin.email });
    if (existingUser) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}\n`);
      console.log('✅ You can use these credentials to sign in');
      await mongoose.disconnect();
      return;
    }

    console.log('👤 Creating default admin user...');
    const hashedPassword = await hashPassword(defaultAdmin.password);

    const admin = await User.create({
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + admin.email);
    console.log('🔑 Password: ' + defaultAdmin.password);
    console.log('👤 Name:     ' + admin.name);
    console.log('🔐 Role:     ' + admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Note: Please change the password after first login!');
  } catch (error: any) {
    console.error('\n❌ Error creating admin:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Make sure MongoDB is running and MONGODB_URI is correct');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

createDefaultAdmin();
