'use client';

import { useState } from 'react';

export function useQuotaErrorHandler() {
  const [quotaError, setQuotaError] = useState<string | null>(null);

  const handleApiCall = async (apiCall: () => Promise<Response>) => {
    try {
      const response = await apiCall();
      if (response.status === 402) {
        const data = await response.json();
        if (data.error === 'quota_exceeded') {
          setQuotaError('You\'ve hit your monthly limit. Upgrade on Pricing.');
          return { success: false, quotaExceeded: true };
        }
      }
      return { success: response.ok, quotaExceeded: false };
    } catch (error) {
      console.error('API call failed:', error);
      return { success: false, quotaExceeded: false };
    }
  };

  const clearQuotaError = () => setQuotaError(null);

  return { quotaError, handleApiCall, clearQuotaError };
}

export function QuotaErrorBanner({ error, onDismiss }: { error: string | null; onDismiss: () => void }) {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-red-900">Monthly Limit Reached</h4>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <div className="mt-3 flex gap-2">
            <a
              href="/pricing"
              className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              Upgrade Plan
            </a>
            <button
              onClick={onDismiss}
              className="text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
} 