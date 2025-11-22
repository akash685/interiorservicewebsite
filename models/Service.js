import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { _id: false });

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  reviewBody: { type: String, required: true },
  ratingValue: { type: Number, min: 1, max: 5, default: 5 },
  datePublished: { type: Date, default: Date.now },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  icon: {
    type: String,
    default: '🛠️',
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  metaTitle: {
    type: String,
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  keywords: [{
    type: String,
  }],
  image: {
    type: String,
    required: false,
  },
  serviceType: {
    type: String,
    default: 'Service',
  },
  priceRange: {
    type: String,
    default: '₹₹',
  },
  offers: [offerSchema],
  reviews: [reviewSchema],
  faqs: [faqSchema],
}, {
  timestamps: true,
});

// Index for searching
serviceSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
