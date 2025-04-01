import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { promises as fs } from 'fs';
import { getDb, closeDb } from '@/lib/db/index';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    console.log('Starting database reset...');
    // Get the database file path
    const dbPath = path.join(process.cwd(), 'coolcare.db');
    
    try {
      // Check if file exists
      await fs.access(dbPath);
      
      try {
        // Try to delete the existing database file
        await unlink(dbPath);
        console.log('Database file deleted successfully');
      } catch (error) {
        console.log('Error deleting database file:', error);
        
        // If we can't delete, try to truncate it
        try {
          console.log('Attempting to truncate database file');
          const handle = await fs.open(dbPath, 'w');
          await handle.truncate(0);
          await handle.close();
          console.log('Database file truncated successfully');
        } catch (truncateError) {
          console.log('Could not truncate database file:', truncateError);
        }
      }
    } catch (accessError) {
      console.log('Database file does not exist, will create new');
    }
    
    // Force close any existing connections
    try {
      const tempDb = await getDb();
      await tempDb.exec('PRAGMA optimize');
      await closeDb(tempDb);
    } catch (error) {
      console.log('Error closing existing connections:', error);
    }
    
    console.log('Creating new database...');
    // Now re-initialize the database
    const db = await getDb(); // This will create a new database
    
    // Force creation of all tables
    await db.exec(`
      DROP TABLE IF EXISTS maintenance_schedules;
      DROP TABLE IF EXISTS service_requests;
      DROP TABLE IF EXISTS subscriptions;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS plans;
      DROP TABLE IF EXISTS services;
      DROP TABLE IF EXISTS locations;
    `);
    
    await closeDb(db);
    
    console.log('Database structure reset, now seeding...');
    // Seed the new database
    const seedResult = await seedDatabase();
    
    console.log('Database reset completed');
    return NextResponse.json(
      { 
        success: true, 
        message: 'Database reset and seeded successfully',
        seedResult
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database reset error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred during database reset',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 