import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import HeroContactForm from '@/components/HeroContactForm';
import Breadcrumb from '@/components/Breadcrumb';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

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
                      <Phone className="w-5 h-5" />
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
                      <Mail className="w-5 h-5" />
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
                      <MapPin className="w-5 h-5" />
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
                      <Clock className="w-5 h-5" />
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
