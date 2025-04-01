import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth, getUserSubscription, getUserServiceRequests } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardOverview from '@/components/DashboardOverview';

export const metadata: Metadata = {
  title: 'Dashboard - CoolCare',
  description: 'Manage your CoolCare subscription, view maintenance schedules, and request services.',
};

export default async function DashboardPage() {
  // Check if user is authenticated, redirect to login if not
  const user = await requireAuth();
  
  if (!user) {
    redirect('/login');
  }
  
  // Get user subscription and service requests
  const subscription = await getUserSubscription(user.id);
  const serviceRequests = await getUserServiceRequests(user.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {user.name}!
            </p>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="overview" />
              
              {/* Main content */}
              <div className="flex-1">
                <DashboardOverview 
                  user={user} 
                  subscription={subscription} 
                  serviceRequests={serviceRequests} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 