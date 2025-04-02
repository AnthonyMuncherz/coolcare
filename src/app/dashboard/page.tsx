import { Metadata } from 'next';
import { requireAuth, getUserSubscription, getUserServiceRequests } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import { format } from 'date-fns';
import { getTechnicianServiceRequests, getAllServiceRequests } from '@/lib/technician';

export const metadata: Metadata = {
  title: 'Dashboard - CoolCare',
  description: 'Welcome to your CoolCare dashboard',
};

export default async function DashboardPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Check if user is authenticated
  const user = await requireAuth();
  
  // Get user subscription if they're a regular user
  const subscription = user.role !== 'technician' ? await getUserSubscription(user.id) : null;
  
  // Get user service requests if they're a regular user
  const serviceRequests = user.role !== 'technician' ? await getUserServiceRequests(user.id) : [];
  
  // Extract sort parameters - properly await them in Next.js 15
  const sortParams = await Promise.resolve(searchParams);
  const sortBy = typeof sortParams.sort === 'string' ? sortParams.sort : 'date';
  const sortOrder = typeof sortParams.order === 'string' ? sortParams.order : 'asc';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.role === 'technician' ? 'Technician Dashboard' : 'Dashboard'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">Welcome back, {user.name}!</p>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="dashboard" />
              
              {/* Main content */}
              <div className="flex-1 space-y-6">
                {user.role === 'technician' ? (
                  <TechnicianDashboardContent sortBy={sortBy as string} sortOrder={sortOrder as string} />
                ) : (
                  <RegularUserDashboardContent user={user} subscription={subscription} serviceRequests={serviceRequests} />
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

// Content for technician dashboard
async function TechnicianDashboardContent({ sortBy = 'date', sortOrder = 'asc' }: { sortBy: string, sortOrder: string }) {
  // Fetch service requests from database
  const serviceRequests = await getAllServiceRequests(sortBy, sortOrder);
  
  // Count requests by status
  const pendingCount = serviceRequests.filter(req => req.status === 'pending').length;
  const inProgressCount = serviceRequests.filter(req => req.status === 'in_progress').length;
  const completedThisWeek = serviceRequests.filter(req => {
    const isCompleted = req.status === 'completed';
    const updatedDate = new Date(req.updated_at || req.created_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return isCompleted && updatedDate >= oneWeekAgo;
  }).length;
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-900">Service Requests</h2>
          <div className="flex gap-2">
            <a 
              href="/dashboard/maintenance-schedule" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Maintenance Schedule
            </a>
            <a 
              href="/dashboard/maintenance-schedule/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Maintenance Visit
            </a>
          </div>
        </div>
        
        <div className="flex justify-end mb-4 space-x-2">
          <Link 
            href="/dashboard?sort=date&order=asc" 
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Date ↑
          </Link>
          <Link 
            href="/dashboard?sort=date&order=desc" 
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Date ↓
          </Link>
          <Link 
            href="/dashboard?sort=status&order=asc" 
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Status ↑
          </Link>
          <Link 
            href="/dashboard?sort=customer&order=asc" 
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Customer ↑
          </Link>
        </div>
        
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {serviceRequests.length > 0 ? (
                serviceRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">#{request.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.user_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.service_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {request.preferred_date} {request.preferred_time && `at ${request.preferred_time}`}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : request.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={`/dashboard/service-request/${request.id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                      <a href={`/dashboard/service-request/${request.id}/update`} className="text-indigo-600 hover:text-indigo-900">Update</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">No service requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{pendingCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{inProgressCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed This Week</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{completedThisWeek}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content for regular user dashboard
function RegularUserDashboardContent({ user, subscription, serviceRequests }: { user: any, subscription: any, serviceRequests: any[] }) {
  // Take only the 3 most recent service requests
  const recentRequests = serviceRequests.slice(0, 3);
  
  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
        {subscription ? (
          <div>
            <p className="text-sm text-gray-600 mb-1">
              You are currently subscribed to the <span className="font-medium">{subscription.plan_name}</span> plan.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Billing Cycle: <span className="font-medium">{subscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span> - 
              ${subscription.price}/{subscription.billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
            <div className="mt-2">
              <a
                href="/dashboard/subscription"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Manage Subscription
              </a>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">You don't have an active subscription.</p>
            <a
              href="/pricing"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Pricing Plans
            </a>
          </div>
        )}
      </div>
      
      {/* Service Requests Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Service Requests</h2>
          <a
            href="/dashboard/service-requests"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </a>
        </div>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Service</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentRequests.length > 0 ? (
                recentRequests.map((request: any) => (
                  <tr key={request.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {request.service_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(request.preferred_date), 'MM/dd/yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={`/dashboard/service-request/${request.id}`} className="text-blue-600 hover:text-blue-900">View</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    No recent service requests
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/dashboard/service-requests/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Request a Service
          </a>
          <a
            href="/dashboard/profile"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Profile
          </a>
        </div>
      </div>
    </div>
  );
} 