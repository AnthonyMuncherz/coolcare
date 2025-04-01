"use client";

import { useState } from "react";

interface CancelSubscriptionButtonProps {
  subscriptionId: number;
}

export default function CancelSubscriptionButton({ subscriptionId }: CancelSubscriptionButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('subscriptionId', subscriptionId.toString());
      
      try {
        const response = await fetch('/api/subscriptions/cancel', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          window.location.href = '/dashboard/subscription?cancelled=true';
        } else {
          console.error('Failed to cancel subscription');
          alert('Failed to cancel subscription. Please try again.');
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      onClick={handleCancel}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Cancelling...' : 'Cancel Subscription'}
    </button>
  );
} 