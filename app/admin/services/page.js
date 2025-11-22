import Link from 'next/link';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import DeleteServiceButton from '@/components/admin/DeleteServiceButton';
import Pagination from '@/components/admin/Pagination';

export default async function AdminServicesPage(props) {
  const searchParams = await props.searchParams;
  await dbConnect();
  
  const page = parseInt(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const servicesData = await Service.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalServices = await Service.countDocuments({});
  const totalPages = Math.ceil(totalServices / limit);
  
  // Convert to plain JSON with explicit type conversion to avoid any ObjectId issues
  const services = servicesData.map(svc => ({
    _id: String(svc._id),
    name: String(svc.name || ''),
    slug: String(svc.slug || ''),
    icon: String(svc.icon || '⚙️'),
    description: String(svc.description || ''),
    keywords: Array.isArray(svc.keywords) ? svc.keywords.map(String) : [],
    metaTitle: String(svc.metaTitle || ''),
    metaDescription: String(svc.metaDescription || ''),
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>Manage Services</h1>
          <p style={{ color: 'var(--text-light)' }}>Configure and manage your service offerings</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/admin/services/seed" 
            className="px-6 py-3 transition-colors font-medium"
            style={{ 
              backgroundColor: 'var(--text-medium)',
              color: 'var(--background)'
            }}
          >
            Seed Database
          </Link>
          <Link 
            href="/admin/services/new" 
            className="px-6 py-3 transition-colors font-medium hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--background)'
            }}
          >
            Add New Service
          </Link>
        </div>
      </div>

      <div className="overflow-hidden" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-medium)' }}>Icon</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-medium)' }}>Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-medium)' }}>Slug</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-medium)' }}>Keywords</th>
                <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: 'var(--text-medium)' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border)' }}>
              {services.map((service) => (
                <tr 
                  key={service._id} 
                  className="transition-colors hover:bg-gray-50"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="px-6 py-4 text-2xl">{service.icon}</td>
                  <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-dark)' }}>{service.name}</td>
                  <td className="px-6 py-4">
                    <code 
                      className="text-sm px-2 py-1"
                      style={{ 
                        color: 'var(--text-light)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      /{service.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-light)' }}>
                    {service.keywords && service.keywords.length > 0 
                      ? (
                        <div className="flex flex-wrap gap-1">
                          {service.keywords.slice(0, 3).map((k, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 text-xs"
                              style={{ 
                                backgroundColor: '#fff0f7',
                                color: 'var(--primary)',
                                border: '1px solid #ffd6e9'
                              }}
                            >
                              {k}
                            </span>
                          ))}
                          {service.keywords.length > 3 && (
                            <span className="text-xs" style={{ color: 'var(--text-light)' }}>
                              +{service.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      )
                      : <span className="italic" style={{ color: 'var(--text-light)' }}>No keywords</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link 
                        href={`/admin/services/${service._id}/edit`}
                        className="px-4 py-2 transition-colors text-sm font-medium hover:opacity-90"
                        style={{ 
                          backgroundColor: '#fff0f7',
                          color: 'var(--primary)',
                          border: '1px solid #ffd6e9'
                        }}
                      >
                        Edit
                      </Link>
                      <DeleteServiceButton id={service._id} name={service.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {services.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-dark)' }}>No services found</p>
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>
              Click "Seed Database" to import initial data or "Add New Service" to create one.
            </p>
          </div>
        )}

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl="/admin/services" 
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}
