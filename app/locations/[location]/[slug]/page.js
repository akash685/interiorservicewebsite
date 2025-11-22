import Link from 'next/link';
import { notFound } from 'next/navigation';
import HeroContactForm from '@/components/HeroContactForm';
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
  const { location: locationSlug, slug: paramSlug } = await params;
  await dbConnect();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  if (!location) return { title: 'Page Not Found' };

  const service = await Service.findOne({ slug: paramSlug }).lean();
  if (service) {
    const url = `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}`;
    return {
      title: `${service.name} in ${location.name} | Gupta Furniture`,
      description: `Best ${service.name} services in ${location.name}, Nashik. ${service.metaDescription}`,
      keywords: [...service.keywords, `${service.name} in ${location.name}`],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${service.name} in ${location.name} | Gupta Furniture`,
        description: `Best ${service.name} services in ${location.name}. ${service.metaDescription}`,
        url: url,
        siteName: 'Gupta Furniture',
        images: [
          {
            url: service.image || '/hero.png',
            width: 1200,
            height: 630,
            alt: `${service.name} in ${location.name} - Gupta Furniture`,
          }
        ],
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${service.name} in ${location.name} | Gupta Furniture`,
        description: `Best ${service.name} services in ${location.name}. ${service.metaDescription}`,
        images: [service.image || '/hero.png'],
      },
    };
  }

  const sublocation = location.sublocations.find(sub => sub.toLowerCase().replace(/ /g, '-') === paramSlug);
  if (sublocation) {
    const url = `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}`;
    return {
      title: `Furniture Services in ${sublocation}, ${location.name}`,
      description: `Expert furniture services in ${sublocation}, ${location.name}.`,
      alternates: {
        canonical: url,
      },
    };
  }

  return { title: 'Page Not Found' };
}

export default async function DynamicLocationPage({ params }) {
  const { location: locationSlug, slug: paramSlug } = await params;
  await dbConnect();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  if (!location) notFound();

  // Case 1: Slug is a Service -> Render Service Page
  const service = await Service.findOne({ slug: paramSlug }).lean();
  if (service) {
    // Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": service.serviceType || "Home Interior Design",
      "name": `${service.name} in ${location.name}`,
      "description": service.description,
      "provider": {
        "@type": "LocalBusiness",
        "name": "Gupta Furniture & Interior",
        "image": "https://www.guptafurniturenashik.in/logo.png",
        "url": "https://www.guptafurniturenashik.in",
        "telephone": "+91 9511641912",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": location.name,
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
          "@type": "City",
          "name": location.name
        }
      },
      "image": service.image,
      "termsOfService": "https://www.guptafurniturenashik.in/terms",
      "url": `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}`
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
          "name": service.name,
          "item": `https://www.guptafurniturenashik.in/locations/${locationSlug}/${paramSlug}`
        }
      ]
    };

    // FAQ Schema
    const faqSchema = service.faqs && service.faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": service.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
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
                alt={`${service.name} in ${location.name}`}
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
                      {service.name} in {location.name}
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
                  {service.name} in {location.name}
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

              {/* Reviews Section */}
              {service.reviews && service.reviews.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Reviews</h2>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {service.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{review.author}</div>
                        <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{'⭐'.repeat(parseInt(review.ratingValue) || 5)}</div>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontStyle: 'italic' }}>"{review.reviewBody}"</p>
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

              {/* Nearby Areas */}
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1rem' }}>We also serve nearby areas:</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {location.sublocations.map((sub) => (
                    <Link 
                      key={sub} 
                      href={`/locations/${location.slug}/${sub.toLowerCase().replace(/ /g, '-')}/${service.slug}`}
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '0.25rem', textDecoration: 'none' }}
                    >
                      {service.name} in {sub}
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Sticky Contact Form */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '1rem', textAlign: 'center' }}>Get Quote</h3>
                <HeroContactForm service={service.name} location={location.name} context={`Book ${service.name}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Slug is a Sublocation -> Render Sublocation Landing
  const sublocation = location.sublocations.find(sub => sub.toLowerCase().replace(/ /g, '-') === paramSlug);
  if (sublocation) {
    const allServices = await Service.find({}).lean();
    
    return (
      <div>
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6">Services in {sublocation}</h1>
            <p className="text-xl text-gray-600">Expert furniture services in {sublocation}, {location.name}.</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allServices.map((svc) => (
                <div key={svc._id.toString()} className="bg-white border border-gray-200 p-6 hover:border-pink-600 transition-colors">
                  <div className="text-5xl mb-4">{svc.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{svc.name}</h3>
                  <Link 
                    href={`/locations/${location.slug}/${paramSlug}/${svc.slug}`} 
                    className="block w-full text-center py-3 px-6 text-white font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    View {svc.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  notFound();
}
