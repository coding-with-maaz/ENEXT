'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MockDataBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    // Check if we're using mock data by testing API connection
    const checkApiConnection = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // If API fails or returns no data, we might be using mock data
        if (!res.ok || !data.success || !data.data || data.data.length === 0) {
          setUsingMockData(true);
          setIsVisible(true);
        }
      } catch (error) {
        // API not available, likely using mock data
        setUsingMockData(true);
        setIsVisible(true);
      }
    };

    // Only check in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development') {
      checkApiConnection();
    }
  }, []);

  // Don't show in production unless explicitly needed
  if (process.env.NODE_ENV === 'production' && !usingMockData) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-fade-in">
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-900 mb-1">Demo Mode</h4>
          <p className="text-sm text-yellow-800">
            Showing mock data. Connect your database to see real data.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

