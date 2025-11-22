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
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-dark)',
          marginTop: '1.5rem',
          marginBottom: '0.75rem'
        }}>
          {trimmedLine.replace('### ', '')}
        </h3>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-dark)',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          {trimmedLine.replace('## ', '')}
        </h2>
      );
    } else if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-dark)',
          marginTop: '2rem',
          marginBottom: '1rem'
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
          fontSize: '0.875rem',
          lineHeight: '1.6',
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
        <p key={index} 
           style={{
             color: 'var(--text-light)',
             fontSize: '0.875rem',
             lineHeight: '1.6',
             marginBottom: '1rem'
           }}
           dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={index} style={{
          color: 'var(--text-light)',
          fontSize: '0.875rem',
          lineHeight: '1.6',
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
          <div className="relative w-full h-64 md:h-80 lg:h-96 xl:h-[500px] overflow-hidden">
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
                <nav className="flex items-center gap-2 text-sm mb-4 md:mb-6 text-white/90">
                  <Link href="/" className="hover:underline">Home</Link>
                  <span>/</span>
                  <Link href="/services" className="hover:underline">Services</Link>
                  <span>/</span>
                  <span className="text-white font-medium">{service.name}</span>
                </nav>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight text-white">
                  {service.name}{locationParam && ` in ${locationParam}`}
                </h1>
                <p className="text-lg md:text-xl mb-4 md:mb-6 text-white/90">
                  Professional interior design services
                </p>

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {service.serviceType && (
                    <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-white/95 text-gray-900 backdrop-blur-sm rounded-full">
                      {service.serviceType}
                    </span>
                  )}
                  {service.priceRange && (
                    <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-white/95 text-gray-900 backdrop-blur-sm rounded-full">
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
            <div className="content-container py-8 md:py-16">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-4 md:mb-8" style={{ color: 'var(--text-light)' }}>
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:underline">Services</Link>
                <span>/</span>
                <span style={{ color: 'var(--text-dark)' }}>{service.name}</span>
              </nav>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight" style={{ color: 'var(--text-dark)' }}>
                {service.name}{locationParam && ` in ${locationParam}`}
              </h1>
              <p className="text-lg md:text-xl mb-4 md:mb-6" style={{ color: 'var(--text-medium)' }}>
                Professional interior design services
              </p>
              
              {/* Service Meta Tags */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {service.serviceType && (
                  <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border rounded-full" style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-medium)'
                  }}>
                    {service.serviceType}
                  </span>
                )}
                {service.priceRange && (
                  <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border rounded-full" style={{
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

      {/* Main Content */}
      <div className="content-container py-6 md:py-8 lg:py-12">
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem md:2rem',
          alignItems: 'start'
        }}>
          
          {/* Mobile: Stack layout - main content first, then contact form */}
          <div className="lg:hidden">
            {/* Main Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Description Section */}
              {service.description && (
                <div style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border)`,
                  borderRadius: '0.5rem',
                  padding: '1.5rem md:2rem'
                }}>
                  <div style={{ 
                    color: 'var(--text-light)',
                    lineHeight: '1.6'
                  }}>
                    {formatDescription(service.description)}
                  </div>
                </div>
              )}

              {/* Packages Section */}
              {service.offers && service.offers.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem md:text-xl',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    marginBottom: '1rem md:1.5rem'
                  }}>
                    Packages
                  </h2>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem md:1.5rem'
                  }}>
                    {service.offers.map((offer, index) => (
                      <div 
                        key={index}
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderRadius: '0.5rem',
                          padding: '1.5rem md:2rem'
                        }}
                      >
                        <h3 style={{
                          fontSize: '1rem md:text-lg',
                          fontWeight: '500',
                          color: 'var(--text-dark)',
                          marginBottom: '0.5rem'
                        }}>
                          {offer.name}
                        </h3>
                        <div style={{
                          fontSize: '1.125rem md:text-xl',
                          fontWeight: '600',
                          color: 'var(--primary)',
                          marginBottom: '0.75rem'
                        }}>
                          {offer.price}
                        </div>
                        <p style={{
                          color: 'var(--text-light)',
                          fontSize: '0.875rem md:text-base',
                          lineHeight: '1.5'
                        }}>
                          {offer.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {service.reviews && service.reviews.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 style={{
                      fontSize: '1.25rem md:text-xl',
                      fontWeight: '600',
                      color: 'var(--text-dark)',
                      margin: 0
                    }}>
                      Customer Reviews
                    </h2>
                    <div className="flex items-center gap-2">
                      <div style={{
                        color: '#fbbf24',
                        fontSize: '1rem'
                      }}>
                        ⭐⭐⭐⭐⭐
                      </div>
                      <span style={{
                        color: 'var(--text-medium)',
                        fontSize: '0.875rem md:text-base',
                        fontWeight: '500'
                      }}>
                        4.9 (524 reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '1rem md:1.5rem'
                  }}>
                    {service.reviews.slice(0, 3).map((review, index) => (
                      <div 
                        key={index}
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderRadius: '0.75rem',
                          padding: '1.25rem md:1.5rem',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        className="hover:shadow-lg hover:scale-[1.02]"
                      >
                        {/* Quote icon */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '15px',
                          color: 'var(--primary)',
                          opacity: 0.1,
                          fontSize: '3rem',
                          lineHeight: 1
                        }}>
                          "
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1rem'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '0.875rem md:text-base',
                              fontWeight: '600',
                              color: 'var(--text-dark)',
                              marginBottom: '0.25rem'
                            }}>
                              {review.author}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-light)'
                            }}>
                              Verified Customer
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span 
                                key={i}
                                style={{
                                  color: i < (parseInt(review.ratingValue) || 5) ? '#fbbf24' : '#e5e7eb',
                                  fontSize: '0.875rem'
                                }}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <p style={{
                          color: 'var(--text-medium)',
                          fontSize: '0.875rem md:text-base',
                          lineHeight: '1.6',
                          fontStyle: 'italic',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          "{review.reviewBody}"
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Overall Rating Summary */}
                  <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 style={{
                          fontSize: '1rem md:text-lg',
                          fontWeight: '600',
                          color: 'var(--text-dark)',
                          marginBottom: '0.5rem'
                        }}>
                          Overall Rating
                        </h3>
                        <p style={{
                          color: 'var(--text-medium)',
                          fontSize: '0.875rem md:text-base'
                        }}>
                          Based on {service.reviews.length} customer reviews
                        </p>
                      </div>
                      <div className="text-right">
                        <div style={{
                          fontSize: '2rem md:text-3xl',
                          fontWeight: '700',
                          color: 'var(--primary)'
                        }}>
                          4.9
                        </div>
                        <div style={{
                          color: '#fbbf24',
                          fontSize: '1rem'
                        }}>
                          ⭐⭐⭐⭐⭐
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {service.faqs && service.faqs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 style={{
                      fontSize: '1.25rem md:text-xl',
                      fontWeight: '600',
                      color: 'var(--text-dark)',
                      margin: 0
                    }}>
                      Frequently Asked Questions
                    </h2>
                    <span style={{
                      color: 'var(--text-medium)',
                      fontSize: '0.875rem md:text-base',
                      backgroundColor: 'var(--surface)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      border: `1px solid var(--border)`
                    }}>
                      {service.faqs.length} questions
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '1rem'
                  }}>
                    {service.faqs.slice(0, 4).map((faq, index) => (
                      <details 
                        key={index}
                        className="group"
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <summary 
                          style={{ 
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: 'var(--text-dark)',
                            fontSize: '0.875rem md:text-base',
                            outline: 'none',
                            listStyle: 'none',
                            margin: 0,
                            padding: '1.25rem md:1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s ease'
                          }}
                          className="hover:bg-gray-50"
                        >
                          <span>{faq.question}</span>
                          <div 
                            className="transition-transform duration-300 group-open:rotate-180"
                            style={{
                              color: 'var(--primary)',
                              fontSize: '1.25rem',
                              flexShrink: 0,
                              marginLeft: '1rem'
                            }}
                          >
                            ↓
                          </div>
                        </summary>
                        <div 
                          style={{
                            padding: '0 1.25rem 1.25rem 1.25rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <p style={{
                            color: 'var(--text-medium)',
                            fontSize: '0.875rem md:text-base',
                            lineHeight: '1.6',
                            borderTop: `1px solid var(--border)`,
                            paddingTop: '1rem'
                          }}>
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                  
                  {/* Help Section */}
                  <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <span style={{ color: 'white', fontSize: '1.25rem' }}>💬</span>
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1rem md:text-lg',
                          fontWeight: '600',
                          color: 'var(--text-dark)',
                          marginBottom: '0.5rem'
                        }}>
                          Still have questions?
                        </h3>
                        <p style={{
                          color: 'var(--text-medium)',
                          fontSize: '0.875rem md:text-base',
                          marginBottom: '1rem'
                        }}>
                          Our team is here to help you with any questions about our {service.name} services.
                        </p>
                        <a 
                          href="/contact"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Contact Us
                          <span style={{ fontSize: '0.875rem' }}>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {service.keywords && service.keywords.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem md:text-xl',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    marginBottom: '1rem md:1.5rem'
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
                          fontSize: '0.625rem md:text-sm',
                          fontWeight: '400',
                          borderRadius: '0.25rem',
                          border: `1px solid var(--border)`
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div style={{
              backgroundColor: 'var(--surface)',
              border: `1px solid var(--border)`,
              borderRadius: '0.5rem',
              padding: '1.5rem md:2rem',
              marginTop: '2rem'
            }}>
              <h3 style={{
                fontSize: '1rem md:text-lg',
                fontWeight: '500',
                color: 'var(--text-dark)',
                marginBottom: '1rem md:1.5rem',
                textAlign: 'center'
              }}>
                Get Quote
              </h3>
              <ContactForm service={service.name} context={`Book ${service.name}`} />
            </div>
          </div>

          {/* Desktop: Sidebar layout */}
          <div className="hidden lg:grid" style={{ 
            gridTemplateColumns: '1fr 350px',
            gap: '2rem'
          }}>
            {/* Left Column - Main Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Same content sections as above */}
              {service.description && (
                <div style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border)`,
                  borderRadius: '0.5rem',
                  padding: '2rem'
                }}>
                  <div style={{ 
                    color: 'var(--text-light)',
                    lineHeight: '1.6'
                  }}>
                    {formatDescription(service.description)}
                  </div>
                </div>
              )}

              {/* Other sections similar to mobile but with desktop styling */}
              {service.offers && service.offers.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    marginBottom: '1.5rem'
                  }}>
                    Packages
                  </h2>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {service.offers.map((offer, index) => (
                      <div 
                        key={index}
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderRadius: '0.5rem',
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
                          fontWeight: '600',
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
                </div>
              )}

              {/* Reviews, FAQ, Tags sections with desktop styling */}
              {service.reviews && service.reviews.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    marginBottom: '1.5rem'
                  }}>
                    Reviews
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gap: '1rem'
                  }}>
                    {service.reviews.slice(0, 3).map((review, index) => (
                      <div 
                        key={index}
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderRadius: '0.5rem',
                          padding: '1.5rem'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--text-dark)'
                          }}>
                            {review.author}
                          </div>
                          <div style={{
                            color: '#fbbf24',
                            fontSize: '0.75rem'
                          }}>
                            {'⭐'.repeat(parseInt(review.ratingValue) || 5)}
                          </div>
                        </div>
                        <p style={{
                          color: 'var(--text-light)',
                          fontSize: '0.875rem',
                          fontStyle: 'italic'
                        }}>
                          "{review.reviewBody}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.faqs && service.faqs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-dark)',
                      margin: 0
                    }}>
                      Frequently Asked Questions
                    </h2>
                    <span style={{
                      color: 'var(--text-medium)',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--surface)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      border: `1px solid var(--border)`
                    }}>
                      {service.faqs.length} questions
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '1rem'
                  }}>
                    {service.faqs.slice(0, 4).map((faq, index) => (
                      <details 
                        key={index}
                        className="group"
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <summary 
                          style={{ 
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: 'var(--text-dark)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            listStyle: 'none',
                            margin: 0,
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s ease'
                          }}
                          className="hover:bg-gray-50"
                        >
                          <span>{faq.question}</span>
                          <div 
                            className="transition-transform duration-300 group-open:rotate-180"
                            style={{
                              color: 'var(--primary)',
                              fontSize: '1.25rem',
                              flexShrink: 0,
                              marginLeft: '1rem'
                            }}
                          >
                            ↓
                          </div>
                        </summary>
                        <div 
                          style={{
                            padding: '0 1.5rem 1.5rem 1.5rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <p style={{
                            color: 'var(--text-medium)',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            borderTop: `1px solid var(--border)`,
                            paddingTop: '1rem'
                          }}>
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                  
                  {/* Help Section */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <span style={{ color: 'white', fontSize: '1.5rem' }}>💬</span>
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: 'var(--text-dark)',
                          marginBottom: '0.5rem'
                        }}>
                          Still have questions?
                        </h3>
                        <p style={{
                          color: 'var(--text-medium)',
                          fontSize: '0.875rem',
                          marginBottom: '1rem'
                        }}>
                          Our team is here to help you with any questions about our {service.name} services.
                        </p>
                        <a 
                          href="/contact"
                          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Contact Us
                          <span style={{ fontSize: '0.875rem' }}>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {service.keywords && service.keywords.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
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
                </div>
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
    </div>
  );
}
