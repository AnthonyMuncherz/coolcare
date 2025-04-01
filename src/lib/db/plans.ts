import { getDb, closeDb } from '.';

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  popular: boolean;
  features: string[];
}

export async function initializePlansTable() {
  const db = await getDb();
  
  try {
    // Create plans table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        billing_cycle TEXT NOT NULL,
        popular BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create plan_features table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS plan_features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        feature TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES plans (id)
      )
    `);
    
    // Check if we need to seed the data
    const count = await db.get('SELECT COUNT(*) as count FROM plans');
    
    if (count.count === 0) {
      // Seed plans data
      const plans = [
        {
          name: 'Basic',
          description: 'Essential care for your air conditioning system',
          price: 899,
          billing_cycle: 'year',
          popular: false,
          features: [
            '2 regular maintenance visits per year',
            'Filter cleaning and replacement',
            'System performance check',
            'Basic system cleaning',
            'Email support',
            '10% discount on repairs'
          ]
        },
        {
          name: 'Standard',
          description: 'Complete maintenance coverage for worry-free comfort',
          price: 1499,
          billing_cycle: 'year',
          popular: true,
          features: [
            '3 maintenance visits per year',
            'Deep cleaning service',
            'All Basic plan features',
            'Priority scheduling',
            '24/7 phone support',
            '15% discount on repairs',
            'Free refrigerant top-up (if needed)'
          ]
        },
        {
          name: 'Premium',
          description: 'Comprehensive protection for multiple AC units',
          price: 2499,
          billing_cycle: 'year',
          popular: false,
          features: [
            '4 maintenance visits per year',
            'Coverage for up to 3 AC units',
            'All Standard plan features',
            'Emergency service within 4 hours',
            'Annual deep cleaning service',
            '25% discount on repairs',
            'Free minor parts replacement',
            'Extended warranty on repairs'
          ]
        },
        {
          name: 'Business',
          description: 'Tailored solutions for commercial properties',
          price: 3999,
          billing_cycle: 'year',
          popular: false,
          features: [
            'Customized maintenance schedule',
            'Coverage for multiple AC units',
            'Dedicated account manager',
            'Priority emergency service',
            'Annual performance optimization',
            'Detailed service reports',
            'Staff training on basic maintenance',
            '30% discount on all services'
          ]
        }
      ];
      
      // Insert seed data for plans
      for (const plan of plans) {
        const result = await db.run(`
          INSERT INTO plans (name, description, price, billing_cycle, popular)
          VALUES (?, ?, ?, ?, ?)
        `, [plan.name, plan.description, plan.price, plan.billing_cycle, plan.popular ? 1 : 0]);
        
        const planId = result.lastID;
        
        // Insert features for this plan
        for (const feature of plan.features) {
          await db.run(`
            INSERT INTO plan_features (plan_id, feature)
            VALUES (?, ?)
          `, [planId, feature]);
        }
      }
    }
  } finally {
    await closeDb(db);
  }
}

export async function getAllPlans(): Promise<Plan[]> {
  const db = await getDb();
  
  try {
    const plans = await db.all(`
      SELECT 
        id,
        name,
        description,
        price,
        billing_cycle as billingCycle,
        popular
      FROM plans
      ORDER BY price ASC
    `);
    
    // Get features for each plan
    for (const plan of plans) {
      const features = await db.all(`
        SELECT feature
        FROM plan_features
        WHERE plan_id = ?
        ORDER BY id ASC
      `, plan.id);
      
      plan.features = features.map(f => f.feature);
    }
    
    return plans;
  } finally {
    await closeDb(db);
  }
}

export async function getPlanById(id: number): Promise<Plan | undefined> {
  const db = await getDb();
  
  try {
    const plan = await db.get(`
      SELECT 
        id,
        name,
        description,
        price,
        billing_cycle as billingCycle,
        popular
      FROM plans
      WHERE id = ?
    `, id);
    
    if (!plan) {
      return undefined;
    }
    
    // Get features for the plan
    const features = await db.all(`
      SELECT feature
      FROM plan_features
      WHERE plan_id = ?
      ORDER BY id ASC
    `, plan.id);
    
    plan.features = features.map(f => f.feature);
    
    return plan;
  } finally {
    await closeDb(db);
  }
}

// Function to seed plans data
export async function seedPlans(db: any) {
  try {
    // Seed plans data
    const plans = [
      {
        name: 'Basic',
        description: 'Essential care for your air conditioning system',
        price: 99,
        billing_cycle: 'monthly',
        popular: false,
        features: [
          '2 regular maintenance visits per year',
          'Filter cleaning and replacement',
          'System performance check',
          'Basic system cleaning',
          'Email support',
          '10% discount on repairs'
        ]
      },
      {
        name: 'Standard',
        description: 'Complete maintenance coverage for worry-free comfort',
        price: 199,
        billing_cycle: 'monthly',
        popular: true,
        features: [
          '3 maintenance visits per year',
          'Deep cleaning service',
          'All Basic plan features',
          'Priority scheduling',
          '24/7 phone support',
          '15% discount on repairs',
          'Free refrigerant top-up (if needed)'
        ]
      },
      {
        name: 'Premium',
        description: 'Comprehensive protection for multiple AC units',
        price: 299,
        billing_cycle: 'monthly',
        popular: false,
        features: [
          '4 maintenance visits per year',
          'Coverage for up to 3 AC units',
          'All Standard plan features',
          'Emergency service within 4 hours',
          'Annual deep cleaning service',
          '25% discount on repairs',
          'Free minor parts replacement',
          'Extended warranty on repairs',
          'Multiple units coverage'
        ]
      }
    ];
    
    // Insert seed data for plans with features directly in the plans table
    for (const plan of plans) {
      await db.run(`
        INSERT INTO plans (name, description, price, billing_cycle, isPopular, features)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        plan.name, 
        plan.description, 
        plan.price, 
        plan.billing_cycle, 
        plan.popular ? 1 : 0,
        JSON.stringify(plan.features)
      ]);
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding plans data:', error);
    return false;
  }
} 