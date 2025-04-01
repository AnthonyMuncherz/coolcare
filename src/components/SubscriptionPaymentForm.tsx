"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  type: 'bank' | 'ewallet' | 'card';
}

export default function SubscriptionPaymentForm({ userId }: { userId: number }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  // Malaysian payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'fpx-maybank', name: 'Maybank2u', logo: '/images/payments/maybank.png', type: 'bank' },
    { id: 'fpx-cimb', name: 'CIMB Clicks', logo: '/images/payments/cimb.png', type: 'bank' },
    { id: 'fpx-rhb', name: 'RHB Now', logo: '/images/payments/rhb.png', type: 'bank' },
    { id: 'fpx-public', name: 'Public Bank', logo: '/images/payments/publicbank.png', type: 'bank' },
    { id: 'fpx-hong-leong', name: 'Hong Leong Connect', logo: '/images/payments/hongleong.png', type: 'bank' },
    { id: 'fpx-ambank', name: 'AmOnline', logo: '/images/payments/ambank.png', type: 'bank' },
    { id: 'ewallet-tng', name: 'Touch n Go eWallet', logo: '/images/payments/tng.png', type: 'ewallet' },
    { id: 'ewallet-boost', name: 'Boost', logo: '/images/payments/boost.png', type: 'ewallet' },
    { id: 'ewallet-grabpay', name: 'GrabPay', logo: '/images/payments/grabpay.png', type: 'ewallet' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setShowProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get the selected plan and billing cycle
      const selectedPlanId = (document.querySelector('input[name="plan"]:checked') as HTMLInputElement)?.value || 2;
      const billingCycle = (document.querySelector('input[name="billingCycle"]') as HTMLInputElement)?.value || 'yearly';
      
      // Simulate API call to create subscription
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId: selectedPlanId,
          paymentMethod: selectedMethod,
          billingCycle: billingCycle
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/service-request/new');
        }, 2000);
      } else {
        setError(data.message || 'Failed to process payment. Please try again.');
        setShowProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred. Please try again.');
      setShowProcessing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Payment successful!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your subscription has been activated. Redirecting to service request page...
        </p>
      </div>
    );
  }

  if (showProcessing) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 mb-4">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Processing payment</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we process your payment...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-3">Banking Options</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {paymentMethods.filter(method => method.type === 'bank').map((method) => (
            <div 
              key={method.id}
              className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-colors ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="h-12 w-24 relative mb-2 flex items-center justify-center">
                {/* Replace with actual bank logos */}
                <div className="text-center text-xs text-gray-600">{method.name}</div>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700">{method.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-3">E-Wallets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {paymentMethods.filter(method => method.type === 'ewallet').map((method) => (
            <div 
              key={method.id}
              className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-colors ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="h-12 w-24 relative mb-2 flex items-center justify-center">
                {/* Replace with actual ewallet logos */}
                <div className="text-center text-xs text-gray-600">{method.name}</div>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700">{method.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting || !selectedMethod}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
} 