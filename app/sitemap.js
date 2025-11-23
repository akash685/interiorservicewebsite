import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import Location from '@/models/Location';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://www.guptafurniturenashik.in';

  // Fetch data from database
  await dbConnect();
  const services = await Service.find({}).select('slug').lean();
  const locations = await Location.find({}).select('slug sublocations').lean();
  const blogs = await Blog.find({ isPublished: true }).select('slug updatedAt').lean();

  // Static Routes
  const routes = [
    '',
    '/services',
    '/locations',
    '/contact',
    '/blog',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }));

  // Dynamic Service Routes
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Location Routes
  const locationRoutes = locations.map((location) => ({
    url: `${baseUrl}/locations/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Service in Location Routes
  const serviceLocationRoutes = locations.flatMap((location) =>
    services.map((service) => ({
      url: `${baseUrl}/locations/${location.slug}/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  );

  // Sublocation Routes (Deep Links)
  const sublocationRoutes = locations.flatMap((location) =>
    location.sublocations.flatMap((sub) => 
      services.map((service) => ({
        url: `${baseUrl}/locations/${location.slug}/${sub.toLowerCase().replace(/ /g, '-')}/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    )
  );

  // Dynamic Blog Routes
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...routes, ...serviceRoutes, ...locationRoutes, ...serviceLocationRoutes, ...sublocationRoutes, ...blogRoutes];
}
