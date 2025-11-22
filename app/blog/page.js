import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Location'; // Ensure Location model is registered
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Blog | Gupta Furniture',
  description: 'Read our latest articles on furniture design, interior decoration tips, and more.',
  alternates: {
    canonical: 'https://www.guptafurniturenashik.in/blog',
  },
};

export default async function BlogIndexPage(props) {
  const searchParams = await props.searchParams;
  await dbConnect();

  const page = parseInt(searchParams.page) || 1;
  const limit = 9; // Show 9 blogs per page
  const skip = (page - 1) * limit;

  const blogs = await Blog.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('locations', 'name slug')
    .lean();

  const totalBlogs = await Blog.countDocuments({ isPublished: true });
  const totalPages = Math.ceil(totalBlogs / limit);

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' }
      ]} />
      <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: 'var(--text-dark)' }}>Our Blog</h1>
      <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--text-light)' }}>
        Discover the latest trends, tips, and insights in the world of furniture and interior design.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <article 
            key={blog._id} 
            className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
            style={{ 
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)'
            }}
          >
            {blog.coverImage && (
              <div className="h-48 overflow-hidden relative">
                <Image 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="text-xs font-medium px-2.5 py-0.5"
                  style={{ 
                    backgroundColor: '#fff0f7',
                    color: 'var(--primary)'
                  }}
                >
                  {blog.category}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-light)' }}>
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-3 line-clamp-2" style={{ color: 'var(--text-dark)' }}>
                <Link 
                  href={`/blog/${blog.slug}`} 
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {blog.title}
                </Link>
              </h2>
              
              <p className="text-sm mb-4 line-clamp-3 flex-1" style={{ color: 'var(--text-light)' }}>
                {blog.excerpt || blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
              </p>

              {blog.locations && blog.locations.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {blog.locations.map(loc => (
                    <span 
                      key={loc._id} 
                      className="text-xs px-2 py-1"
                      style={{ 
                        color: 'var(--text-light)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      📍 {loc.name}
                    </span>
                  ))}
                </div>
              )}

              <Link 
                href={`/blog/${blog.slug}`}
                className="font-medium text-sm hover:underline mt-auto inline-flex items-center gap-1"
                style={{ color: 'var(--primary)' }}
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-16" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="text-lg" style={{ color: 'var(--text-light)' }}>No articles published yet. Check back soon!</p>
        </div>
      )}

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        baseUrl="/blog" 
        searchParams={searchParams}
      />
    </div>
  );
}
