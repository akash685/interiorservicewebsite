import LocationForm from '@/components/admin/LocationForm';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import { notFound } from 'next/navigation';

export default async function EditLocationPage({ params }) {
  const { id } = await params;
  await dbConnect();
  const location = await Location.findById(id).lean();

  if (!location) {
    notFound();
  }

  // Convert _id to string for serialization
  const locationData = JSON.parse(JSON.stringify(location));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/locations" className="text-pink-600 hover:text-pink-700 mb-3 inline-block">
          ← Back to Locations
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Edit Location</h1>
        <p className="text-gray-600">Update location details</p>
      </div>

      <LocationForm location={locationData} />
    </div>
  );
}
