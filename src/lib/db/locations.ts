import { getDb, closeDb } from '.';

export interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  isHeadOffice: boolean;
}

export async function initializeLocationsTable() {
  const db = await getDb();
  
  try {
    // Create locations table if it doesn't exist
    await db.exec(`
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
      )
    `);
    
    // Check if we need to seed the data
    const count = await db.get('SELECT COUNT(*) as count FROM locations');
    
    if (count.count === 0) {
      // Seed locations data
      const locations = [
        {
          name: 'CoolCare Headquarters',
          address: 'No. 123, Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
          phone: '+60 3-1234 5678',
          email: 'kl@coolcare.my',
          business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
          latitude: 3.159510,
          longitude: 101.715510,
          is_head_office: true
        },
        {
          name: 'CoolCare Petaling Jaya',
          address: 'Unit 5, Ground Floor, Jaya One, 72A Jalan Universiti, 46200 Petaling Jaya, Selangor',
          phone: '+60 3-7967 1234',
          email: 'pj@coolcare.my',
          business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
          latitude: 3.118470,
          longitude: 101.635880,
          is_head_office: false
        },
        {
          name: 'CoolCare Johor Bahru',
          address: '65, Jalan Ibrahim, Bandar Johor Bahru, 80000 Johor Bahru, Johor',
          phone: '+60 7-223 4567',
          email: 'jb@coolcare.my',
          business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
          latitude: 1.462910,
          longitude: 103.760530,
          is_head_office: false
        },
        {
          name: 'CoolCare Penang',
          address: '199, Beach Street, 10300 George Town, Penang',
          phone: '+60 4-261 7890',
          email: 'penang@coolcare.my',
          business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
          latitude: 5.414670,
          longitude: 100.329870,
          is_head_office: false
        },
        {
          name: 'CoolCare Kota Kinabalu',
          address: 'Lot 1-29, 1st Floor, Karamunsing Complex, 88100 Kota Kinabalu, Sabah',
          phone: '+60 88-255 6789',
          email: 'kk@coolcare.my',
          business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
          latitude: 5.981910,
          longitude: 116.077400,
          is_head_office: false
        }
      ];
      
      // Insert seed data
      const stmt = await db.prepare(`
        INSERT INTO locations (name, address, phone, email, business_hours, latitude, longitude, is_head_office)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const location of locations) {
        await stmt.run(
          location.name,
          location.address,
          location.phone,
          location.email,
          location.business_hours,
          location.latitude,
          location.longitude,
          location.is_head_office ? 1 : 0
        );
      }
      
      await stmt.finalize();
    }
  } finally {
    await closeDb(db);
  }
}

export async function getAllLocations(): Promise<Location[]> {
  const db = await getDb();
  
  try {
    const locations = await db.all(`
      SELECT 
        id,
        name,
        address,
        phone,
        email,
        business_hours as businessHours,
        latitude,
        longitude,
        is_head_office as isHeadOffice
      FROM locations
      ORDER BY is_head_office DESC, name ASC
    `);
    
    return locations;
  } finally {
    await closeDb(db);
  }
}

export async function getLocationById(id: number): Promise<Location | undefined> {
  const db = await getDb();
  
  try {
    const location = await db.get(`
      SELECT 
        id,
        name,
        address,
        phone,
        email,
        business_hours as businessHours,
        latitude,
        longitude,
        is_head_office as isHeadOffice
      FROM locations
      WHERE id = ?
    `, id);
    
    return location;
  } finally {
    await closeDb(db);
  }
}

export async function seedLocations(db: any) {
  try {
    // Seed locations data
    const locations = [
      {
        name: 'CoolCare Headquarters',
        address: 'No. 123, Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
        phone: '+60 3-1234 5678',
        email: 'kl@coolcare.my',
        business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
        latitude: 3.159510,
        longitude: 101.715510,
        is_head_office: true
      },
      {
        name: 'CoolCare Petaling Jaya',
        address: 'Unit 5, Ground Floor, Jaya One, 72A Jalan Universiti, 46200 Petaling Jaya, Selangor',
        phone: '+60 3-7967 1234',
        email: 'pj@coolcare.my',
        business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
        latitude: 3.118470,
        longitude: 101.635880,
        is_head_office: false
      },
      {
        name: 'CoolCare Johor Bahru',
        address: '65, Jalan Ibrahim, Bandar Johor Bahru, 80000 Johor Bahru, Johor',
        phone: '+60 7-223 4567',
        email: 'jb@coolcare.my',
        business_hours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
        latitude: 1.462910,
        longitude: 103.760530,
        is_head_office: false
      }
    ];
    
    // Insert seed data
    for (const location of locations) {
      await db.run(`
        INSERT INTO locations (name, address, phone, email, business_hours, latitude, longitude, is_head_office)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        location.name,
        location.address,
        location.phone,
        location.email,
        location.business_hours,
        location.latitude,
        location.longitude,
        location.is_head_office ? 1 : 0
      ]);
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding locations data:', error);
    return false;
  }
} 