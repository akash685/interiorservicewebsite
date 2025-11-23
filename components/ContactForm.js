'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User, Check } from './Icons';

export default function ContactForm({ service, location, sublocation, context }) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

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
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: '+91' + formData.phone,
          service,
          location,
          sublocation,
          pageUrl: pathname,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm" style={{ maxWidth: '400px' }}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
          {context || 'Get a Free Quote'}
        </h3>
        
        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
              <Check className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>Thank you!</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-medium)' }}>We will call you shortly.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="text-xs font-medium underline hover:opacity-80 transition-opacity"
              style={{ color: 'var(--primary)' }}
            >
              Send another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="name" style={{ color: 'var(--text-dark)' }}>Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none" style={{ color: 'var(--text-light)' }}>
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-pink-500"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            
            {/* Phone Field */}
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="phone" style={{ color: 'var(--text-dark)' }}>
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none" style={{ color: 'var(--text-light)' }}>
                  <span className="text-xs">🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  maxLength="10"
                  className="w-full pl-16 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-pink-500"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="p-2 text-xs border rounded" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <p className="text-red-600">Something went wrong. Please try again.</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full text-white py-2 px-4 text-sm font-medium rounded transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Request Callback'}
            </button>
            
            {/* Privacy Notice */}
            <p className="text-xs text-center" style={{ color: 'var(--text-light)' }}>
              *We respect your privacy. No spam.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
