"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UpdateMaintenanceFormProps {
  maintenanceId: number;
  currentStatus: 'scheduled' | 'completed' | 'cancelled';
  currentNotes?: string;
}

export default function UpdateMaintenanceForm({ 
  maintenanceId, 
  currentStatus,
  currentNotes = ''
}: UpdateMaintenanceFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'scheduled' | 'completed' | 'cancelled'>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/technician/update-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maintenanceId,
          status,
          notes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Maintenance visit updated successfully!' });
        // If updated successfully, redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard/maintenance-schedule');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update maintenance visit' });
      }
    } catch (error) {
      console.error('Error updating maintenance visit:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating the maintenance visit' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            required
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add any notes about this maintenance visit"
          ></textarea>
        </div>

        {message.text && (
          <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Maintenance Visit'}
          </button>
        </div>
      </div>
    </form>
  );
} 