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
  // Create subscriptions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      plan TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create maintenance_schedules table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER NOT NULL,
      scheduled_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      technician_name TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    )
  `);
  
  // Create service_requests table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER NOT NULL,
      request_type TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    )
  `);
}

// Function to close database connection
export async function closeDb(db: any) {
  if (db) {
    await db.close();
  }
} 