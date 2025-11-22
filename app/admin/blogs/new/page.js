import BlogForm from '@/components/admin/BlogForm';
import Link from 'next/link';

export default function NewBlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/blogs" className="text-pink-600 hover:text-pink-700 mb-3 inline-block">
          ← Back to Blogs
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create Blog Post</h1>
        <p className="text-gray-600">Write a new blog post for your website</p>
      </div>

      <BlogForm />
    </div>
  );
}
