import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import { NextResponse } from 'next/server';
import { verifyAdminAuth, addPublicCorsHeaders } from '@/lib/apiAuth';

export async function GET(request, { params }) {
  const { id } = await params;
  await dbConnect();
  try {
    const location = await Location.findById(id);
    if (!location) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }
    const response = NextResponse.json({ success: true, data: location });
    return addPublicCorsHeaders(response, request);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  // Verify authentication
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await dbConnect();
  try {
    const body = await request.json();
    const location = await Location.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!location) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  // Verify authentication
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await dbConnect();
  try {
    const deletedLocation = await Location.findByIdAndDelete(id);
    if (!deletedLocation) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
