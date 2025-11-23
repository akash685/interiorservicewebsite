import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Location from '@/models/Location';
import Image from 'next/image';
import { calculateAggregateRating, generateServiceSchemaWithReviews } from '@/lib/reviews-utils';
import { reviews } from '@/data/reviews';

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

  // Get reviews for Nashik (main location) to calculate aggregate rating
  const nashikReviews = reviews["Nashik"] || [];
  const aggregateData = calculateAggregateRating(nashikReviews);

  // Service Schema
  const serviceSchema = generateServiceSchemaWithReviews(service, nashikReviews);

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
    <div className="min-h-screen bg-gray-50">
      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* FAQ Schema (if exists) */}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchemaService) }} />
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchemaService) }} />
      
      {/* Hero Section */}
      <section className="relative">
        {service.image && (
          <div className="relative h-64 md:h-80 lg:h-96 xl:h-[500px] overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-6xl mx-auto px-6 w-full">
                <nav className="flex items-center gap-2 text-sm mb-4 text-white/90">
                  <Link href="/" className="hover:underline">Home</Link>
                  <span>/</span>
                  <Link href="/services" className="hover:underline">Services</Link>
                  <span>/</span>
                  <span className="text-white font-medium">{service.name}</span>
                </nav>

                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight text-white">
                  {service.name}{locationParam && ` in ${locationParam}`}
                </h1>
                <p className="text-lg md:text-xl mb-4 md:mb-6 text-white/90">
                  Professional interior design services
                </p>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  {service.serviceType && (
                    <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20">
                      {service.serviceType}
                    </span>
                  )}
                  <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20">
                    Free consultation
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {service.description && (
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <div className="prose prose-gray max-w-none">
                  {service.description.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;
                    
                    if (trimmedLine.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">{trimmedLine.replace('### ', '')}</h3>;
                    } else if (trimmedLine.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-8 mb-4">{trimmedLine.replace('## ', '')}</h2>;
                    } else if (trimmedLine.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{trimmedLine.replace('# ', '')}</h1>;
                    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                      return <li key={index} className="text-gray-600 text-sm mb-1 ml-4">{trimmedLine.replace(/^[*-]\s/, '')}</li>;
                    } else if (trimmedLine.includes('**')) {
                      return <p key={index} className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ 
                        __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                      }} />;
                    } else {
                      return <p key={index} className="text-gray-600 text-sm mb-4 leading-relaxed">{trimmedLine}</p>;
                    }
                  })}
                </div>
              </div>
            )}

            {/* Packages */}
            {service.offers && service.offers.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Packages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.offers.map((offer, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {offer.name}
                      </h3>
                      <div className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {offer.price}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {offer.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {service.faqs && service.faqs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {service.faqs.slice(0, 4).map((faq, index) => (
                    <details 
                      key={index}
                      className="bg-white border border-gray-200  overflow-hidden group"
                    >
                      <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <span>{faq.question}</span>
                        <span 
                          className="text-lg transition-transform"
                          style={{ color: 'var(--gray-800)' }}
                        >↓</span>
                      </summary>
                      <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
                
                {/* Help Section */}
                <div className="mt-8 p-6 rounded-xl border" style={{ 
                  background: `linear-gradient(135deg, var(--primary-light) 0%, rgba(219, 39, 119, 0.1) 100%)`,
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <span className="text-white text-xl">💬</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Still have questions?
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        Our team is here to help you with any questions about our {service.name} services.
                      </p>
                      <a 
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg hover:-translate-y-0.5 transition-all duration-200"
                        style={{ 
                          backgroundColor: 'var(--primary)',
                          transition: 'all 0.2s ease'
                        }}

                      >
                        Contact Us
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {service.keywords && service.keywords.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.keywords.slice(0, 8).map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
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
