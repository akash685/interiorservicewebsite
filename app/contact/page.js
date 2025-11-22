import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import HeroContactForm from '@/components/HeroContactForm';
import Breadcrumb from '@/components/Breadcrumb';
// Icons replaced with inline SVGs to avoid lucide-react dependency

export async function generateMetadata() {
  await dbConnect();
  const settings = await Settings.getSiteSettings();

  return {
    title: `Contact Us | ${settings.siteName || 'Gupta Furniture'}`,
    description: `Contact ${settings.siteName || 'Gupta Furniture'} for premium furniture services. Call us at ${settings.businessPhone} or visit our store in Nashik.`,
    alternates: {
      canonical: 'https://www.guptafurniturenashik.in/contact',
    },
  };
}

export default async function ContactPage() {
  await dbConnect();
  const settings = await Settings.getSiteSettings();

  // Organization Schema for Contact Page
  const organizationSchemaContact = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.siteName || "Gupta Furniture & Interior",
    "url": "https://www.guptafurniturenashik.in",
    "logo": settings.logo || "https://www.guptafurniturenashik.in/logo.png",
    "description": "Professional furniture and interior design services in Nashik",
    "telephone": settings.businessPhone || "+91 9511641912",
    "email": settings.businessEmail || "hello@guptafurniture.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.businessAddress || "Nashik",
      "addressLocality": "Nashik",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.businessPhone || "+91 9511641912",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  // WebSite SearchAction Schema
  const websiteSchemaContact = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.guptafurniturenashik.in",
    "name": settings.siteName || "Gupta Furniture & Interior",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.guptafurniturenashik.in/services?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchemaContact) }} />
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchemaContact) }} />
      
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Contact', url: '/contact' }
      ]} />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for all your furniture and interior design needs. We are here to help you create your dream space.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {settings.businessPhone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <a href={`tel:${settings.businessPhone}`} className="text-gray-600 hover:text-pink-600 transition-colors">
                        {settings.businessPhone}
                      </a>
                      {settings.whatsappNumber && (
                        <div className="mt-1 text-sm text-green-600">
                          WhatsApp: {settings.whatsappNumber}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {settings.businessEmail && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <a href={`mailto:${settings.businessEmail}`} className="text-gray-600 hover:text-pink-600 transition-colors">
                        {settings.businessEmail}
                      </a>
                    </div>
                  </div>
                )}

                {settings.businessAddress && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {settings.businessAddress}
                      </p>
                    </div>
                  </div>
                )}

                {(settings.business?.openTime || settings.business?.workingDays) && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">
                        {settings.business.workingDays}
                      </p>
                      <p className="text-gray-600">
                        {settings.business.openTime} - {settings.business.closeTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {settings.googleMapsLink && (
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 h-64 overflow-hidden">
                <iframe 
                  src={settings.googleMapsLink}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <HeroContactForm context="Contact Page" />
          </div>
        </div>
      </div>
    </div>
  );
}
