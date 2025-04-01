import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import ProfileForm from '@/components/ProfileForm';

export const metadata: Metadata = {
  title: 'My Profile - CoolCare',
  description: 'Manage your profile information',
};

export default async function ProfilePage() {
  // Check if user is authenticated
  const user = await requireAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="profile" />
              
              {/* Main content */}
              <div className="flex-1 bg-white rounded-lg shadow p-6">
                <div className="pb-5 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Account Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal details and contact information.
                  </p>
                </div>
                
                <div className="mt-6">
                  <ProfileForm user={user} />
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