'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ServiceForm({ service }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: service?.name || '',
    slug: service?.slug || '',
    icon: service?.icon || '🛠️',
    description: service?.description || '',
    metaTitle: service?.metaTitle || '',
    metaDescription: service?.metaDescription || '',
    keywords: service?.keywords?.join(', ') || '',
    image: service?.image || '',
    serviceType: service?.serviceType || 'Home Interior Design',
    priceRange: service?.priceRange || '₹₹₹',
    offers: service?.offers ? JSON.stringify(service.offers, null, 2) : '[]',
    reviews: service?.reviews ? JSON.stringify(service.reviews, null, 2) : '[]',
    faqs: service?.faqs || [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        offers: JSON.parse(formData.offers || '[]'),
        reviews: JSON.parse(formData.reviews || '[]'),
      };

      const url = service ? `/api/services/${service._id}` : '/api/services';
      const method = service ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/services');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save service');
      }
    } catch (error) {
      alert('Error saving service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }],
    });
  };

  const removeFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    });
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          
          <div className="form-group">
            <label className="form-label">Service Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Sofa Cleaning Service"
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
              placeholder="e.g., sofa-cleaning"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (lowercase, hyphens only)</p>
          </div>

          <div className="form-group">
            <label className="form-label">Icon (Emoji)</label>
            <input
              type="text"
              className="form-input"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="🛠️"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
              placeholder="Brief description of the service"
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
              placeholder="SEO-optimized description (150-160 characters)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keywords (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="sofa cleaning, furniture repair, nashik"
            />
          </div>
        </div>

        {/* Schema Data */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced Schema Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <input
                type="text"
                className="form-input"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                placeholder="Home Interior Design"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price Range</label>
              <input
                type="text"
                className="form-input"
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                placeholder="₹₹₹"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-input"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Offers (JSON)</label>
            <textarea
              className="form-textarea font-mono text-sm"
              value={formData.offers}
              onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
 rows="5"
              placeholder='[{"name": "Offer Name", "price": "1000", "description": "Description"}]'
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reviews (JSON)</label>
            <textarea
              className="form-textarea font-mono text-sm"
              value={formData.reviews}
              onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
              rows="5"
              placeholder='[{"author": "Name", "reviewBody": "Review text", "ratingValue": "5"}]'
            />
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
            <button 
              type="button" 
              onClick={addFaq} 
              className="px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Add FAQ
            </button>
          </div>

          {formData.faqs.length > 0 ? (
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <input
                      type="text"
                      className="form-input"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Answer</label>
                    <textarea
                      className="form-textarea"
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      rows="3"
                      placeholder="Enter answer"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No FAQs added yet. Click "Add FAQ" to create one.</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 text-white font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {isSubmitting ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
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
