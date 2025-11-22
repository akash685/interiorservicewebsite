'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/admin/Icon';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');
  const [settings, setSettings] = useState({
    siteName: '', tagline: '', logo: '', favicon: '', copyrightText: '',
    businessPhone: '', whatsappNumber: '', businessEmail: '', businessAddress: '', googleMapsLink: '',
    theme: {
      primaryColor: '#ff2575', textDark: '#1a1a1a', textMedium: '#4a4a4a', textLight: '#6b7280',
      background: '#ffffff', surface: '#f9fafb', border: '#e5e7eb',
    },
    googleAnalyticsId: '', googleTagManagerId: '', googleSearchConsoleCode: '', facebookPixelId: '',
    seo: {
      globalKeywords: [], defaultMetaDescription: '', defaultMetaTitlePattern: '',
      ogDefaultImage: '', twitterCardType: 'summary_large_image', twitterHandle: '',
    },
    socialMedia: {
      facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '', pinterest: '',
    },
    business: {
      openTime: '', closeTime: '', workingDays: '',
      minimumOrderValue: 0, deliveryCharges: 0, serviceAreas: [],
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => {
      if (section) {
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleArrayChange = (section, field, value) => {
    const array = value.split(',').map(item => item.trim());
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: array }
    }));
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  const tabs = [
    { id: 'identity', label: 'Identity', icon: 'globe' },
    { id: 'contact', label: 'Contact', icon: 'users' },
    { id: 'theme', label: 'Theme', icon: 'sparkles' },
    { id: 'analytics', label: 'Analytics', icon: 'chart' },
    { id: 'seo', label: 'SEO', icon: 'services' },
    { id: 'social', label: 'Social', icon: 'users' },
    { id: 'business', label: 'Business', icon: 'dashboard' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Website Settings</h1>
          <p className="text-gray-600">Manage your website configuration and preferences</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                  activeTab === tab.id
                    ? ''
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
                style={activeTab === tab.id ? {
                  backgroundColor: 'color-mix(in srgb, var(--primary) 10%, white)',
                  color: 'var(--primary)',
                  borderLeftColor: 'var(--primary)'
                } : {}}
              >
                <Icon name={tab.icon} className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === 'identity' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Site Identity</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleChange(null, 'siteName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => handleChange(null, 'tagline', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={settings.copyrightText}
                      onChange={(e) => handleChange(null, 'copyrightText', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                      type="text"
                      value={settings.logo}
                      onChange={(e) => handleChange(null, 'logo', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                    <input
                      type="text"
                      value={settings.favicon}
                      onChange={(e) => handleChange(null, 'favicon', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                    <input
                      type="text"
                      value={settings.businessPhone}
                      onChange={(e) => handleChange(null, 'businessPhone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => handleChange(null, 'whatsappNumber', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                    <input
                      type="email"
                      value={settings.businessEmail}
                      onChange={(e) => handleChange(null, 'businessEmail', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                    <textarea
                      value={settings.businessAddress}
                      onChange={(e) => handleChange(null, 'businessAddress', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed Link</label>
                    <input
                      type="text"
                      value={settings.googleMapsLink}
                      onChange={(e) => handleChange(null, 'googleMapsLink', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://www.google.com/maps/embed?..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Theme & Branding</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <input
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Dark (Headings)</label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.theme.textDark} onChange={(e) => handleChange('theme', 'textDark', e.target.value)} className="h-10 w-20" />
                      <input type="text" value={settings.theme.textDark} onChange={(e) => handleChange('theme', 'textDark', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Medium (Body)</label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.theme.textMedium} onChange={(e) => handleChange('theme', 'textMedium', e.target.value)} className="h-10 w-20" />
                      <input type="text" value={settings.theme.textMedium} onChange={(e) => handleChange('theme', 'textMedium', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Light (Muted)</label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.theme.textLight} onChange={(e) => handleChange('theme', 'textLight', e.target.value)} className="h-10 w-20" />
                      <input type="text" value={settings.theme.textLight} onChange={(e) => handleChange('theme', 'textLight', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surface Color (Cards)</label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.theme.surface} onChange={(e) => handleChange('theme', 'surface', e.target.value)} className="h-10 w-20" />
                      <input type="text" value={settings.theme.surface} onChange={(e) => handleChange('theme', 'surface', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.theme.border} onChange={(e) => handleChange('theme', 'border', e.target.value)} className="h-10 w-20" />
                      <input type="text" value={settings.theme.border} onChange={(e) => handleChange('theme', 'border', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme.background}
                        onChange={(e) => handleChange('theme', 'background', e.target.value)}
                        className="h-10 w-20"
                      />
                      <input
                        type="text"
                        value={settings.theme.background}
                        onChange={(e) => handleChange('theme', 'background', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Google & Analytics</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID (G-XXXXXXXXXX)</label>
                    <input
                      type="text"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => handleChange(null, 'googleAnalyticsId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="G-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager ID (GTM-XXXXXX)</label>
                    <input
                      type="text"
                      value={settings.googleTagManagerId}
                      onChange={(e) => handleChange(null, 'googleTagManagerId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="GTM-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Search Console Verification Code</label>
                    <input
                      type="text"
                      value={settings.googleSearchConsoleCode}
                      onChange={(e) => handleChange(null, 'googleSearchConsoleCode', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="verification_code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel (Facebook Pixel) ID</label>
                    <input
                      type="text"
                      value={settings.facebookPixelId}
                      onChange={(e) => handleChange(null, 'facebookPixelId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="XXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Global Keywords (comma separated)</label>
                    <textarea
                      value={settings.seo.globalKeywords.join(', ')}
                      onChange={(e) => handleArrayChange('seo', 'globalKeywords', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="furniture, interior design, home decor..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Description</label>
                    <textarea
                      value={settings.seo.defaultMetaDescription}
                      onChange={(e) => handleChange('seo', 'defaultMetaDescription', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Title Pattern</label>
                    <input
                      type="text"
                      value={settings.seo.defaultMetaTitlePattern}
                      onChange={(e) => handleChange('seo', 'defaultMetaTitlePattern', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="{page} | Site Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph Default Image URL</label>
                    <input
                      type="text"
                      value={settings.seo.ogDefaultImage}
                      onChange={(e) => handleChange('seo', 'ogDefaultImage', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card Type</label>
                      <select
                        value={settings.seo.twitterCardType}
                        onChange={(e) => handleChange('seo', 'twitterCardType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
                      <input
                        type="text"
                        value={settings.seo.twitterHandle}
                        onChange={(e) => handleChange('seo', 'twitterHandle', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                        placeholder="@handle"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={settings.socialMedia.facebook}
                      onChange={(e) => handleChange('socialMedia', 'facebook', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={settings.socialMedia.instagram}
                      onChange={(e) => handleChange('socialMedia', 'instagram', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                    <input
                      type="url"
                      value={settings.socialMedia.twitter}
                      onChange={(e) => handleChange('socialMedia', 'twitter', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={settings.socialMedia.linkedin}
                      onChange={(e) => handleChange('socialMedia', 'linkedin', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input
                      type="url"
                      value={settings.socialMedia.youtube}
                      onChange={(e) => handleChange('socialMedia', 'youtube', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pinterest URL</label>
                    <input
                      type="url"
                      value={settings.socialMedia.pinterest}
                      onChange={(e) => handleChange('socialMedia', 'pinterest', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                    <input
                      type="time"
                      value={settings.business.openTime}
                      onChange={(e) => handleChange('business', 'openTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                    <input
                      type="time"
                      value={settings.business.closeTime}
                      onChange={(e) => handleChange('business', 'closeTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                    <input
                      type="text"
                      value={settings.business.workingDays}
                      onChange={(e) => handleChange('business', 'workingDays', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Monday - Saturday"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      value={settings.business.minimumOrderValue}
                      onChange={(e) => handleChange('business', 'minimumOrderValue', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charges (₹)</label>
                    <input
                      type="number"
                      value={settings.business.deliveryCharges}
                      onChange={(e) => handleChange('business', 'deliveryCharges', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas (comma separated)</label>
                    <textarea
                      value={settings.business.serviceAreas.join(', ')}
                      onChange={(e) => handleArrayChange('business', 'serviceAreas', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Mumbai, Pune, Nashik..."
                    />
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
