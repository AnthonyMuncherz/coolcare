import { Metadata } from 'next';
import Link from 'next/link';
import SignupForm from '@/components/SignupForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sign Up - CoolCare',
  description: 'Create a CoolCare account to access premium air conditioning maintenance services across Malaysia.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Create your account</h1>
            
            <div className="bg-white shadow-md rounded-lg p-8">
              <SignupForm />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 