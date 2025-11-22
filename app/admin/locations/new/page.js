import LocationForm from '@/components/admin/LocationForm';
import Link from 'next/link';

export default function NewLocationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/locations" className="text-pink-600 hover:text-pink-700 mb-3 inline-block">
          ← Back to Locations
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Add New Location</h1>
        <p className="text-gray-600">Create a new service location</p>
      </div>

      <LocationForm />
    </div>
  );
}
