import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Location from '@/models/Location';
import Image from 'next/image';

export async function generateMetadata({ params, searchParams }) {
  const { service: serviceSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const locationParam = resolvedSearchParams?.location;
  
  await dbConnect();
  const service = await Service.findOne({ slug: serviceSlug }).lean();
  if (!service) return { title: 'Service Not Found' };
  
  const url = `https://www.guptafurniturenashik.in/services/${service.slug}`;
  const title = locationParam 
    ? `${service.name} in ${locationParam} | Gupta Furniture`
    : service.metaTitle || `${service.name} Services in Nashik`;
  
  return {
    title,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: service.metaDescription,
      url: url,
      siteName: 'Gupta Furniture',
      images: [
        {
          url: service.image || '/hero.png',
          width: 1200,
          height: 630,
          alt: `${service.name} - Gupta Furniture Nashik`,
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: service.metaDescription,
      images: [service.image || '/hero.png'],
    },
  };
}

// Helper function to format description with markdown
function formatDescription(description) {
  if (!description) return null;
  
  // Split by lines
  const lines = description.split('\n');
  const elements = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    // Check for headings
    if (trimmedLine.startsWith('### ')) {
      elements.push(
        <h3 key={index} style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-dark)',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          {trimmedLine.replace('### ', '')}
        </h3>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--text-dark)',
          marginTop: '2.5rem',
          marginBottom: '1.25rem'
        }}>
          {trimmedLine.replace('## ', '')}
        </h2>
      );
    } else if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-dark)',
          marginTop: '3rem',
          marginBottom: '1.5rem'
        }}>
          {trimmedLine.replace('# ', '')}
        </h1>
      );
    }
    // Check for bullet points
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const content = trimmedLine.replace(/^[*-]\s/, '');
      elements.push(
        <li key={index} style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          lineHeight: '1.8',
          marginBottom: '0.5rem'
        }}>
          {content}
        </li>
      );
    }
    // Check for bold text (*** or **)
    else if (trimmedLine.includes('***') || trimmedLine.includes('**')) {
      const formatted = trimmedLine
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong style="font-weight: 700; color: var(--text-dark)">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: var(--text-dark)">$1</strong>');
      
      elements.push(
        <p key={index} style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          lineHeight: '1.8',
          marginBottom: '1rem'
        }} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={index} style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          lineHeight: '1.8',
          marginBottom: '1rem'
        }}>
          {trimmedLine}
        </p>
      );
    }
  });
  
  return elements;
}

export default async function ServicePage({ params, searchParams }) {
  const { service: serviceSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const locationParam = resolvedSearchParams?.location;
  
  await dbConnect();
  const service = await Service.findOne({ slug: serviceSlug }).lean();
  const locations = await Location.find({}).sort({ name: 1 }).lean();
  
  if (!service) {
    notFound();
  }

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.serviceType || "Home Interior Design",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Gupta Furniture & Interior",
      "image": "https://www.guptafurniturenashik.in/logo.png",
      "url": "https://www.guptafurniturenashik.in",
      "telephone": "+91 9511641912",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Nashik",
        "addressLocality": "Nashik",
        "addressRegion": "Maharashtra",
        "postalCode": "422001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.9975",
        "longitude": "73.7898"
      },
      "priceRange": service.priceRange || "₹₹₹",
      "areaServed": [
        { "@type": "City", "name": "Nashik" },
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Pune" }
      ]
    },
    "image": service.image,
    "termsOfService": "https://www.guptafurniturenashik.in/terms",
    "url": `https://www.guptafurniturenashik.in/services/${service.slug}`
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
        "name": "Services",
        "item": "https://www.guptafurniturenashik.in/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.name,
        "item": `https://www.guptafurniturenashik.in/services/${service.slug}`
      }
    ]
  };

  // FAQ Schema (if FAQs exist)
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

  // Organization Schema
  const organizationSchemaService = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gupta Furniture & Interior",
    "url": "https://www.guptafurniturenashik.in",
    "logo": "https://www.guptafurniturenashik.in/logo.png",
    "description": "Professional furniture and interior design services",
    "telephone": "+91 9511641912",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nashik",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  };

  // AggregateRating Schema  
  const aggregateRatingSchemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "524",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // WebSite SearchAction Schema
  const websiteSchemaService = {
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
    <div style={{ 
      backgroundColor: 'var(--background)',
      minHeight: '100vh'
    }}>
      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* FAQ Schema (if exists) */}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchemaService) }} />
      {/* AggregateRating Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchemaService) }} />
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchemaService) }} />
      
      {/* Hero Section with Full Width Image */}
      <section style={{ position: 'relative' }}>
        {/* Full Width Hero Image with Title Overlay */}
        {service.image && (
          <div className="relative w-full h-[500px] overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="content-container w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-6 text-white/90">
                  <Link href="/" className="hover:underline">Home</Link>
                  <span>/</span>
                  <Link href="/services" className="hover:underline">Services</Link>
                  <span>/</span>
                  <span className="text-white font-medium">{service.name}</span>
                </nav>

                {/* Title */}
                <h1 className="text-5xl font-bold mb-4 tracking-tight text-white">
                  {service.name}{locationParam && ` in ${locationParam}`}
                </h1>
                <p className="text-xl mb-6 text-white/90">
                  Professional interior design services
                </p>

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-3">
                  {service.serviceType && (
                    <span className="px-4 py-2 text-sm font-medium bg-white/95 text-gray-900 backdrop-blur-sm">
                      {service.serviceType}
                    </span>
                  )}
                  {service.priceRange && (
                    <span className="px-4 py-2 text-sm font-medium bg-white/95 text-gray-900 backdrop-blur-sm">
                      Free consultation
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Title Section when no image */}
        {!service.image && (
          <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <div className="content-container py-16">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-light)' }}>
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:underline">Services</Link>
                <span>/</span>
                <span style={{ color: 'var(--text-dark)' }}>{service.name}</span>
              </nav>

              {/* Title */}
              <h1 className="text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-dark)' }}>
                {service.name}{locationParam && ` in ${locationParam}`}
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--text-medium)' }}>
                Professional interior design services
              </p>
              
              {/* Service Meta Tags */}
              <div className="flex flex-wrap gap-3">
                {service.serviceType && (
                  <span className="px-4 py-2 text-sm font-medium border" style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-medium)'
                  }}>
                    {service.serviceType}
                  </span>
                )}
                {service.priceRange && (
                  <span className="px-4 py-2 text-sm font-medium border" style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-medium)'
                  }}>
                    Free consultation
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="content-container" style={{ padding: '2rem 0 4rem' }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column - Main Content */}
          <div>
            {/* Description Section with Markdown Formatting */}
            {service.description && (
              <section style={{ marginBottom: '3rem' }}>
                <div style={{ 
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border)`,
                  borderRadius: '0.5rem',
                  padding: '2rem'
                }}>
                  <div style={{ 
                    color: 'var(--text-light)',
                    lineHeight: '1.8'
                  }}>
                    {formatDescription(service.description)}
                  </div>
                </div>
              </section>
            )}

            {/* Offers/Packages Section */}
            {service.offers && service.offers.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: 'var(--text-dark)',
                  marginBottom: '1.5rem'
                }}>
                  Packages
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  {service.offers.map((offer, index) => (
                    <div 
                      key={index}
                      style={{
                        backgroundColor: 'var(--surface)',
                        border: `1px solid var(--border)`,
                        borderRadius: '0.375rem',
                        padding: '1.5rem'
                      }}
                    >
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: 'var(--text-dark)',
                        marginBottom: '0.5rem'
                      }}>
                        {offer.name}
                      </h3>
                      <div style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        color: 'var(--primary)',
                        marginBottom: '0.75rem'
                      }}>
                        {offer.price}
                      </div>
                      <p style={{
                        color: 'var(--text-light)',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}>
                        {offer.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            {service.reviews && service.reviews.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: 'var(--text-dark)',
                  marginBottom: '1.5rem'
                }}>
                  Reviews
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gap: '0.75rem'
                }}>
                  {service.reviews.slice(0, 3).map((review, index) => (
                    <div 
                      key={index}
                      style={{
                        backgroundColor: 'var(--surface)',
                        border: `1px solid var(--border)`,
                        borderRadius: '0.375rem',
                        padding: '1rem'
                      }}
                    >
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-dark)',
                        marginBottom: '0.5rem'
                      }}>
                        {review.author}
                      </div>
                      <div style={{
                        color: '#fbbf24',
                        fontSize: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        {'⭐'.repeat(parseInt(review.ratingValue) || 5)}
                      </div>
                      <p style={{
                        color: 'var(--text-light)',
                        fontSize: '0.75rem',
                        fontStyle: 'italic'
                      }}>
                        "{review.reviewBody}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {service.faqs && service.faqs.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: 'var(--text-dark)',
                  marginBottom: '1.5rem'
                }}>
                  Questions
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gap: '0.5rem'
                }}>
                  {service.faqs.slice(0, 4).map((faq, index) => (
                    <details 
                      key={index}
                      style={{
                        backgroundColor: 'var(--surface)',
                        border: `1px solid var(--border)`,
                        borderRadius: '0.375rem',
                        padding: '1rem'
                      }}
                    >
                      <summary style={{ 
                        fontWeight: '500',
                        cursor: 'pointer',
                        color: 'var(--text-dark)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        listStyle: 'none',
                        margin: 0
                      }}>
                        {faq.question}
                      </summary>
                      <p style={{
                        color: 'var(--text-light)',
                        fontSize: '0.75rem',
                        lineHeight: '1.5',
                        marginTop: '0.5rem',
                        marginBottom: 0
                      }}>
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Service Keywords */}
            {service.keywords && service.keywords.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: 'var(--text-dark)',
                  marginBottom: '1rem'
                }}>
                  Tags
                </h2>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem'
                }}>
                  {service.keywords.slice(0, 8).map((keyword, index) => (
                    <span 
                      key={index}
                      style={{
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-medium)',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.625rem',
                        fontWeight: '400',
                        borderRadius: '0.25rem',
                        border: `1px solid var(--border)`
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sticky Contact Form */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              backgroundColor: 'var(--surface)',
              border: `1px solid var(--border)`,
              borderRadius: '0.5rem',
              padding: '2rem'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--text-dark)',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Get Quote
              </h3>
              <ContactForm service={service.name} context={`Book ${service.name}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
