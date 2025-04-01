"use server";

import { getDb, closeDb } from './db/index';
import { hashPassword } from './auth';

export async function seedDatabase() {
  console.log('Starting database seeding...');
  
  const db = await getDb();
  
  try {
    // Add test services
    const services = [
      {
        name: 'Basic AC Maintenance',
        slug: 'basic-ac-maintenance',
        description: 'Regular maintenance service for your air conditioning unit',
        longDescription: 'Our basic maintenance includes cleaning filters, checking refrigerant levels, and ensuring optimal performance.',
        price: 120.00,
        imageUrl: '/images/services/basic-maintenance.jpg',
        featured: true
      },
      {
        name: 'Deep Cleaning',
        slug: 'deep-cleaning',
        description: 'Deep cleaning of all AC components',
        longDescription: 'Our deep cleaning service includes dismantling the unit, thorough cleaning of all components, and reassembly.',
        price: 250.00,
        imageUrl: '/images/services/deep-cleaning.jpg',
        featured: true
      },
      {
        name: 'Repair Service',
        slug: 'repair-service',
        description: 'Diagnostic and repair of AC issues',
        longDescription: 'Our repair service includes diagnosing issues, replacing parts if necessary, and ensuring your unit works properly.',
        price: 200.00,
        imageUrl: '/images/services/repair.jpg',
        featured: false
      }
    ];
    
    console.log('Adding services...');
    for (const service of services) {
      await db.run(`
        INSERT OR IGNORE INTO services (name, slug, description, longDescription, price, imageUrl, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [service.name, service.slug, service.description, service.longDescription, service.price, service.imageUrl, service.featured ? 1 : 0]);
    }
    
    // Add subscription plans
    const plans = [
      {
        name: 'Basic Plan',
        price: 99.00,
        billing_cycle: 'Monthly',
        description: 'Basic maintenance plan for one AC unit',
        features: JSON.stringify([
          'Monthly maintenance check',
          'Filter cleaning',
          'Performance optimization',
          'Phone support'
        ]),
        isPopular: false
      },
      {
        name: 'Standard Plan',
        price: 199.00,
        billing_cycle: 'Monthly',
        description: 'Standard maintenance plan for up to two AC units',
        features: JSON.stringify([
          'Bi-weekly maintenance check',
          'Deep cleaning twice a year',
          'Performance optimization',
          'Priority phone support',
          '10% discount on repairs'
        ]),
        isPopular: true
      },
      {
        name: 'Premium Plan',
        price: 299.00,
        billing_cycle: 'Monthly',
        description: 'Premium maintenance plan for up to three AC units',
        features: JSON.stringify([
          'Weekly maintenance check',
          'Deep cleaning quarterly',
          'Performance optimization',
          '24/7 emergency support',
          '20% discount on repairs',
          'Free part replacements'
        ]),
        isPopular: false
      }
    ];
    
    console.log('Adding plans...');
    for (const plan of plans) {
      await db.run(`
        INSERT OR IGNORE INTO plans (name, price, billing_cycle, description, features, isPopular)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [plan.name, plan.price, plan.billing_cycle, plan.description, plan.features, plan.isPopular ? 1 : 0]);
    }
    
    // Add test user if it doesn't exist
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await hashPassword('password123'),
      phone: '0123456789',
      address: '123 Test Street, Kuala Lumpur',
      role: 'customer'
    };
    
    console.log('Adding test user...');
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [testUser.email]);
    
    let userId;
    if (!existingUser) {
      const result = await db.run(`
        INSERT INTO users (name, email, password, phone, address, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [testUser.name, testUser.email, testUser.password, testUser.phone, testUser.address, testUser.role]);
      
      userId = result.lastID;
    } else {
      userId = existingUser.id;
    }
    
    // Get plan ID for subscriptions
    const standardPlan = await db.get('SELECT id FROM plans WHERE name = ?', ['Standard Plan']);
    
    if (userId && standardPlan && standardPlan.id) {
      console.log('Adding subscription for test user...');
      
      // Check if user already has a subscription
      const existingSubscription = await db.get('SELECT id FROM subscriptions WHERE user_id = ?', [userId]);
      
      if (!existingSubscription) {
        // Add subscription for test user
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        
        await db.run(`
          INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status)
          VALUES (?, ?, datetime('now'), ?, 'active')
        `, [userId, standardPlan.id, oneMonthLater.toISOString()]);
      }
      
      // Add service requests for test user
      console.log('Adding service requests...');
      
      // Get service IDs
      const basicService = await db.get('SELECT id FROM services WHERE slug = ?', ['basic-ac-maintenance']);
      const deepCleaningService = await db.get('SELECT id FROM services WHERE slug = ?', ['deep-cleaning']);
      
      if (basicService && deepCleaningService) {
        // Check if user already has service requests
        const existingRequests = await db.get('SELECT COUNT(*) as count FROM service_requests WHERE user_id = ?', [userId]);
        
        if (!existingRequests || existingRequests.count === 0) {
          // Add a pending request
          const twoWeeksFromNow = new Date();
          twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
          
          await db.run(`
            INSERT INTO service_requests (user_id, service_id, requested_date, status, notes)
            VALUES (?, ?, ?, 'pending', 'Please service my AC unit in the living room')
          `, [userId, basicService.id, twoWeeksFromNow.toISOString()]);
          
          // Add a completed request
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          await db.run(`
            INSERT INTO service_requests (user_id, service_id, requested_date, status, notes)
            VALUES (?, ?, ?, 'completed', 'Deep cleaning for bedroom AC')
          `, [userId, deepCleaningService.id, oneWeekAgo.toISOString()]);
        }
      }
    }
    
    console.log('Database seeded successfully');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Error seeding database: ' + (error instanceof Error ? error.message : String(error)) };
  } finally {
    await closeDb(db);
  }
} 