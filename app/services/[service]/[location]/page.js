import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Location from '@/models/Location';
import { calculateAggregateRating } from '@/lib/reviews-utils';
import { reviews } from '@/data/reviews';

export async function generateMetadata({ params }) {
  const { service: serviceSlug, location: locationSlug } = await params;
  
  await dbConnect();
  const service = await Service.findOne({ slug: serviceSlug }).lean();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  
  if (!service || !location) return { title: 'Service Not Found' };
  
  const locationName = location.name;
  const url = `https://www.guptafurniturenashik.in/services/${service.slug}/${location.slug}`;
  const title = `${service.name} in ${locationName} | Gupta Furniture`;
  const description = `Professional ${service.name} services in ${locationName}. ${service.metaDescription || `Quality furniture and interior solutions by Gupta Furniture.`}`;
  
  return {
    title,
    description,
    keywords: [...(service.keywords || []), locationName, `${service.name} ${locationName}`],
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
          alt: `${service.name} in ${locationName} - Gupta Furniture`,
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
        <h3 key={index} className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-dark)' }}>
          {trimmedLine.replace('### ', '')}
        </h3>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-semibold mt-10 mb-5" style={{ color: 'var(--text-dark)' }}>
          {trimmedLine.replace('## ', '')}
        </h2>
      );
    } else if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-3xl font-bold mt-12 mb-6" style={{ color: 'var(--text-dark)' }}>
          {trimmedLine.replace('# ', '')}
        </h1>
      );
    }
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const content = trimmedLine.replace(/^[*-]\s/, '');
      elements.push(
        <li key={index} className="text-base leading-relaxed mb-2" style={{ color: 'var(--text-light)' }}>
          {content}
        </li>
      );
    }
    else if (trimmedLine.includes('***') || trimmedLine.includes('**')) {
      const formatted = trimmedLine
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong style="font-weight: 700; color: var(--text-dark)">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: var(--text-dark)">$1</strong>');
      
      elements.push(
        <p key={index} className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-light)' }} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    else {
      elements.push(
        <p key={index} className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-light)' }}>
          {trimmedLine}
        </p>
      );
    }
  });
  
  return elements;
}

export default async function ServiceLocationPage({ params }) {
  const { service: serviceSlug, location: locationSlug } = await params;
  
  await dbConnect();
  const service = await Service.findOne({ slug: serviceSlug }).lean();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  
  if (!service || !location) {
    notFound();
  }

  const locationName = location.name;

  // Calculate aggregate rating from service reviews or location reviews
  let reviewsForRating = [];
  if (service.reviews && service.reviews.length > 0) {
    // Use service-specific reviews from database
    reviewsForRating = service.reviews.map(review => ({
      rating: parseInt(review.ratingValue) || 5
    }));
  } else {
    // Use location-specific reviews from data file
    reviewsForRating = (reviews[locationName] || reviews["Nashik"] || []).map(review => ({
      rating: review.rating
    }));
  }
  const aggregateData = calculateAggregateRating(reviewsForRating);

  // Service Schema (Product type for Rich Results)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${service.name} in ${locationName}`,
    "description": service.description,
    "brand": {
      "@type": "LocalBusiness",
      "name": "Gupta Furniture & Interior",
      "image": "https://www.guptafurniturenashik.in/logo.png",
      "url": "https://www.guptafurniturenashik.in",
      "telephone": "+91 9511641912",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": locationName,
        "addressLocality": locationName,
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
        "name": locationName
      }
    },
    "image": service.image || "https://www.guptafurniturenashik.in/hero.png",
    "url": `https://www.guptafurniturenashik.in/services/${service.slug}/${location.slug}`
  };

  if (aggregateData) {
    serviceSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateData.ratingValue,
      "ratingCount": aggregateData.ratingCount,
      "bestRating": aggregateData.bestRating,
      "worstRating": aggregateData.worstRating
    };
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://www.guptafurniturenashik.in",
          "name": "Home"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://www.guptafurniturenashik.in/services",
          "name": "Services"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@id": `https://www.guptafurniturenashik.in/services/${service.slug}`,
          "name": service.name
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@id": `https://www.guptafurniturenashik.in/services/${service.slug}/${location.slug}`,
          "name": locationName
        }
      }
    ]
  };

  // FAQ Schema (if FAQs exist)
  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question.replace(/Nashik/gi, locationName),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/Nashik/gi, locationName)
      }
    }))
  } : null;

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      
      {/* Hero Section - Minimalist */}
      <section style={{ position: 'relative' }}>
        {/* Hero Image with Overlay */}
        {service.image && (
          <div className="relative w-full h-[500px] overflow-hidden">
            <Image 
              src={service.image} 
              alt={`${service.name} in ${locationName}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={85}
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
                  <Link href={`/services/${service.slug}`} className="hover:underline">{service.name}</Link>
                  <span>/</span>
                  <span className="text-white font-medium">{locationName}</span>
                </nav>

                {/* Title */}
                <h1 className="text-5xl font-bold mb-4 tracking-tight text-white">
                  {service.name}
                </h1>
                <p className="text-xl mb-6 text-white/90">
                  Professional services in {locationName}
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
                  <span className="px-4 py-2 text-sm font-medium bg-white/95 text-gray-900 backdrop-blur-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {locationName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Fallback when no image */}
        {!service.image && (
          <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <div className="content-container py-16">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-light)' }}>
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:underline">Services</Link>
                <span>/</span>
                <Link href={`/services/${service.slug}`} className="hover:underline">{service.name}</Link>
                <span>/</span>
                <span style={{ color: 'var(--text-dark)' }}>{locationName}</span>
              </nav>

              {/* Title */}
              <h1 className="text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-dark)' }}>
                {service.name}
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--text-medium)' }}>
                Professional services in {locationName}
              </p>

              {/* Meta Tags */}
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
                <span className="px-4 py-2 text-sm font-medium border flex items-center gap-2" style={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-medium)'
                }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {locationName}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="content-container py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          
          {/* Left Column */}
          <div>
            {/* Description */}
            {service.description && (
              <section className="mb-16">
                <div className="prose max-w-none">
                  {formatDescription(service.description)}
                </div>
              </section>
            )}

            {/* Packages */}
            {service.offers && service.offers.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
                  Packages
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.offers.map((offer, index) => (
                    <div 
                      key={index}
                      className="border p-6"
                      style={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                        {offer.name}
                      </h3>
                      <div className="text-2xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                        {offer.price}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
                        {offer.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {service.reviews && service.reviews.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
                  Customer Reviews
                </h2>
                <div className="space-y-4">
                  {service.reviews.slice(0, 3).map((review, index) => (
                    <div 
                      key={index}
                      className="border p-6"
                      style={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-dark)' }}>
                          {review.author}
                        </span>
                        <div className="text-yellow-400">
                          {'★'.repeat(parseInt(review.ratingValue) || 5)}
                        </div>
                      </div>
                      <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-light)' }}>
                        "{review.reviewBody}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {service.faqs.slice(0, 5).map((faq, index) => (
                    <details 
                      key={index}
                      className="border p-6 cursor-pointer"
                      style={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <summary className="font-medium text-sm outline-none" style={{ color: 'var(--text-dark)' }}>
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {service.keywords && service.keywords.length > 0 && (
              <section className="mb-12">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[...service.keywords.slice(0, 6), locationName].map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs border"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-medium)'
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Back Link */}
            <Link 
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              ← View all locations for {service.name}
            </Link>
          </div>

          {/* Right Column - Sticky Contact Form */}
          <div>
            <div className="sticky top-24">
              <div className="border p-8" style={{ 
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}>
                <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--text-dark)' }}>
                  Get a Free Quote
                </h3>
                <ContactForm 
                  service={service.name} 
                  context={`${service.name} in ${locationName}`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
