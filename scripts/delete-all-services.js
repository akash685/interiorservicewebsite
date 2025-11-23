#!/usr/bin/env node

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
  console.log('✅ Environment variables loaded from .env.local');
} catch (error) {
  console.error('❌ Error loading .env.local file:', error.message);
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define Service schema and model directly
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
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

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function deleteAllServices() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('✅ Connected to MongoDB successfully');
    
    console.log('📊 Getting service count...');
    const count = await Service.countDocuments();
    console.log(`Found ${count} services in the database`);
    
    if (count === 0) {
      console.log('✅ No services to delete');
      return;
    }
    
    console.log('🗑️  Deleting all services...');
    const result = await Service.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.deletedCount} services`);
    
    // Verify deletion
    const remainingCount = await Service.countDocuments();
    if (remainingCount === 0) {
      console.log('✅ Verification: All services have been successfully deleted');
    } else {
      console.log(`⚠️  Warning: ${remainingCount} services still remain`);
    }
    
  } catch (error) {
    console.error('❌ Error deleting services:', error);
    process.exit(1);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
deleteAllServices();