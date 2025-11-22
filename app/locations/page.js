import Link from 'next/link';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Service Areas | Gupta Furniture Nashik',
  description: 'We serve all major areas in Nashik including Nashik Road, Gangapur Road, Indira Nagar, and more.',
};

export default async function LocationsPage() {
  await dbConnect();
  const locations = await Location.find({}).sort({ name: 1 }).lean();

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' }
      ]} />
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6">
              Service Areas
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide doorstep service across Nashik city. Find your area below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <Link 
                key={loc._id} 
                href={`/locations/${loc.slug}`} 
                className="block bg-white border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{loc.name}</h3>
                <p className="text-gray-600 mb-4">
                  Serving {loc.sublocations.length} sub-areas including {loc.sublocations[0]}...
                </p>
                <span className="font-medium hover:opacity-80" style={{ color: 'var(--primary)' }}>View Services in {loc.name} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
