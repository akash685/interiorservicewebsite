'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-24 px-6">
      <h2 className="text-4xl font-semibold text-gray-900 mb-6">
        Something went wrong!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="text-white px-8 py-3 font-semibold hover:opacity-90 transition-colors"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        Try again
      </button>
    </div>
  );
}
