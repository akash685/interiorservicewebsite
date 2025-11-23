import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import Service from '@/models/Service';
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateMetadata({ params }) {
  const { location: locationSlug } = await params;
  await dbConnect();
  const location = await Location.findOne({ slug: locationSlug }).lean();
  
  if (!location) return { title: 'Location Not Found' };
  
  const url = `https://www.guptafurniturenashik.in/locations/${locationSlug}`;
  const title = `Furniture & Interior Services in ${location.name} | Gupta Furniture`;
  const description = `Best furniture and interior design services in ${location.name}, Nashik. Sofa cleaning, repair, modular kitchen, and complete interior solutions in ${location.name}.`;
  
  return {
    title,
    description,
    keywords: [`furniture ${location.name}`, `interior design ${location.name}`, `sofa cleaning ${location.name}`, `furniture repair ${location.name}`, `modular kitchen ${location.name}`],
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
          alt: `Furniture Services in ${location.name} - Gupta Furniture`,
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

export default async function LocationPage(props) {
  const { location: locationSlug } = await props.params;
  const searchParams = await props.searchParams;
  await dbConnect();
  
  const location = await Location.findOne({ slug: locationSlug }).lean();
  
  if (!location) {
    notFound();
  }

  const page = parseInt(searchParams.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const services = await Service.find({})
    .skip(skip)
    .limit(limit)
    .lean();

  const totalServices = await Service.countDocuments({});
  const totalPages = Math.ceil(totalServices / limit);

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Gupta Furniture & Interior - ${location.name}`,
    "url": `https://www.guptafurniturenashik.in/locations/${locationSlug}`,
    "description": `Professional furniture and interior design services in ${location.name}, Nashik`,
    "telephone": "+91 9511641912",
    "address": {
      "@type": "PostalAddress",
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
    "areaServed": {
      "@type": "City",
      "name": location.name
    },
    "priceRange": "₹₹"
  };

  // Organization Schema
  const organizationSchema = {
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
          "name": "Locations"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@id": `https://www.guptafurniturenashik.in/locations/${locationSlug}`,
          "name": location.name
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LocalBusiness Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {/* WebSite SearchAction Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' },
        { name: location.name, url: `/locations/${location.slug}` }
      ]} />
      
      {/* Hero Section */}
      <section className="py-20 md:py-24 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
              Services in {location.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trusted furniture and interior design experts serving {location.name}. Professional doorstep services for all your home needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link 
                key={service._id.toString()} 
                href={`/locations/${location.slug}/${service.slug}`}
                className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                {service.image && (
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image 
                      src={service.image} 
                      alt={service.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                {!service.image && (
                  <div className="h-48 w-full flex items-center justify-center bg-gray-100 text-5xl">
                    <span style={{ color: 'var(--primary)' }}>{service.icon}</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {service.description?.substring(0, 100)}...
                  </p>
                  <div className="inline-flex items-center gap-2 font-medium" style={{ color: 'var(--primary)' }}>
                    <span>View Service</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            baseUrl={`/locations/${location.slug}`} 
            searchParams={searchParams}
          />
        </div>
      </section>

      {/* Sublocations Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center">
            Areas We Serve in {location.name}
          </h2>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {location.sublocations.map((sub) => (
              <span 
                key={sub} 
                className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get a free consultation for your furniture and interior design needs in {location.name}.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
