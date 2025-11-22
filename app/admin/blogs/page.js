import Link from 'next/link';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import DeleteBlogButton from '@/components/admin/DeleteBlogButton';
import Icon from '@/components/admin/Icon';
import Pagination from '@/components/admin/Pagination';

export default async function AdminBlogsPage(props) {
  const searchParams = await props.searchParams;
  await dbConnect();
  
  const page = parseInt(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const blogsData = await Blog.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalBlogs = await Blog.countDocuments({});
  const totalPages = Math.ceil(totalBlogs / limit);

  const blogs = blogsData.map(blog => ({
    _id: blog._id.toString(),
    title: blog.title,
    author: blog.author,
    category: blog.category,
    views: blog.views || 0,
    isPublished: blog.isPublished,
    createdAt: blog.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Manage Blogs</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="flex items-center gap-2 text-white px-6 py-3 hover:opacity-90 transition-colors font-medium"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Icon name="plus" className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Views</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-pink-50 text-pink-700 px-2 py-1 text-xs border border-pink-200">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{blog.views}</td>
                  <td className="px-6 py-4 text-center">
                    {blog.isPublished ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
                        <Icon name="sparkles" className="w-3 h-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium border border-gray-200">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link 
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 hover:bg-pink-100 transition-colors text-sm font-medium border border-pink-200"
                      >
                        <Icon name="edit" className="w-4 h-4" />
                        Edit
                      </Link>
                      <DeleteBlogButton id={blog._id} title={blog.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {blogs.length === 0 && (
          <div className="p-16 text-center text-gray-500">
            <Icon name="blog" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-700 mb-2">No blog posts found</p>
            <p className="text-sm">Click "Create New Post" to write your first blog post.</p>
          </div>
        )}

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl="/admin/blogs" 
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}
