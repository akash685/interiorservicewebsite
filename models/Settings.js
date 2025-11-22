import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  // Site Identity
  siteName: { type: String, default: 'Gupta Furniture' },
  tagline: { type: String, default: 'Premium Furniture & Interior Solutions' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  copyrightText: { type: String, default: '© 2025 Gupta Furniture. All rights reserved.' },

  // Contact Information
  businessPhone: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },
  businessEmail: { type: String, default: '' },
  businessAddress: { type: String, default: '' },
  googleMapsLink: { type: String, default: '' },

  // Theme & Branding
  theme: {
    primaryColor: { type: String, default: '#ff2575' },
    textDark: { type: String, default: '#1a1a1a' },
    textMedium: { type: String, default: '#4a4a4a' },
    textLight: { type: String, default: '#6b7280' },
    background: { type: String, default: '#ffffff' },
    surface: { type: String, default: '#f9fafb' },
    border: { type: String, default: '#e5e7eb' },
  },

  // Google/Analytics
  googleAnalyticsId: { type: String, default: '' },
  googleTagManagerId: { type: String, default: '' },
  googleSearchConsoleCode: { type: String, default: '' },
  facebookPixelId: { type: String, default: '' },

  // SEO Settings
  seo: {
    globalKeywords: [{ type: String }],
    defaultMetaDescription: { type: String, default: '' },
    defaultMetaTitlePattern: { type: String, default: '{page} | Gupta Furniture' },
    ogDefaultImage: { type: String, default: '' },
    twitterCardType: { type: String, default: 'summary_large_image' },
    twitterHandle: { type: String, default: '' },
  },

  // Social Media Links
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    pinterest: { type: String, default: '' },
  },

  // Business Settings
  business: {
    openTime: { type: String, default: '09:00' },
    closeTime: { type: String, default: '18:00' },
    workingDays: { type: String, default: 'Monday - Saturday' },
    minimumOrderValue: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    serviceAreas: [{ type: String }],
  },

}, { timestamps: true });

// Singleton: Only one settings document should exist
SettingsSchema.statics.getSiteSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
