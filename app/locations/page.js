import Link from 'next/link';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateMetadata() {
  const url = 'https://www.guptafurniturenashik.in/locations';
  const title = 'Service Areas in Nashik | Gupta Furniture & Interior';
  const description = 'We serve all major areas in Nashik including Nashik Road, Gangapur Road, Indira Nagar, and more. Professional furniture and interior design services across Nashik.';
  
  return {
    title,
    description,
    keywords: ['furniture services nashik', 'interior design nashik', 'service areas nashik', 'furniture near me', 'home interior nashik'],
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
          url: '/hero.png',
          width: 1200,
          height: 630,
          alt: 'Gupta Furniture Service Areas in Nashik',
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/hero.png'],
    },
  };
}

export default async function LocationsPage() {
  await dbConnect();
  const locations = await Location.find({}).sort({ name: 1 }).lean();

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gupta Furniture & Interior",
    "url": "https://www.guptafurniturenashik.in",
    "logo": "https://www.guptafurniturenashik.in/logo.png",
    "description": "Professional furniture and interior design services across Nashik",
    "telephone": "+91 9511641912",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nashik",
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
          "@id": "https://www.guptafurniturenashik.in/locations",
          "name": "Service Areas"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' }
      ]} />
      
      {/* Hero Section */}
      <section className="py-24 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
              Our Service Areas in Nashik
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide professional doorstep furniture and interior design services across all major areas in Nashik. Find your location below to explore our services.
            </p>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <Link 
                key={loc._id.toString()} 
                href={`/locations/${loc.slug}`} 
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{loc.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Serving {loc.sublocations.length} sub-areas
                  </p>
                </div>
                
                {loc.sublocations && loc.sublocations.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-2">Including:</p>
                    <div className="flex flex-wrap gap-2">
                      {loc.sublocations.slice(0, 3).map((sub, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {sub}
                        </span>
                      ))}
                      {loc.sublocations.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{loc.sublocations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--primary)' }}>
                  <span>View Services in {loc.name}</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Can't Find Your Area?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're expanding our services across Nashik. Contact us to check if we serve your area.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
