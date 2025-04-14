"use client";

import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // Get the appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    if (user.role === 'admin') {
      return '/admin-dashboard';
    } else {
      return '/dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">CoolCare</span>
            <div className="text-2xl font-bold text-blue-600">
              Cool<span className="text-cyan-500">Care</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            Home
          </Link>
          <Link href="/services" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            Services
          </Link>
          <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            Contact
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-5 lg:justify-end lg:flex-1">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href={getDashboardLink()}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin-dashboard/user-management" 
                      className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                    >
                      User Management
                    </Link>
                  )}
                  {user.role !== 'admin' && (
                    <Link 
                      href="/dashboard/service-request/new" 
                      className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                    >
                      Request Service
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-gray-500/75"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">CoolCare</span>
                <div className="text-2xl font-bold text-blue-600">
                  Cool<span className="text-cyan-500">Care</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link 
                    href="/"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/services"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link 
                    href="/pricing"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="/about"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    href="/contact"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {user && (
                    <Link 
                      href={getDashboardLink()}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                  )}
                  {user && user.role === 'admin' && (
                    <Link 
                      href="/admin-dashboard/user-management"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      User Management
                    </Link>
                  )}
                </div>
                <div className="py-6">
                  {!loading && (
                    <>
                      {user ? (
                        user.role !== 'admin' && (
                          <Link
                            href="/dashboard/service-requests/new"
                            className="mt-2 block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Request Service
                          </Link>
                        )
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Log in
                          </Link>
                          <Link
                            href="/signup"
                            className="mt-2 block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Get started
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 