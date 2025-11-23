'use client';

import { useState } from 'react';

export default function HeroContactForm({ service, location, sublocation, context = 'Quick Inquiry' }) {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('');

  const handleChange = (field, value) => {
    if (field === 'phone') {
      // Only allow digits and limit to 10 numbers
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const payload = {
        name: formData.name,
        phone: '+91' + formData.phone,
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
    <div className="w-full max-w-md mx-auto">
      {status === 'success' ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>Thank you!</p>
          <p className="text-sm" style={{ color: 'var(--text-medium)' }}>We'll contact you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2"
            style={{ 
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-dark)',
              '--tw-ring-color': 'var(--primary)'
            }}
          />
          
          {/* Phone Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-light)' }}>
              <span className="text-sm">🇮🇳 +91</span>
            </div>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              maxLength="10"
              className="w-full pl-20 pr-3 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2"
              style={{ 
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-dark)',
                '--tw-ring-color': 'var(--primary)'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {status === 'sending' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : 'Get Free Quote'}
          </button>

          {/* Status Messages */}
          {status === 'error' && (
            <p className="text-center text-red-600 text-sm py-2 px-3 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
              Something went wrong. Please try again.
            </p>
          )}

          {location && (
            <p className="text-center text-sm" style={{ color: 'var(--text-light)' }}>
              📍 Serving in {location} {sublocation && `(${sublocation})`}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

