'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    author: 'Admin',
    category: 'General',
    tags: '',
    locations: [],
    isPublished: false,
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    schemaType: 'Article',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        if (data.success) {
          setLocations(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    fetchLocations();

    if (initialData) {
      setFormData({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
        locations: Array.isArray(initialData.locations) 
          ? initialData.locations.map(l => typeof l === 'object' ? l._id : l) 
          : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      locations: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      const url = initialData ? `/api/blogs/${initialData._id}` : '/api/blogs';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess('Blog post saved successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin/blogs');
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error saving blog:', error);
      setError(error.message || 'An error occurred while saving the blog.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="space-y-8">
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700">
            {success}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Content</h3>
          
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter blog title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug (Optional)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="form-input"
              placeholder="auto-generated-from-title"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
          </div>

          <div className="form-group">
            <label className="form-label">Content (HTML) *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="form-textarea font-mono text-sm"
              placeholder="<p>Write your blog content here...</p>"
            />
            <p className="text-xs text-gray-500 mt-1">Enter raw HTML content</p>
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Short summary for list view"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="form-input"
                placeholder="Admin"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                placeholder="General"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="furniture, design, tips"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Related Locations</label>
              <select
                multiple
                name="locations"
                value={formData.locations}
                onChange={handleLocationChange}
                className="form-input h-32"
              >
                {locations.map(loc => (
                  <option key={loc._id} value={loc._id}>{loc.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO & Metadata</h3>
          
          <div className="form-group">
            <label className="form-label">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="form-input"
              placeholder="SEO-optimized title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="SEO-optimized description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Canonical URL</label>
              <input
                type="text"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/blog-post"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Schema Type</label>
              <select
                name="schemaType"
                value={formData.schemaType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Article">Article</option>
                <option value="BlogPosting">BlogPosting</option>
                <option value="NewsArticle">NewsArticle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 text-pink-600 border-gray-300"
            />
            <label htmlFor="isPublished" className="text-gray-800 font-medium">Publish this post</label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 text-white font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {loading ? 'Saving...' : (initialData ? 'Update Blog Post' : 'Create Blog Post')}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
