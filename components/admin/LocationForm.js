'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LocationForm({ location }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: location?.name || '',
    slug: location?.slug || '',
    description: location?.description || '',
    metaTitle: location?.metaTitle || '',
    metaDescription: location?.metaDescription || '',
    keywords: location?.keywords?.join(', ') || '',
    sublocations: location?.sublocations || [],
  });
  const [newSublocation, setNewSublocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = location ? `/api/locations/${location._id}` : '/api/locations';
      const method = location ? 'PUT' : 'POST';

      const processedData = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      if (res.ok) {
        router.push('/admin/locations');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save location');
      }
    } catch (error) {
      alert('Error saving location');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/locations/${location._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/locations');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete location');
      }
    } catch (error) {
      alert('Error deleting location');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const addSublocation = () => {
    if (newSublocation.trim()) {
      setFormData({
        ...formData,
        sublocations: [...formData.sublocations, newSublocation.trim()],
      });
      setNewSublocation('');
    }
  };

  const removeSublocation = (index) => {
    setFormData({
      ...formData,
      sublocations: formData.sublocations.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Location Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Gangapur Road"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  required
                  placeholder="e.g., gangapur-road"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                required
                placeholder="Describe this location..."
              />
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO Information</h3>
            
            <div className="form-group">
              <label className="form-label">Meta Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                required
                placeholder="SEO-optimized title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta Description *</label>
              <textarea
                className="form-textarea"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows="3"
                required
                placeholder="SEO-optimized description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Keywords (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="furniture nashik, sofa repair gangapur road"
              />
            </div>
          </div>

          {/* Sublocations */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sublocations</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add specific areas within this location (e.g., College Road, CBS Chowk)
            </p>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                className="form-input flex-1"
                value={newSublocation}
                onChange={(e) => setNewSublocation(e.target.value)}
                placeholder="Add sublocation..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSublocation();
                  }
                }}
              />
              <button 
                type="button" 
                onClick={addSublocation} 
                className="px-6 py-3 text-white font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.sublocations.map((sub, index) => (
                <div key={index} className="bg-gray-100 px-3 py-2 border border-gray-200 flex items-center gap-2">
                  <span className="text-sm text-gray-700">{sub}</span>
                  <button
                    type="button"
                    onClick={() => removeSublocation(index)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.sublocations.length === 0 && (
                <p className="text-gray-500 text-sm py-4">No sublocations added yet</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 text-white font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isSubmitting ? 'Saving...' : (location ? 'Update Location' : 'Create Location')}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            {location && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Delete Location</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{location.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
