import { getDb, closeDb } from '.';

export interface Service {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  priceFrom: number;
}

export async function initializeServicesTable() {
  const db = await getDb();
  
  try {
    // Create services table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        short_description TEXT NOT NULL,
        icon TEXT NOT NULL,
        price_from INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if we need to seed the data
    const count = await db.get('SELECT COUNT(*) as count FROM services');
    
    if (count.count === 0) {
      // Seed services data
      const services = [
        {
          name: 'Regular Maintenance',
          description: 'Our regular maintenance service includes thorough cleaning of all AC components, refrigerant level check, performance testing, and minor repairs. Recommended every 3-6 months to maintain optimal efficiency and extend the lifespan of your air conditioning system.',
          short_description: 'Comprehensive cleaning and performance optimization to keep your AC running at peak efficiency.',
          icon: 'WrenchScrewdriverIcon',
          price_from: 129
        },
        {
          name: 'Deep Cleaning',
          description: 'Our deep cleaning service addresses accumulated dust, mold, and bacteria in your AC system. We disassemble and thoroughly clean all components including coils, blower wheel, and drains. Recommended annually to improve air quality and system performance.',
          short_description: 'Complete disassembly and thorough cleaning of all AC components to restore performance and air quality.',
          icon: 'SparklesIcon',
          price_from: 259
        },
        {
          name: 'Refrigerant Recharge',
          description: 'If your system isn\'t cooling properly, it may need a refrigerant recharge. Our certified technicians will check for leaks, repair them if found, and recharge your system to manufacturer specifications. All refrigerant handling complies with Malaysian environmental regulations.',
          short_description: 'Professional refrigerant level check and recharge for optimal cooling performance.',
          icon: 'BeakerIcon',
          price_from: 199
        },
        {
          name: 'Emergency Repairs',
          description: 'When your AC breaks down unexpectedly, our emergency repair service is available 24/7. Our technicians will diagnose the issue and perform necessary repairs to get your system running again as quickly as possible, minimizing discomfort in Malaysia\'s tropical climate.',
          short_description: '24/7 emergency support for unexpected breakdowns and urgent repairs.',
          icon: 'BoltIcon',
          price_from: 249
        },
        {
          name: 'System Inspection & Assessment',
          description: 'Our comprehensive inspection service evaluates your entire AC system\'s condition and efficiency. We identify potential issues before they become major problems and provide detailed recommendations for maintenance or upgrades to improve performance and energy efficiency.',
          short_description: 'Thorough evaluation of your AC system\'s condition with detailed recommendations.',
          icon: 'MagnifyingGlassIcon',
          price_from: 159
        },
        {
          name: 'Installation & Setup',
          description: 'Our professional installation service ensures your new air conditioning system is properly sized, installed, and configured for optimal performance. We handle everything from mounting to electrical work and provide guidance on efficient operation.',
          short_description: 'Expert installation and setup of new AC systems with optimal configuration.',
          icon: 'HomeModernIcon',
          price_from: 499
        }
      ];
      
      // Insert seed data
      const stmt = await db.prepare(`
        INSERT INTO services (name, description, short_description, icon, price_from)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const service of services) {
        await stmt.run(
          service.name,
          service.description,
          service.short_description,
          service.icon,
          service.price_from
        );
      }
      
      await stmt.finalize();
    }
  } finally {
    await closeDb(db);
  }
}

export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  
  try {
    const services = await db.all(`
      SELECT 
        id,
        name,
        description,
        short_description as shortDescription,
        icon,
        price_from as priceFrom
      FROM services
      ORDER BY id ASC
    `);
    
    return services;
  } finally {
    await closeDb(db);
  }
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const db = await getDb();
  
  try {
    const service = await db.get(`
      SELECT 
        id,
        name,
        description,
        short_description as shortDescription,
        icon,
        price_from as priceFrom
      FROM services
      WHERE id = ?
    `, id);
    
    return service;
  } finally {
    await closeDb(db);
  }
} 