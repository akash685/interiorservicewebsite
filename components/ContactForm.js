'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User, Phone, Check } from './Icons';

export default function ContactForm({ service, location, sublocation, context }) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="bg-white border border-gray-200 p-8">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">
        {context || 'Get a Free Quote'}
      </h3>
      
      {status === 'success' ? (
        <div className="p-8 bg-green-50 text-green-700 border border-green-200">
          <div className="w-12 h-12 bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-lg font-semibold mb-2 text-center">Thank you!</p>
          <p className="mb-4 text-center">We will call you shortly.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="text-sm font-medium underline hover:text-green-800 transition-colors"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 outline-none transition-colors"
                style={{ '--tw-ring-color': 'var(--primary)' }}
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 outline-none transition-colors"
                style={{ '--tw-ring-color': 'var(--primary)' }}
                placeholder="Enter your mobile number"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit mobile number"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-600 text-sm text-center border border-red-200">
              Something went wrong. Please try again.
            </div>
          )}

          <button 
            type="submit" 
            className="w-full text-white py-3.5 px-4 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--primary)' }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : 'Request Callback'}
          </button>
          
          <p className="text-xs text-center text-gray-500">
            *We respect your privacy. No spam.
          </p>
        </form>
      )}
    </div>
  );
}
