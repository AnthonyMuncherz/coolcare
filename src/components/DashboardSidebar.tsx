"use client";

import Link from 'next/link';
import { User } from '@/lib/auth';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Props {
  user: User;
  activePage: string;
}

export default function DashboardSidebar({ user, activePage }: Props) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: HomeIcon,
      id: 'overview',
    },
    {
      name: 'Service Requests',
      href: '/dashboard/service-requests',
      icon: ClipboardDocumentListIcon,
      id: 'service-requests',
    },
    {
      name: 'Maintenance Schedule',
      href: user.role === 'technician' ? '/dashboard/maintenance-schedule' : '/dashboard/schedule',
      icon: CalendarIcon,
      id: user.role === 'technician' ? 'maintenance-schedule' : 'schedule',
    },
    ...(user.role !== 'technician' ? [{
      name: 'Subscription',
      href: '/dashboard/subscription',
      icon: CreditCardIcon,
      id: 'subscription',
    }] : []),
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: UserCircleIcon,
      id: 'profile',
    },
  ];
  
  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <UserCircleIcon className="h-10 w-10 text-blue-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.href}
                className={`flex items-center px-5 py-3 text-sm font-medium ${
                  activePage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
          
          <li className="px-5 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Log out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
} 