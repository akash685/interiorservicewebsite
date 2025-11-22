import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import BlogForm from '@/components/admin/BlogForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  await dbConnect();
  
  const blog = await Blog.findById(id).lean();

  if (!blog) {
    notFound();
  }

  // Serialize for client component
  const serializedBlog = {
    ...blog,
    _id: blog._id.toString(),
    locations: blog.locations ? blog.locations.map(l => l.toString()) : [],
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/blogs" className="text-pink-600 hover:text-pink-700 mb-3 inline-block">
          ← Back to Blogs
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Edit Blog Post</h1>
        <p className="text-gray-600">Update your blog post</p>
      </div>

      <BlogForm initialData={serializedBlog} />
    </div>
  );
}
