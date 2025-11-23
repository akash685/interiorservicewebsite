import { notFound } from 'next/navigation';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import HeroContactForm from '@/components/HeroContactForm';
import InteriorPackages from '@/components/InteriorPackages';
import GoogleReviews from '@/components/GoogleReviews';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import Service from '@/models/Service';
import Settings from '@/models/Settings';
import { reviews } from '@/data/reviews';
import { getLocationFAQs } from '@/data/faqs';
import { calculateAggregateRating } from '@/lib/reviews-utils';

export async function generateMetadata({ params }) {
  const { location: locationSlug } = await params;
  await dbConnect();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  if (!location) return { title: 'Interior Design Services' };
  
  return {
    title: `Interior Design & Furniture Services in ${location.name} | Gupta Furniture`,
    description: `Professional furniture & interior design services in ${location.name}. Sofa cleaning, modular kitchen, interior design, furniture repair, and more. Expert craftsmanship, affordable prices.`,
    alternates: {
      canonical: `https://www.guptafurniturenashik.in/landingpage/${location.slug}`,
    },
  };
}

export default async function LandingPage({ params }) {
  const { location: locationSlug } = await params;
  await dbConnect();
  
  const [location, allServices, settings] = await Promise.all([
    Location.findOne({ slug: locationSlug }).lean(),
    Service.find({}).limit(6).lean(),
    Settings.getSiteSettings()
  ]);
  
  if (!location) {
    notFound();
  }

  const featuredServices = allServices;

  // Get reviews for this location (fallback to Nashik if not found)
  const locationReviews = reviews[location.name] || reviews["Nashik"] || [];
  const aggregateData = calculateAggregateRating(locationReviews);

  // Organization Schema for this location
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://www.guptafurniturenashik.in/landingpage/${location.slug}#organization`,
    "name": `${settings.siteName || "Gupta Furniture & Interior"} - ${location.name}`,
    "alternateName": settings.siteName || "Gupta Furniture",
    "url": `https://www.guptafurniturenashik.in/landingpage/${location.slug}`,
    "logo": settings.logo || "https://www.guptafurniturenashik.in/logo.png",
    "image": settings.seo?.ogDefaultImage || "https://www.guptafurniturenashik.in/hero.png",
    "description": `Professional furniture services in ${location.name}. Sofa cleaning, modular kitchen, interior design, furniture repair, and more. Expert craftsmanship, affordable prices.`,
    "telephone": settings.businessPhone || "+91 9876543210",
    "email": settings.businessEmail || "info@guptafurniture.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": location.name
    },
    "priceRange": "₹₹",
    "sameAs": [
      settings.socialMedia?.facebook,
      settings.socialMedia?.instagram,
      settings.socialMedia?.twitter
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Furniture Services",
      "itemListElement": featuredServices.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description
        }
      }))
    },
    "review": locationReviews.map(review => ({
      "@type": "Review",
      "datePublished": review.datePublished,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewBody": review.text
    }))
  };

  if (aggregateData) {
    organizationSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateData.ratingValue,
      "ratingCount": aggregateData.ratingCount,
      "bestRating": aggregateData.bestRating,
      "worstRating": aggregateData.worstRating
    };
  }

  // Generate location-specific FAQs
  const locationFAQs = getLocationFAQs(location.name);

  // FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locationFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Organization Schema (separate from LocalBusiness)
  const organizationSchemaLanding = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gupta Furniture & Interior",
    "url": "https://www.guptafurniturenashik.in",
    "logo": "https://www.guptafurniturenashik.in/logo.png",
    "description": `Professional furniture and interior design services in ${location.name}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": location.name
    }
  };

  // AggregateRating Schema
  let aggregateRatingSchemaLanding = null;
  if (aggregateData) {
    aggregateRatingSchemaLanding = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Gupta Furniture & Interior",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateData.ratingValue,
        "ratingCount": aggregateData.ratingCount,
        "bestRating": aggregateData.bestRating,
        "worstRating": aggregateData.worstRating
      }
    };
  }

  // WebSite SearchAction Schema
  const websiteSchemaLanding = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.guptafurniturenashik.in",
    "name": "Gupta Furniture & Interior",
    "description": `Furniture and interior design services in ${location.name}`,
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
    <div>
      {/* LocalBusiness Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      
      {/* FAQPage Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchemaLanding) }} />
      
      {/* AggregateRating Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchemaLanding) }} />
      
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchemaLanding) }} />
      
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: location.name, url: `/landingpage/${location.slug}` }
      ]} />
      
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center relative"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/dmrxpcalh/image/upload/v1763828170/hero_mldrie.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-6xl font-semibold text-white mb-6 leading-tight">
                Design Your Dream Home in {location.name}
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Create stunning spaces that reflect your unique style with our expert furniture & interior design services in {location.name}.
              </p>
              <div className="flex gap-4">
                <Link href="/services" className="text-white px-8 py-3 font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: 'var(--primary)' }}>
                  Explore Services
                </Link>
                <Link href="#contact" className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white/10 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            
            {/* Standard Form */}
            <div>
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                  Get Free Quote
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Get expert advice for your home in {location.name}
                </p>
                <HeroContactForm context={`${location.name} Landing Page`} location={location.name} />
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Design Your Dream Home in {location.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10">
              Create stunning spaces that reflect your unique style with our expert furniture & interior design services.
            </p>
            <div className="flex gap-5 justify-center flex-wrap">
              <Link href="/services" className="text-white px-8 py-3 font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: 'var(--primary)' }}>
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Form Section */}
      <section className="bg-white py-16 lg:hidden">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white border border-gray-200 p-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary)' }}>
              Get Free Quote
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Share your details for expert advice
            </p>
            <HeroContactForm context={`${location.name} Landing Page Mobile`} location={location.name} />
          </div>
        </div>
      </section>

      {/* Interior Packages */}
      <InteriorPackages />

      {/* Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">Our Expertise in {location.name}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              From concept to completion, we bring your vision to life
            </p>
            <Link href="/services" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 font-medium hover:border-gray-400 transition-colors">
              View All Services →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div key={service._id} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                {/* Service Image */}
                <div className="h-48 bg-gray-50 flex items-center justify-center relative">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl" style={{ color: 'var(--primary)' }}>
                      {service.icon}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-base text-gray-600 mb-6 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  {/* Call to Action */}
                  <Link 
                    href={`/services/${service.slug}`}
                    className="block text-center py-3 px-6 text-white font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews location={location.name} />

      {/* CTA / Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                Let's Create Something Amazing in {location.name}
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ready to transform your space? Get in touch for personalized design solutions.
              </p>
              <ul className="space-y-4 text-lg text-gray-700">
                <li><strong className="font-semibold">Call:</strong> {settings.businessPhone || '+91 9511641912'}</li>
                <li><strong className="font-semibold">Email:</strong> {settings.businessEmail || 'hello@guptafurniture.com'}</li>
                <li><strong className="font-semibold">Location:</strong> Serving {location.name}</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Start Your Project</h3>
              <ContactForm context={`${location.name} Landing Page Contact`} location={location.name} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection 
        faqs={locationFAQs} 
        title={`Frequently Asked Questions - ${location.name}`}
      />

      {/* Final CTA Banner */}
      <section className="py-24 text-white text-center" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-semibold mb-5 text-white">Ready to Design Your Dream Space in {location.name}?</h2>
          <p className="text-xl mb-8 text-white">Special launch offer: Get 15% off premium interior design packages this month.</p>
          <Link href="/#contact" className="inline-block bg-white px-9 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors" style={{ color: 'var(--primary)' }}>
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}
