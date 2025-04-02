import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAllUsers } from '@/lib/admin';
import { getTechnicianServiceRequests } from '@/lib/technician';
import UserManagement from '@/components/UserManagement';

export const metadata: Metadata = {
  title: 'Admin Dashboard - CoolCare',
  description: 'Manage users, technicians, and service operations',
};

export default async function AdminDashboardPage() {
  // Check if user is authenticated and is an admin
  const user = await requireAuth();
  
  // If user is not an admin, redirect to dashboard
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  // Get service requests (similar to technician dashboard)
  const serviceRequests = await getTechnicianServiceRequests();
  
  // Get all users for the user management section
  const users = await getAllUsers();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex space-x-3">
                  <Link 
                    href="/admin-dashboard/maintenance"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Maintenance Schedule
                  </Link>
                  <Link 
                    href="/admin-dashboard/create-maintenance"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Maintenance Visit
                  </Link>
                </div>
              </div>
            </div>
            
            {/* User Management Section */}
            <div className="mb-10">
              <UserManagement initialUsers={users} />
            </div>
            
            {/* Service requests */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Service Requests
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Pending and in-progress requests across all technicians
                </p>
              </div>
              
              {serviceRequests.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No service requests available at the moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {serviceRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{request.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.user_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.service_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.preferred_date).toLocaleDateString()}
                            {request.preferred_time && ` at ${request.preferred_time}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : request.status === 'in_progress' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/admin-dashboard/service-request/${request.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              View
                            </Link>
                            <Link 
                              href={`/admin-dashboard/service-request/${request.id}/update`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Update
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {users.length}
                  </dd>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Requests
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {serviceRequests.filter(req => req.status === 'pending').length}
                  </dd>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {serviceRequests.filter(req => req.status === 'in_progress').length}
                  </dd>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed This Week
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {serviceRequests.filter(req => req.status === 'completed').length}
                  </dd>
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