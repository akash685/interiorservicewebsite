import Link from 'next/link';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import DeleteLocationButton from '@/components/admin/DeleteLocationButton';
import Icon from '@/components/admin/Icon';

export const dynamic = 'force-dynamic';

export default async function AdminLocationsPage() {
  await dbConnect();
  const locationsData = await Location.find({}).sort({ createdAt: -1 }).lean();
  
  const locations = locationsData.map(loc => ({
    _id: loc._id.toString(),
    name: loc.name,
    slug: loc.slug,
    description: loc.description || '',
    sublocations: loc.sublocations || [],
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Manage Locations</h1>
          <p className="text-gray-600">Configure service areas and sublocations</p>
        </div>
        <Link 
          href="/admin/locations/new" 
          className="flex items-center gap-2 text-white px-6 py-3 hover:opacity-90 transition-colors font-medium"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Icon name="plus" className="w-5 h-5" />
          Add New Location
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location._id} className="bg-white border border-gray-200 hover:border-pink-600 transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="location" className="w-5 h-5 text-pink-600" />
                    <h2 className="text-xl font-semibold text-gray-900">{location.name}</h2>
                  </div>
                  <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 border border-gray-200">
                    /{location.slug}
                  </code>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{location.description}</p>

              {location.sublocations.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Sublocations ({location.sublocations.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {location.sublocations.slice(0, 5).map((sub, idx) => (
                      <span
                        key={idx}
                        className="bg-pink-50 text-pink-700 px-2 py-0.5 text-xs border border-pink-200"
                      >
                        {sub}
                      </span>
                    ))}
                    {location.sublocations.length > 5 && (
                      <span className="text-xs text-gray-500 px-2">
                        +{location.sublocations.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link 
                  href={`/admin/locations/${location._id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 hover:bg-pink-100 transition-colors text-sm font-medium border border-pink-200"
                >
                  <Icon name="edit" className="w-4 h-4" />
                  Edit
                </Link>
                <DeleteLocationButton locationId={location._id} locationName={location.name} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <Icon name="location" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-700 mb-2">No locations found</p>
          <p className="text-sm text-gray-600 mb-6">Start by adding your first service location</p>
          <Link 
            href="/admin/locations/new" 
            className="inline-flex items-center gap-2 text-white px-6 py-3 hover:opacity-90 transition-colors font-medium"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Icon name="plus" className="w-5 h-5" />
            Add New Location
          </Link>
        </div>
      )}
    </div>
  );
}
