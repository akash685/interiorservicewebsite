import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
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

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* FAQ Schema (if exists) */}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      
      {/* Hero Section with Full Width Image */}
      <section style={{ backgroundColor: 'var(--background)', position: 'relative' }}>
        {service.image && (
          <div style={{ width: '100%', height: '500px', overflow: 'hidden', backgroundColor: 'var(--surface)', position: 'relative' }}>
            <img 
              src={service.image} 
              alt={`${service.name} in ${sublocationName}, ${location.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Title Overlay - Centered */}
            <div style={{ 
              position: 'absolute', 
              top: 0,
              left: 0, 
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              padding: '2rem'
            }}>
              <div className="content-container">
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem', lineHeight: '1.2', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {service.name} in {sublocationName}
                  </h1>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                    {service.serviceType && (
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem', color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: '500', borderRadius: '0.25rem' }}>
                        {service.serviceType}
                      </span>
                    )}
                    {service.priceRange && (
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem', color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: '500', borderRadius: '0.25rem' }}>
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
          <div className="content-container" style={{ padding: '3rem 0 2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem', lineHeight: '1.2' }}>
                {service.name} in {sublocationName}
              </h1>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                {service.serviceType && (
                  <span style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', color: 'var(--text-medium)', fontSize: '0.75rem', borderRadius: '0.25rem' }}>
                    {service.serviceType}
                  </span>
                )}
                {service.priceRange && (
                  <span style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', color: 'var(--text-medium)', fontSize: '0.75rem', borderRadius: '0.25rem' }}>
                    {service.priceRange}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="content-container" style={{ padding: '2rem 0 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column - Main Content */}
          <div>
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
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1rem', textAlign: 'center' }}>Get Quote</h3>
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
