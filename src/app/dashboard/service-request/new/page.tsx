import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth, getUserSubscription } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import ServiceRequestFormComponent from '@/components/ServiceRequestFormComponent';

export const metadata: Metadata = {
  title: 'New Service Request - CoolCare',
  description: 'Submit a new air conditioning service request.',
};

export default async function NewServiceRequestPage() {
  // Check if user is authenticated
  const user = await requireAuth();
  
  // Get user subscription
  const subscription = await getUserSubscription(user.id);
  
  // Check if user has an active subscription
  const hasActiveSubscription = !!subscription;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">New Service Request</h1>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="service-requests" />
              
              {/* Main content */}
              <div className="flex-1 bg-white rounded-lg shadow p-6">
                {hasActiveSubscription ? (
                  <ServiceRequestForm user={user} />
                ) : (
                  <SubscriptionRequired />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function SubscriptionRequired() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">Active Subscription Required</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        To submit a service request, you need an active subscription plan. Subscribe now to access this feature and enjoy regular maintenance services.
      </p>
      <Link 
        href="/dashboard/subscription/payment" 
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Subscribe Now
      </Link>
    </div>
  );
}

function ServiceRequestForm({ user }: { user: any }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Please fill out the form below to submit a new service request. Our team will respond to your request as soon as possible.
      </p>
      
      <ServiceRequestFormComponent userId={user.id} />
    </div>
  );
} 