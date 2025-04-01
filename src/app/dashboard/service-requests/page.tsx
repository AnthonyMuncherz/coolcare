import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth, getUserServiceRequests } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Service Requests - CoolCare',
  description: 'Manage your air conditioning service requests',
};

export default async function ServiceRequestsPage() {
  // Check if user is authenticated
  const user = await requireAuth();
  
  // Get user service requests
  const serviceRequests = await getUserServiceRequests(user.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Service Requests</h1>
              <Link 
                href="/dashboard/service-request/new" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Request
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="service-requests" />
              
              {/* Main content */}
              <div className="flex-1">
                {serviceRequests.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {serviceRequests.map((request: any) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{request.service_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{new Date(request.preferred_date).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500">{request.preferred_time || 'Any time'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : request.status === 'in_progress' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status === 'in_progress' ? 'In Progress' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-600 hover:text-blue-900">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No service requests yet</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      You haven't made any service requests yet. Click the button below to create your first request.
                    </p>
                    <div className="mt-6">
                      <Link 
                        href="/dashboard/service-request/new" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Create Service Request
                      </Link>
                    </div>
                  </div>
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