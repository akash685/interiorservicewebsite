import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Our Services | Gupta Furniture',
  description: 'Explore our range of furniture services in Nashik',
  alternates: {
    canonical: 'https://www.guptafurniturenashik.in/services',
  },
};

export default async function ServicesPage(props) {
  const searchParams = await props.searchParams;
  await dbConnect();

  const page = parseInt(searchParams.page) || 1;
  const limit = 12; // Show 12 services per page
  const skip = (page - 1) * limit;

  const services = await Service.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalServices = await Service.countDocuments({});
  const totalPages = Math.ceil(totalServices / limit);

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' }
      ]} />
      
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional furniture solutions for your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id.toString()} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                {/* Service Image */}
                <div className="h-56 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {service.image ? (
                    <Image 
                      src={service.image} 
                      alt={service.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="text-5xl" style={{ color: 'var(--primary)' }}>
                      {service.icon}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Keywords */}
                  {service.keywords && service.keywords.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {service.keywords.slice(0, 2).map((keyword, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            baseUrl="/services" 
            searchParams={searchParams}
          />
        </div>
      </section>
    </div>
  );
}
