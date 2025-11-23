'use client';

import { useState, useEffect } from 'react';
import { Phone, AlertCircle } from './Icons';

export default function PhoneInput({
  value = '',
  onChange,
  label = 'Phone Number',
  placeholder = 'Enter your 10-digit mobile number',
  required = true,
  className = '',
  disabled = false,
  showLabel = true,
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // India country code constant
  const COUNTRY_CODE = '+91';

  // Update phone number when value prop changes
  useEffect(() => {
    if (value) {
      const fullPhone = value.startsWith(COUNTRY_CODE) 
        ? value.replace(COUNTRY_CODE, '') 
        : value;
      setPhoneNumber(fullPhone);
    }
  }, [value]);

  const validatePhoneNumber = (phone) => {
    if (!phone) {
      return required ? 'Phone number is required' : '';
    }

    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');

    // Indian mobile number validation
    if (cleanPhone.length !== 10) {
      return 'Please enter a valid 10-digit mobile number';
    }
    
    // Check if it starts with valid Indian mobile prefixes (6, 7, 8, 9)
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return 'Please enter a valid Indian mobile number (should start with 6, 7, 8, or 9)';
    }

    return '';
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    
    // Only allow digits (numeric-only restriction)
    const cleaned = input.replace(/[^\d]/g, '');
    
    // Limit to 10 digits for Indian mobile numbers
    const limitedCleaned = cleaned.slice(0, 10);
    
    // Update local state
    setPhoneNumber(limitedCleaned);
    setTouched(true);
    
    // Validate and update parent component
    const validationError = validatePhoneNumber(limitedCleaned);
    setError(validationError);
    
    // Create full phone number with country code
    const fullPhone = COUNTRY_CODE + limitedCleaned;
    
    // Call parent onChange with full phone number
    if (onChange) {
      onChange(fullPhone);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validatePhoneNumber(phoneNumber);
    setError(validationError);
  };

  const isValid = !error && (phoneNumber || !required);

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-light)' }}>
          <Phone className="w-4 h-4" />
        </div>
        
        {/* India Country Code Display */}
        <div className="absolute inset-y-0 left-8 pl-2 flex items-center pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-2.5 text-sm border-r" style={{ borderColor: 'var(--border)', color: 'var(--text-medium)' }}>
            <span>🇮🇳</span>
            <span className="font-medium">{COUNTRY_CODE}</span>
          </div>
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-24 pr-10 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2"
          style={{ 
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-dark)',
            '--tw-ring-color': 'var(--primary)'
          }}
        />
        
        {/* Validation Icons */}
        {touched && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : isValid && phoneNumber ? (
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && touched && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      

      
      {/* Hidden input to store full phone number with country code */}
      <input
        type="hidden"
        name="phone"
        value={COUNTRY_CODE + phoneNumber}
      />
    </div>
  );
}