const mongoose = require('mongoose');
const Settings = require('../models/Settings');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function updateFooterSettings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const tagline = "Premium Furniture & Interior Solutions";
    const googleMapsLink = "https://maps.google.com/?q=Gupta+Furniture+Nashik"; // Example link, user didn't provide specific, using generic or placeholder

    const result = await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          tagline: tagline,
          googleMapsLink: googleMapsLink
        }
      },
      { new: true, upsert: true }
    );

    console.log('Footer settings updated successfully:', result);
  } catch (error) {
    console.error('Error updating settings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateFooterSettings();
