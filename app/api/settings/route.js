import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { verifyAdminAuth, addPublicCorsHeaders } from '@/lib/apiAuth';

export async function GET(request) {
  try {
    await dbConnect();
    const settings = await Settings.getSiteSettings();
    const response = NextResponse.json(settings);
    return addPublicCorsHeaders(response, request);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  // Verify authentication
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();
    
    // Ensure we're updating the single settings document
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      // Update fields
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
