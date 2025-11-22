import ServiceForm from '@/components/admin/ServiceForm';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { notFound } from 'next/navigation';

export default async function EditServicePage({ params }) {
  const { id } = await params;
  await dbConnect();
  const service = await Service.findById(id).lean();

  if (!service) {
    notFound();
  }

  // Convert to plain JSON to handle all _id and date fields automatically
  const serviceData = JSON.parse(JSON.stringify(service));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/services" className="text-pink-600 hover:text-pink-700 mb-3 inline-block">
          ← Back to Services
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Edit Service</h1>
        <p className="text-gray-600">Update service information</p>
      </div>

      <ServiceForm service={serviceData} />
    </div>
  );
}
