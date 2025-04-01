import { NextResponse } from 'next/server';
import { getDb, closeDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  
  try {
    const services = await db.all('SELECT * FROM services ORDER BY name');
    
    return NextResponse.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch services'
    }, { status: 500 });
  } finally {
    await closeDb(db);
  }
} 