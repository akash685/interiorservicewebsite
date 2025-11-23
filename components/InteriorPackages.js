import Link from 'next/link';
import Image from 'next/image';
import { Phone, WhatsApp } from './Icons';

const packages = [
  {
    id: 1,
    name: '1 BHK',
    price: '2.5L',
    image: 'https://res.cloudinary.com/dmrxpcalh/image/upload/v1763828169/1bhk_hbgitu.png'
  },
  {
    id: 2,
    name: '2 BHK',
    price: '3.5L',
    popular: true,
    image: 'https://res.cloudinary.com/dmrxpcalh/image/upload/v1763828171/2bhk_ortrlk.png'
  },
  {
    id: 3,
    name: '3 BHK',
    price: '4.5L',
    image: 'https://res.cloudinary.com/dmrxpcalh/image/upload/v1763828169/3bhk_bzzbb1.png'
  },
  {
    id: 4,
    name: '4 BHK',
    price: '5.5L',
    image: 'https://res.cloudinary.com/dmrxpcalh/image/upload/v1763828171/4bhk_mgtorl.png'
  },
];

const phoneNumber = '919511641912';
const whatsappMessage = encodeURIComponent('Hi! I am interested in your interior design packages. Could you please provide more details?');

export default function InteriorPackages() {
  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">Interior Packages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete home design solutions with premium materials
          </p>
        </div>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white border border-gray-200 transition-colors hover:border-gray-300"
                style={{ width: '280px', flexShrink: 0 }}
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-50">
                  <Image 
                    src={pkg.image} 
                    alt={`${pkg.name} Interior Package`}
                    fill
                    className="object-cover"
                    sizes="280px"
                    quality={85}
                    priority={pkg.id <= 2}
                  />
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 text-white px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'var(--primary)' }}>
                      Popular
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {pkg.name} Package
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">From</span>
                      <span className="text-3xl font-semibold text-gray-900">₹{pkg.price}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <a 
                      href={`tel:+${phoneNumber}`}
                      className="flex items-center justify-center gap-2 w-full text-white py-3 px-4 font-medium hover:opacity-90 transition-colors"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                    
                    <a 
                      href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 px-4 font-medium hover:border-gray-400 transition-colors"
                    >
                      <WhatsApp className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet & Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-white border border-gray-200 transition-colors hover:border-gray-300"
            >
              {/* Image */}
              <div className="relative h-56 bg-gray-50">
                <Image 
                  src={pkg.image} 
                  alt={`${pkg.name} Interior Package`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 50vw, 25vw"
                  quality={85}
                  priority={pkg.id <= 2}
                />
                {pkg.popular && (
                  <div className="absolute top-4 right-4 text-white px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'var(--primary)' }}>
                    Popular
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {pkg.name} Package
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-500">From</span>
                    <span className="text-3xl font-semibold text-gray-900">₹{pkg.price}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a 
                    href={`tel:+${phoneNumber}`}
                    className="flex items-center justify-center gap-2 w-full text-white py-3 px-4 font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  
                  <a 
                    href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 px-4 font-medium hover:border-gray-400 transition-colors"
                  >
                    <WhatsApp className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-600">
            Need a custom package?{' '}
            <Link href="/#contact" className="font-medium underline hover:opacity-80" style={{ color: 'var(--primary)' }}>
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
