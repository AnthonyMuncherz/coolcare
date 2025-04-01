import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth, getUserSubscription } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import SubscriptionPaymentForm from '@/components/SubscriptionPaymentForm';

export const metadata: Metadata = {
  title: 'Subscribe - CoolCare',
  description: 'Subscribe to a CoolCare maintenance plan',
};

export default async function SubscriptionPaymentPage() {
  // Check if user is authenticated
  const user = await requireAuth();
  
  // Get user subscription
  const subscription = await getUserSubscription(user.id);
  
  // If user already has an active subscription, redirect to dashboard
  if (subscription) {
    redirect('/dashboard/service-request/new');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">Subscribe to CoolCare</h1>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="subscription" />
              
              {/* Main content */}
              <div className="flex-1">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Select a subscription plan
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Choose a plan that best suits your needs
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    <SubscriptionPlans />
                  </div>
                </div>
                
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Payment Information
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Complete your subscription by selecting a payment method
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <SubscriptionPaymentForm userId={user.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function SubscriptionPlans() {
  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 899,
      billingCycle: 'Year',
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
      billingCycle: 'Year',
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
      billingCycle: 'Year',
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

  return (
    <div className="px-4 py-5 sm:p-6">
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
              <span className="text-base font-medium text-gray-500">/{plan.billingCycle.toLowerCase()}</span>
            </p>
            <ul className="mt-6 space-y-4">
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
    </div>
  );
} 