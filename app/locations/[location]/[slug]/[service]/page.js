import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import Breadcrumb from '@/components/Breadcrumb';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import Service from '@/models/Service';

// Helper to format slug to name
const formatName = (slug) => slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// Helper function to format description with markdown
function formatDescription(description) {
  if (!description) return null;
  
  const lines = description.split('\n');
  const elements = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    if (trimmedLine.startsWith('### ')) {
      elements.push(
        <h3 key={index} style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
          {trimmedLine.replace('### ', '')}
        </h3>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-dark)', marginTop: '2.5rem', marginBottom: '1.25rem' }}>
          {trimmedLine.replace('## ', '')}
        </h2>
      );
    } else if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)', marginTop: '3rem', marginBottom: '1.5rem' }}>
          {trimmedLine.replace('# ', '')}
        </h1>
      );
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const content = trimmedLine.replace(/^[*-]\s/, '');
      elements.push(
        <li key={index} style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '0.5rem' }}>
          {content}
        </li>
      );
    } else if (trimmedLine.includes('***') || trimmedLine.includes('**')) {
      const formatted = trimmedLine
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong style="font-weight: 700; color: var(--text-dark)">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: var(--text-dark)">$1</strong>');
      elements.push(
        <p key={index} style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    } else {
      elements.push(
        <p key={index} style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
          {trimmedLine}
        </p>
      );
    }
  });
  
  return elements;
}

export async function generateMetadata({ params }) {
  const { location: locationSlug, service: serviceSlug, slug: paramSlug } = await params;
  await dbConnect();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  const service = await Service.findOne({ slug: serviceSlug }).lean();
  const sublocationName = formatName(paramSlug); 
  
  if (!location || !service) return { title: 'Page Not Found' };
  
  const url = `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}/${serviceSlug}`;
  const title = `${service.name} in ${sublocationName}, ${location.name} | Gupta Furniture`;
  const description = `Expert ${service.name} in ${sublocationName}, ${location.name}. Fast service, affordable rates. Book now!`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url: url,
      siteName: 'Gupta Furniture',
      images: [
        {
          url: service.image || '/hero.png',
          width: 1200,
          height: 630,
          alt: `${service.name} in ${sublocationName}, ${location.name} - Gupta Furniture`,
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [service.image || '/hero.png'],
    },
  };
}

export default async function SubLocationServicePage({ params }) {
  const { location: locationSlug, service: serviceSlug, slug: paramSlug } = await params;
  await dbConnect();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  const service = await Service.findOne({ slug: serviceSlug }).lean();
  const sublocationName = formatName(paramSlug);
  
  if (!location || !service) {
    notFound();
  }

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.serviceType || "Home Interior Design",
    "name": `${service.name} in ${sublocationName}, ${location.name}`,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Gupta Furniture & Interior",
      "image": "https://www.guptafurniturenashik.in/logo.png",
      "url": "https://www.guptafurniturenashik.in",
      "telephone": "+91 9511641912",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": `${sublocationName}, ${location.name}`,
        "addressLocality": location.name,
        "addressRegion": "Maharashtra",
        "postalCode": location.pincode || "422001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.latitude || "19.9975",
        "longitude": location.longitude || "73.7898"
      },
      "priceRange": service.priceRange || "₹₹₹",
      "areaServed": {
        "@type": "Place",
        "name": `${sublocationName}, ${location.name}`
      }
    },
    "image": service.image,
    "termsOfService": "https://www.guptafurniturenashik.in/terms",
    "url": `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}/${serviceSlug}`
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.guptafurniturenashik.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://www.guptafurniturenashik.in/locations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": location.name,
        "item": `https://www.guptafurniturenashik.in/locations/${locationSlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": sublocationName,
        "item": `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": service.name,
        "item": `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}/${serviceSlug}`
      }
    ]
  };

  // FAQ Schema
  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question.replace(/Nashik/gi, sublocationName),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/Nashik/gi, sublocationName)
      }
    }))
  } : null;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gupta Furniture & Interior",
    "url": "https://www.guptafurniturenashik.in",
    "logo": "https://www.guptafurniturenashik.in/logo.png",
    "description": "Professional furniture and interior design services",
    "telephone": "+91 9511641912",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": `${sublocationName}, ${location.name}`,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  };

  // WebSite SearchAction Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.guptafurniturenashik.in",
    "name": "Gupta Furniture & Interior",
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
    <div className="min-h-screen bg-gray-50">
      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* FAQ Schema (if exists) */}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' },
        { name: location.name, url: `/locations/${locationSlug}` },
        { name: sublocationName, url: `/locations/${locationSlug}/${paramSlug}` },
        { name: service.name, url: `/locations/${locationSlug}/${paramSlug}/${serviceSlug}` }
      ]} />
      
      {/* Hero Section with Full Width Image */}
      <section className="relative bg-gray-50">
        {service.image && (
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100">
            <img 
              src={service.image} 
              alt={`${service.name} in ${sublocationName}, ${location.name}`}
              className="w-full h-full object-cover"
            />
            {/* Title Overlay - Centered */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 p-8">
              <div className="max-w-6xl mx-auto px-6 w-full">
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                    {service.name} in {sublocationName}
                  </h1>
                  
                  <div className="flex justify-center gap-3">
                    {service.serviceType && (
                      <span className="px-3 py-2 bg-white bg-opacity-90 border border-white border-opacity-30 text-gray-900 text-sm font-medium rounded">
                        {service.serviceType}
                      </span>
                    )}
                    {service.priceRange && (
                      <span className="px-3 py-2 bg-white bg-opacity-90 border border-white border-opacity-30 text-gray-900 text-sm font-medium rounded">
                        {service.priceRange}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!service.image && (
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
                {service.name} in {sublocationName}
              </h1>
              
              <div className="flex justify-center gap-3 mb-8">
                {service.serviceType && (
                  <span className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded">
                    {service.serviceType}
                  </span>
                )}
                {service.priceRange && (
                  <span className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded">
                    {service.priceRange}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Description Section */}
            {service.description && (
              <section style={{ marginBottom: '3rem' }}>
                <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '2rem' }}>
                  <div style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
                    {formatDescription(service.description)}
                  </div>
                </div>
              </section>
            )}

            {/* Service Highlights */}
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1rem' }}>Service Highlights</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-light)' }}>
                  <li style={{ marginBottom: '0.5rem' }}>Fast service in {sublocationName}</li>
                  <li style={{ marginBottom: '0.5rem' }}>Background verified professionals</li>
                  <li style={{ marginBottom: '0.5rem' }}>Affordable pricing</li>
                  <li style={{ marginBottom: '0.5rem' }}>100% Satisfaction Guarantee</li>
                </ul>
              </div>
            </section>

            {/* Offers/Packages Section */}
            {service.offers && service.offers.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Packages</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {service.offers.map((offer, index) => (
                    <div key={index} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{offer.name}</h3>
                      <div style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--primary)', marginBottom: '0.75rem' }}>{offer.price}</div>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.5' }}>{offer.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {service.faqs && service.faqs.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Questions</h2>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {service.faqs.slice(0, 4).map((faq, index) => (
                    <details key={index} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '1rem' }}>
                      <summary style={{ fontWeight: '500', cursor: 'pointer', color: 'var(--text-dark)', fontSize: '0.875rem', outline: 'none', listStyle: 'none', margin: 0 }}>{faq.question}</summary>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', lineHeight: '1.5', marginTop: '0.5rem', marginBottom: 0 }}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sticky Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Get Quote</h3>
              <ContactForm 
                service={service.name} 
                location={location.name}
                sublocation={sublocationName}
                context={`Book in ${sublocationName}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
