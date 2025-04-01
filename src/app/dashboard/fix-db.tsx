"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FixDatabase() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const resetDatabase = async () => {
    setLoading(true);
    setStatus('Resetting database...');
    setError(null);
    
    try {
      const response = await fetch('/api/reset-db');
      const data = await response.json();
      
      if (data.success) {
        setStatus('Database reset successfully. You can now try logging in again.');
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to reset database');
        setStatus('Failed to reset database');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setStatus('Error resetting database');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Repair Tool</h1>
          <p className="mb-4 text-gray-600">
            If you're experiencing database errors, this tool can help fix them by resetting your database.
          </p>
          
          {status && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
              {status}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="mt-6 space-y-4">
              <Link 
                href="/login" 
                className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Login Page
              </Link>
              
              <Link 
                href="/" 
                className="inline-block w-full py-3 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go to Homepage
              </Link>
            </div>
          ) : (
            <button
              onClick={resetDatabase}
              disabled={loading}
              className="mt-6 w-full py-3 px-4 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Database'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 