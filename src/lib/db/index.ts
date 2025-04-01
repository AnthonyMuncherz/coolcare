import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { seedPlans } from './plans';
import { seedServices } from './services';
import { seedLocations } from './locations';

// Function to get database connection
export async function getDb() {
  const db = await open({
    filename: path.join(process.cwd(), 'coolcare.db'),
    driver: sqlite3.Database,
  });
  
  // Initialize database tables if they don't exist
  await initializeDb(db);
  
  return db;
}

// Function to initialize database tables
async function initializeDb(db: any) {
  try {
    // First, check if the tables exist with incorrect schema and drop them
    const tableInfo = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`);
    for (const table of tableInfo) {
      if (table.name === 'subscriptions') {
        // Check if subscriptions table has the required columns
        const columns = await db.all(`PRAGMA table_info(subscriptions)`);
        const hasUserId = columns.some((c: {name: string}) => c.name === 'user_id');
        const hasPaymentMethod = columns.some((c: {name: string}) => c.name === 'payment_method');
        const hasCreatedAt = columns.some((c: {name: string}) => c.name === 'created_at');
        
        if (!hasUserId || !hasPaymentMethod || !hasCreatedAt) {
          // Drop the table if it has the incorrect schema
          console.log('Dropping outdated subscriptions table');
          await db.exec(`DROP TABLE subscriptions`);
        }
      }
      if (table.name === 'service_requests') {
        // Check if service_requests table has the required columns
        const columns = await db.all(`PRAGMA table_info(service_requests)`);
        const hasUserId = columns.some((c: {name: string}) => c.name === 'user_id');
        const hasDescription = columns.some((c: {name: string}) => c.name === 'description');
        const hasPreferredDate = columns.some((c: {name: string}) => c.name === 'preferred_date');
        const hasPreferredTime = columns.some((c: {name: string}) => c.name === 'preferred_time');
        const hasAddress = columns.some((c: {name: string}) => c.name === 'address');
        const hasTechnicianNotes = columns.some((c: {name: string}) => c.name === 'technician_notes');
        const hasUpdatedAt = columns.some((c: {name: string}) => c.name === 'updated_at');
        
        if (!hasUserId || !hasDescription || !hasPreferredDate || !hasPreferredTime || !hasAddress) {
          // Drop the table if it has the incorrect schema
          console.log('Dropping outdated service_requests table');
          await db.exec(`DROP TABLE service_requests`);
        } else {
          // Add missing columns if they don't exist
          if (!hasTechnicianNotes) {
            console.log('Adding technician_notes column to service_requests table');
            await db.exec(`ALTER TABLE service_requests ADD COLUMN technician_notes TEXT`);
          }
          
          if (!hasUpdatedAt) {
            console.log('Adding updated_at column to service_requests table');
            await db.exec(`ALTER TABLE service_requests ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP`);
          }
        }
      }
      
      // Check if plans table has incorrect pricing (monthly vs yearly)
      if (table.name === 'plans') {
        const basicPlan = await db.get(`SELECT price, billing_cycle FROM plans WHERE name = 'Basic' LIMIT 1`);
        
        // If basic plan exists and has incorrect pricing (99 instead of 899) or billing cycle (monthly instead of year)
        if (basicPlan && (basicPlan.price < 800 || basicPlan.billing_cycle !== 'year')) {
          console.log('Dropping plans and plan_features tables to fix pricing');
          await db.exec(`DROP TABLE IF EXISTS plan_features`);
          await db.exec(`DROP TABLE IF EXISTS plans`);
        }
      }
      
      // Check if maintenance_schedules table has the updated_at column
      if (table.name === 'maintenance_schedules') {
        const columns = await db.all(`PRAGMA table_info(maintenance_schedules)`);
        const hasUpdatedAt = columns.some((c: {name: string}) => c.name === 'updated_at');
        
        if (!hasUpdatedAt) {
          console.log('Adding updated_at column to maintenance_schedules table');
          await db.exec(`ALTER TABLE maintenance_schedules ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking existing tables:', error);
  }
  
  // Create all tables with proper schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      billing_cycle TEXT NOT NULL,
      popular BOOLEAN NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS plan_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      feature TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (plan_id) REFERENCES plans (id)
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT NOT NULL,
      icon TEXT NOT NULL,
      price_from INTEGER NOT NULL,
      slug TEXT,
      longDescription TEXT,
      price INTEGER,
      imageUrl TEXT,
      featured BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      business_hours TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      is_head_office BOOLEAN NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      payment_method TEXT NOT NULL,
      start_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      end_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (plan_id) REFERENCES plans (id)
    );
    
    CREATE TABLE IF NOT EXISTS service_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT,
      address TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      technician_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (service_id) REFERENCES services (id)
    );
    
    CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subscription_id INTEGER NOT NULL,
      scheduled_date TEXT NOT NULL,
      scheduled_time TEXT,
      status TEXT NOT NULL DEFAULT 'scheduled',
      technician_name TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    );
  `);

  // Seed sample data if tables are empty
  await seedSampleData(db);
}

// Function to seed sample data if tables are empty
async function seedSampleData(db: any) {
  try {
    // Check if plans table is empty
    const plansCount = await db.get('SELECT COUNT(*) as count FROM plans');
    if (plansCount.count === 0) {
      console.log('Seeding plans data...');
      await seedPlans(db);
    }
    
    // Check if services table is empty
    const servicesCount = await db.get('SELECT COUNT(*) as count FROM services');
    if (servicesCount.count === 0) {
      console.log('Seeding services data...');
      await seedServices(db);
    }
    
    // Check if locations table is empty
    const locationsCount = await db.get('SELECT COUNT(*) as count FROM locations');
    if (locationsCount.count === 0) {
      console.log('Seeding locations data...');
      await seedLocations(db);
    }
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
}

// Function to close database connection
export async function closeDb(db: any) {
  if (db) {
    await db.close();
  }
} 