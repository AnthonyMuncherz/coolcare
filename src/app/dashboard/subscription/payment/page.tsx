import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth, getUserSubscription } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import SubscriptionPaymentForm from '@/components/SubscriptionPaymentForm';
import ClientSubscriptionPlans from '@/components/ClientSubscriptionPlans';

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
                    <div className="px-4 py-5 sm:p-6">
                      <ClientSubscriptionPlans />
                    </div>
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