'use client';

import { useState } from 'react';

export default function HeroContactForm({ service, location, sublocation, context = 'Quick Inquiry' }) {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        service: service || '',
        location: location || '',
        sublocation: sublocation || '',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '' });
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 outline-none transition-colors focus:border-[var(--primary)]"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          pattern="[0-9]{10}"
          className="w-full px-4 py-3 border border-gray-300 outline-none transition-colors focus:border-[var(--primary)]"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full px-6 py-3 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {status === 'sending' ? 'Sending...' : 'Get Free Quote'}
        </button>
      </div>

      {status === 'success' && (
        <p className="mt-4 text-green-600 text-center font-medium">
          ✓ Thank you! We'll contact you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-600 text-center">
          ✗ Something went wrong. Please try again.
        </p>
      )}

      {location && (
        <p className="mt-3 text-sm text-gray-500 text-center">
          📍 Serving in {location} {sublocation && `(${sublocation})`}
        </p>
      )}
    </form>
  );
}

