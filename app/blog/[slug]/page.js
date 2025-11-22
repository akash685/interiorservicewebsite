import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Location'; // Ensure Location model is registered
import BlogViewTracker from '@/components/BlogViewTracker';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const blog = await Blog.findOne({ slug, isPublished: true }).lean();

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    alternates: {
      canonical: blog.canonicalUrl || `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: [blog.author],
      tags: blog.tags,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  
  const blog = await Blog.findOne({ slug, isPublished: true })
    .populate('locations', 'name slug')
    .lean();

  if (!blog) {
    notFound();
  }

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': blog.schemaType || 'Article',
    headline: blog.title,
    image: blog.coverImage ? [blog.coverImage] : [],
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: [{
      '@type': 'Person',
      name: blog.author,
    }],
    description: blog.metaDescription || blog.excerpt,
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogViewTracker blogId={blog._id.toString()} />
      
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: blog.title, url: `/blog/${blog.slug}` }
      ]} />

      <article className="content-container py-16">
        {/* Header */}
        <header className="max-w-2xl mx-auto mb-12">
          {/* Back Link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-light)' }}
          >
            ← Back to Blog
          </Link>

          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--primary)' }}
            >
              {blog.category}
            </span>
            <span style={{ color: 'var(--border)' }}>•</span>
            <time 
              dateTime={blog.publishedAt}
              className="text-sm"
              style={{ color: 'var(--text-light)' }}
            >
              {new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
          
          {/* Title */}
          <h1 
            className="text-4xl md:text-5xl font-semibold leading-tight mb-6 tracking-tight"
            style={{ color: 'var(--text-dark)' }}
          >
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-light)' }}>
            <span>
              By <strong className="font-medium" style={{ color: 'var(--text-dark)' }}>{blog.author}</strong>
            </span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative w-full max-w-4xl mx-auto mb-12 overflow-hidden rounded-lg" style={{ height: 'clamp(300px, 50vw, 500px)' }}>
            <Image 
              src={blog.coverImage} 
              alt={blog.title} 
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="max-w-2xl mx-auto prose prose-lg"
          style={{ color: 'var(--text-medium)' }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer */}
        <footer className="max-w-2xl mx-auto mt-12 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-sm px-3 py-1 rounded"
                    style={{ 
                      color: 'var(--text-medium)',
                      backgroundColor: 'var(--surface)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Locations */}
          {blog.locations && blog.locations.length > 0 && (
            <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'var(--surface)' }}>
              <h3 
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-dark)' }}
              >
                Related Locations
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.locations.map(loc => (
                  <Link 
                    key={loc._id} 
                    href={`/locations/${loc.slug}`}
                    className="px-4 py-2 text-sm font-medium rounded border transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    style={{ 
                      backgroundColor: 'var(--background)',
                      color: 'var(--text-dark)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    📍 {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </footer>
      </article>
    </div>
  );
}
