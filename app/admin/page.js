import Link from 'next/link';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Location from '@/models/Location';
import Blog from '@/models/Blog';
import Lead from '@/models/Lead';
import Icon from '@/components/admin/Icon';
import { StatCard, QuickActionCard } from '@/components/admin/DashboardCard';

export const metadata = {
  title: 'Admin Dashboard | Gupta Furniture',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await dbConnect();
  
  // Get counts for each resource
  const [servicesCount, locationsCount, blogsCount, leadsCount, publishedBlogsCount] = await Promise.all([
    Service.countDocuments(),
    Location.countDocuments(),
    Blog.countDocuments(),
    Lead.countDocuments(),
    Blog.countDocuments({ isPublished: true }),
  ]);

  const stats = [
    {
      title: 'Services',
      count: servicesCount,
      icon: 'services',
      href: '/admin/services',
    },
    {
      title: 'Locations',
      count: locationsCount,
      icon: 'location',
      href: '/admin/locations',
    },
    {
      title: 'Blog Posts',
      count: blogsCount,
      subtitle: `${publishedBlogsCount} published`,
      icon: 'blog',
      href: '/admin/blogs',
    },
    {
      title: 'Leads',
      count: leadsCount,
      icon: 'users',
      href: '/admin/leads',
    },
  ];

  const quickActions = [
    { title: 'Add Service', href: '/admin/services/new', icon: 'plus' },
    { title: 'Add Location', href: '/admin/locations/new', icon: 'plus' },
    { title: 'Create Blog Post', href: '/admin/blogs/new', icon: 'pencil' },
    { title: 'View Site', href: '/', icon: 'globe' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat}>
            <div className="flex items-center justify-between mb-4">
              <Icon name={stat.icon} className="w-10 h-10" style={{ color: 'var(--primary)' }} />
              <div className="text-right">
                <div className="text-3xl font-semibold text-gray-900">{stat.count}</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
            {stat.subtitle && (
              <p className="text-sm text-gray-600 mt-1">{stat.subtitle}</p>
            )}
          </StatCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} action={action}>
              <Icon name={action.icon} className="w-6 h-6" />
              <span className="font-medium">{action.title}</span>
            </QuickActionCard>
          ))}
        </div>
      </div>

      {/* Recent Activity / Tips Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="sparkles" className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: 'var(--primary)' }}>•</span>
              <span>Use SEO fields to improve search rankings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: 'var(--primary)' }}>•</span>
              <span>Tag blog posts with locations for better visibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: 'var(--primary)' }}>•</span>
              <span>Regularly update services to keep content fresh</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="chart" className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            Content Health
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Services</span>
                <span className="font-medium text-gray-900">{servicesCount}</span>
              </div>
              <div className="w-full bg-gray-200 h-2">
                <div className="h-2" style={{ width: `${Math.min(servicesCount * 10, 100)}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Published Blogs</span>
                <span className="font-medium text-gray-900">{publishedBlogsCount}</span>
              </div>
              <div className="w-full bg-gray-200 h-2">
                <div className="h-2" style={{ width: `${Math.min(publishedBlogsCount * 10, 100)}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Locations</span>
                <span className="font-medium text-gray-900">{locationsCount}</span>
              </div>
              <div className="w-full bg-gray-200 h-2">
                <div className="h-2" style={{ width: `${Math.min(locationsCount * 20, 100)}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
