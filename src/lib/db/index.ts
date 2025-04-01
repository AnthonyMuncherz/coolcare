import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

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
        // Check if subscriptions table has a user_id column
        const columns = await db.all(`PRAGMA table_info(subscriptions)`);
        if (!columns.some(c => c.name === 'user_id')) {
          // Drop the table if it has the incorrect schema
          console.log('Dropping outdated subscriptions table');
          await db.exec(`DROP TABLE subscriptions`);
        }
      }
      if (table.name === 'service_requests') {
        // Check if service_requests table has a user_id column
        const columns = await db.all(`PRAGMA table_info(service_requests)`);
        if (!columns.some(c => c.name === 'user_id')) {
          // Drop the table if it has the incorrect schema
          console.log('Dropping outdated service_requests table');
          await db.exec(`DROP TABLE service_requests`);
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
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      longDescription TEXT,
      price REAL,
      imageUrl TEXT,
      featured BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      billing_cycle TEXT NOT NULL,
      description TEXT,
      features TEXT,
      isPopular BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      latitude REAL,
      longitude REAL,
      phone TEXT,
      email TEXT,
      businessHours TEXT,
      isHeadOffice BOOLEAN DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      start_date TEXT DEFAULT CURRENT_TIMESTAMP,
      end_date TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (plan_id) REFERENCES plans (id)
    );
    
    CREATE TABLE IF NOT EXISTS service_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      requested_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (service_id) REFERENCES services (id)
    );
    
    CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subscription_id INTEGER NOT NULL,
      scheduled_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      technician_name TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    );
  `);
}

// Function to close database connection
export async function closeDb(db: any) {
  if (db) {
    await db.close();
  }
} 