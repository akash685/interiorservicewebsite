import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  excerpt: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    default: 'Admin',
  },
  category: {
    type: String,
    default: 'General',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  }],
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  canonicalUrl: {
    type: String,
    trim: true,
  },
  schemaType: {
    type: String,
    default: 'Article',
    enum: ['Article', 'BlogPosting', 'NewsArticle'],
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate slug if not provided
// Pre-save hook to generate slug if not provided
blogSchema.pre('save', async function(next) {
  if (!this.isModified('title') && !this.isNew && !this.isModified('slug')) return next();
  
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (this.slug) {
    // Ensure slug is unique
    const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
    const blogsWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (blogsWithSlug.length > 0) {
      // Check if the current doc is already in the list (update case)
      const exists = blogsWithSlug.find(b => b._id.toString() !== this._id.toString() && b.slug === this.slug);
      
      if (exists) {
        this.slug = `${this.slug}-${blogsWithSlug.length + 1}`;
      }
    }
  }
  
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
