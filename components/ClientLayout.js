'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function ClientLayout({ children, settings }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar settings={settings} />
      
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>

      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <div className="mb-6 flex items-center gap-3">
                {settings?.logo ? (
                  <Image 
                    src={settings.logo} 
                    alt="Gupta Furniture" 
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain rounded-md"
                    loading="lazy"
                    quality={85}
                  />
                ) : (
                  <Image 
                    src="/logo.png" 
                    alt="Gupta Furniture" 
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain rounded-md"
                    loading="lazy"
                    quality={85}
                  />
                )}
                <span className="text-xl font-bold text-white tracking-tight">
                  {settings?.siteName || 'Gupta Furniture'}
                </span>
              </div>
              {settings?.tagline && (
                <p className="text-gray-400 text-sm mb-6 -mt-4">{settings.tagline}</p>
              )}
              <h3 className="font-semibold text-white mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm">
                {settings?.businessAddress && <p>{settings.businessAddress}</p>}
                {settings?.businessPhone && (
                  <p>Phone: <a href={`tel:${settings.businessPhone}`} className="transition-colors" style={{ color: 'var(--primary)' }}>{settings.businessPhone}</a></p>
                )}
                {settings?.businessEmail && (
                  <p>Email: <a href={`mailto:${settings.businessEmail}`} className="transition-colors" style={{ color: 'var(--primary)' }}>{settings.businessEmail}</a></p>
                )}
                {settings?.googleMapsLink && (
                  <p className="mt-2">
                    <a 
                      href={settings.googleMapsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:underline flex items-center gap-1"
                      style={{ color: 'var(--primary)' }}
                    >
                      Get Directions →
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm flex flex-col">
                <Link href="/" className="hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>Home</Link>
                <Link href="/services" className="hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>Services</Link>
                <Link href="/locations" className="hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>Locations</Link>
                <Link href="/blog" className="hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>Blog</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                {settings?.business?.workingDays && <p>{settings.business.workingDays}</p>}
                {settings?.business?.openTime && settings?.business?.closeTime && (
                  <p>{settings.business.openTime} - {settings.business.closeTime}</p>
                )}
              </div>
            </div>
            {settings?.business?.serviceAreas?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-white mb-4">Service Areas</h3>
                <p className="text-sm text-gray-300">
                  {settings.business.serviceAreas.join(', ')}
                </p>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-400">{settings?.copyrightText || `© ${new Date().getFullYear()} Gupta Furniture. All rights reserved.`}</p>
            <div className="mt-4 text-sm space-x-4">
              <Link href="/privacy-policy" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms-of-service" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>Terms of Service</Link>
            </div>
            
            {/* Social Media Links */}
            {settings?.socialMedia && (
              <div className="mt-6 flex justify-center gap-4">
                {settings.socialMedia.facebook && (
                  <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>
                    Facebook
                  </a>
                )}
                {settings.socialMedia.instagram && (
                  <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>
                    Instagram
                  </a>
                )}
                {settings.socialMedia.twitter && (
                  <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>
                    Twitter
                  </a>
                )}
                {settings.socialMedia.linkedin && (
                  <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>
                    LinkedIn
                  </a>
                )}
                {settings.socialMedia.youtube && (
                  <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>
                    YouTube
                  </a>
                )}
                {settings.socialMedia.pinterest && (
                  <a href={settings.socialMedia.pinterest} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80 transition-colors" style={{ color: 'var(--primary)' }}>
                    Pinterest
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
