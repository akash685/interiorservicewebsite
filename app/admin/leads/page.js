import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  await dbConnect();
  // Fetch last 50 leads, sorted by newest first
  const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(50);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Leads Dashboard</h1>
      <p className="text-gray-600 mb-8">Viewing last 50 inquiries</p>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Page URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{lead.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.service || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.location} {lead.sublocation ? `(${lead.sublocation})` : ''}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{lead.pageUrl}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                    No leads found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
