'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileContactButtons({ 
  phoneNumber = '+919511641912', 
  whatsappNumber = '+919511641912' 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show buttons after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I would like to inquire about your services.');
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Mobile-only floating buttons */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex max-w-md mx-auto">
          {/* Call Button */}
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: 'var(--primary)' }}
            aria-label="Call us"
          >
            <Phone className="w-5 h-5" />
            <span>Call Now</span>
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: '#25D366' }}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Add padding to bottom of page on mobile to prevent content from being hidden */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 50px !important;
          }
        }
      `}</style>
    </>
  );
}
