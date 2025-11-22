import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    maxlength: [15, 'Phone number cannot be more than 15 characters'],
  },
  service: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  sublocation: {
    type: String,
    required: false,
  },
  pageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
