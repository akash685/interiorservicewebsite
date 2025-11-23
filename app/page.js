import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import HeroContactForm from '@/components/HeroContactForm';
import InteriorPackages from '@/components/InteriorPackages';
import GoogleReviews from '@/components/GoogleReviews';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Settings from '@/models/Settings';
import { reviews } from '@/data/reviews';
import { homeFAQs } from '@/data/faqs';
import { generateReviewSchema, calculateAggregateRating } from '@/lib/reviews-utils';

export const metadata = {
  title: 'Gupta Furniture & Interior Design | Premium Furniture Services in Nashik',
  description: 'Transform your home with expert interior design and furniture services in Nashik. Modular kitchens, custom furniture, sofa cleaning, and complete home interiors. Quality craftsmanship, affordable prices.',
  alternates: {
    canonical: 'https://www.guptafurniturenashik.in',
  },
};

export default async function Home() {
  // Fetch services and settings from database
  await dbConnect();
  const [allServices, settings] = await Promise.all([
    Service.find({}).limit(6).lean(),
    Settings.getSiteSettings()
  ]);
  const featuredServices = allServices;

  // Get reviews for Nashik location (main location)
  const nashikReviews = reviews["Nashik"] || [];
  const aggregateData = calculateAggregateRating(nashikReviews);

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.guptafurniturenashik.in/#organization",
    "name": settings.siteName || "Gupta Furniture & Interior",
    "alternateName": settings.siteName || "Gupta Furniture",
    "url": "https://www.guptafurniturenashik.in",
    "logo": settings.logo || "https://www.guptafurniturenashik.in/logo.png",
    "image": settings.seo?.ogDefaultImage || "https://www.guptafurniturenashik.in/hero.png",
    "description": settings.seo?.defaultMetaDescription || "Professional furniture services in Nashik. Sofa cleaning, modular kitchen, interior design, furniture repair, and more. Expert craftsmanship, affordable prices.",
    "telephone": settings.businessPhone || "+91 9876543210",
    "email": settings.businessEmail || "info@guptafurniture.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.businessAddress || "Shop No. 5, Main Market, Nashik Road",
      "addressLocality": "Nashik",
      "addressRegion": "Maharashtra",
      "postalCode": "422101",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.9975",
      "longitude": "73.7898"
    },
    "areaServed": {
      "@type": "City",
      "name": "Nashik"
    },
    "openingHours": settings.business?.workingDays || "Mo-Su",
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
    "review": nashikReviews.map(review => ({
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
    localBusinessSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateData.ratingValue,
      "ratingCount": aggregateData.ratingCount,
      "bestRating": aggregateData.bestRating,
      "worstRating": aggregateData.worstRating
    };
  }

  // FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homeFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.siteName || "Gupta Furniture & Interior",
    "url": "https://www.guptafurniturenashik.in",
    "logo": settings.logo || "https://www.guptafurniturenashik.in/logo.png",
    "image": settings.seo?.ogDefaultImage || "https://www.guptafurniturenashik.in/hero.png",
    "description": settings.seo?.defaultMetaDescription || "Professional furniture services in Nashik",
    "telephone": settings.businessPhone || "+91-9511641912",
    "email": settings.businessEmail || "hello@guptafurniture.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.businessAddress || "Nashik",
      "addressLocality": "Nashik",
      "addressRegion": "Maharashtra",
      "postalCode": "422001",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.businessPhone || "+91-9511641912",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      settings.socialMedia?.facebook,
      settings.socialMedia?.instagram,
      settings.socialMedia?.twitter,
      settings.socialMedia?.linkedin
    ].filter(Boolean)
  };

  // AggregateRating Schema
  let aggregateRatingSchema = null;
  if (aggregateData) {
    aggregateRatingSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": settings.siteName || "Gupta Furniture & Interior",
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
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.guptafurniturenashik.in",
    "name": settings.siteName || "Gupta Furniture & Interior",
    "description": settings.seo?.defaultMetaDescription || "Professional furniture services in Nashik",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      
      {/* FAQPage Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      
      {/* AggregateRating Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }} />
      
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      
      {/* Breadcrumb Schema */}
      <Breadcrumb items={[{ name: 'Home', url: '/' }]} />
      
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
                Design Your Dream Home
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Create stunning spaces that reflect your unique style with our expert furniture & interior design services in Nashik.
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
                  Get expert advice for your home
                </p>
                <HeroContactForm context="Hero Inquiry" />
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Design Your Dream Home
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
      <section className="bg-white py-12 lg:hidden">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white border border-gray-200 p-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary)' }}>
              Get Free Quote
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Share your details for expert advice
            </p>
            <HeroContactForm context="Hero Inquiry Mobile" />
          </div>
        </div>
      </section>

      {/* Interior Packages */}
      <InteriorPackages />

      {/* Services Preview */}
      <section className="py-12 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">Our Expertise</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              From concept to completion, we bring your vision to life
            </p>
            <Link href="/services" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 font-medium hover:border-gray-400 transition-colors">
              View All Services →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="p-4 lg:p-6">
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  {/* Call to Action */}
                  <Link 
                    href={`/services/${service.slug}`}
                    className="block text-center py-2 lg:py-3 px-4 lg:px-6 text-sm lg:text-base text-white font-medium hover:opacity-90 transition-colors"
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
      <GoogleReviews location="Nashik" />

      {/* CTA / Contact Section */}
      <section id="contact" className="py-12 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 lg:mb-6">
                Let's Create Something Amazing
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                Ready to transform your space? Get in touch for personalized design solutions.
              </p>
              <ul className="space-y-3 lg:space-y-4 text-base lg:text-lg text-gray-700">
                <li><strong className="font-semibold">Call:</strong> +91 9511641912</li>
                <li><strong className="font-semibold">Email:</strong> hello@guptafurniture.com</li>
               <li><strong className="font-semibold">Visit:</strong> Nashik's Premier Design Studio</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 lg:p-8 border border-gray-200">
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">Start Your Project</h3>
              <ContactForm context="Home Page Inquiry" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={homeFAQs} />

      {/* Final CTA Banner */}
      <section className="py-12 lg:py-24 text-white text-center" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-5 text-white">Ready to Design Your Dream Space in Nashik?</h2>
          <p className="text-base lg:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto text-white/95 leading-relaxed">Get expert interior design consultation and exclusive packages. Limited time offer: Save 15% on complete home makeovers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/#contact" className="inline-block bg-white px-6 lg:px-9 py-3 lg:py-4 text-base lg:text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg" style={{ color: 'var(--primary)' }}>
              Get Free Consultation
            </Link>
            <a href="tel:+919511641912" className="inline-block border-2 border-white text-white px-6 lg:px-9 py-3 lg:py-4 text-base lg:text-lg font-semibold hover:bg-white/20 transition-colors">
              Call Now: +91 95116 41912
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
