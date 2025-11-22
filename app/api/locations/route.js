import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import { NextResponse } from 'next/server';
import { verifyAdminAuth, addPublicCorsHeaders } from '@/lib/apiAuth';

export async function GET(request) {
  await dbConnect();
  try {
    const locations = await Location.find({}).sort({ createdAt: -1 });
    const response = NextResponse.json({ success: true, data: locations });
    return addPublicCorsHeaders(response, request);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  // Verify authentication
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  await dbConnect();
  try {
    const body = await request.json();
    const location = await Location.create(body);
    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
