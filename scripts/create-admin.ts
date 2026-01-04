/**
 * Script to create the first admin user
 * Run with: npx ts-node scripts/create-admin.ts
 * 
 * Make sure to set MONGODB_URI in your environment variables
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

import mongoose from 'mongoose';
import User from '../models/User';
import { hashPassword } from '../lib/auth';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (password.length < 6) {
      console.error('Error: Password must be at least 6 characters');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Error: User with this email already exists');
      process.exit(1);
    }

    const hashedPassword = await hashPassword(password);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  } catch (error: any) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

createAdmin();

