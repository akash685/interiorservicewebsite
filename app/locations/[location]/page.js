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
  
  return {
    title: `Furniture Services in ${location.name} | Gupta Furniture`,
    description: `Best furniture services in ${location.name}, Nashik. Sofa cleaning, repair, and interior design in ${location.name}.`,
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

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' },
        { name: location.name, url: `/locations/${location.slug}` }
      ]} />
      
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 4rem', backgroundColor: 'var(--background)', textAlign: 'center' }}>
        <div className="content-container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Services in {location.name}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)' }}>
            Trusted furniture experts near you in {location.name}.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="content-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map((service) => (
              <Link 
                key={service._id.toString()} 
                href={`/locations/${location.slug}/${service.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
                className="service-card-link"
              >
                <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  {service.image && (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: 'var(--surface)', position: 'relative' }}>
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
                    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', backgroundColor: 'var(--surface)' }}>
                      {service.icon}
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                      {service.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.5' }}>
                      {service.description?.substring(0, 100)}...
                    </p>
                    <div style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      View Service →
                    </div>
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
      <section style={{ padding: '2rem 0 4rem', backgroundColor: 'var(--surface)' }}>
        <div className="content-container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '2rem', textAlign: 'center' }}>
            Areas in {location.name}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            {location.sublocations.map((sub) => (
              <span 
                key={sub} 
                style={{ backgroundColor: 'var(--background)', padding: '0.5rem 1rem', border: '1px solid var(--border)', color: 'var(--text-medium)', fontSize: '0.875rem', borderRadius: '0.25rem' }}
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
