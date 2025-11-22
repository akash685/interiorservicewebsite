import mongoose from 'mongoose';



const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a location name'],
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
  sublocations: [{
    type: String,
    trim: true,
  }],
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
}, {
  timestamps: true,
});

export default mongoose.models.Location || mongoose.model('Location', locationSchema);
