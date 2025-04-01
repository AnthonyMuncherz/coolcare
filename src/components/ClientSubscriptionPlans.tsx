"use client";

import { useState } from 'react';

export default function ClientSubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  // Yearly plans data
  const yearlyPlans = [
    {
      id: 1,
      name: 'Basic',
      price: 899,
      features: [
        '2 regular maintenance visits per year',
        'Filter cleaning and replacement',
        'System performance check',
        'Basic system cleaning',
        'Email support',
        '10% discount on repairs'
      ],
      isRecommended: false,
    },
    {
      id: 2,
      name: 'Standard',
      price: 1499,
      features: [
        '3 maintenance visits per year',
        'Deep cleaning service',
        'Priority scheduling',
        '24/7 phone support',
        '15% discount on repairs',
        'Free refrigerant top-up (if needed)'
      ],
      isRecommended: true,
    },
    {
      id: 3,
      name: 'Premium',
      price: 2499,
      features: [
        '4 maintenance visits per year',
        'Coverage for up to 3 AC units',
        'Emergency service within 4 hours',
        'Annual deep cleaning service',
        '25% discount on repairs',
        'Free minor parts replacement',
        'Extended warranty on repairs'
      ],
      isRecommended: false,
    },
  ];
  
  // Monthly plans data (calculated from yearly prices)
  const monthlyPlans = yearlyPlans.map(plan => ({
    ...plan,
    price: Math.round(plan.price / 12)
  }));
  
  // Select appropriate plans based on billing cycle
  const plans = billingCycle === 'yearly' ? yearlyPlans : monthlyPlans;
  
  return (
    <>
      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingCycle === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingCycle === 'yearly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Yearly
            {billingCycle === 'yearly' ? null : (
              <span className="ml-1 text-xs text-green-600 font-semibold">Save 20%</span>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-lg p-6 ${
              plan.isRecommended 
                ? 'border-blue-500 ring-2 ring-blue-500 relative' 
                : 'border-gray-200'
            }`}
          >
            {plan.isRecommended && (
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                RECOMMENDED
              </span>
            )}
            <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
            <p className="mt-4">
              <span className="text-3xl font-extrabold text-gray-900">RM {plan.price}</span>
              <span className="text-base font-medium text-gray-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
            </p>
            <ul className="mt-6 space-y-4 text-black">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <label className="inline-flex items-center">
                <input
                  name="plan"
                  type="radio"
                  defaultChecked={plan.isRecommended}
                  className="form-radio h-4 w-4 text-blue-600"
                  value={plan.id}
                />
                <span className="ml-2 text-sm text-gray-700">Select</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      {/* Hidden input to pass billing cycle value to server */}
      <input type="hidden" name="billingCycle" value={billingCycle} />
    </>
  );
} 