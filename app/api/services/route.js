import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { verifyAdminAuth, addPublicCorsHeaders } from '@/lib/apiAuth';

// GET all services with pagination
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 0; // 0 means all

    let query = Service.find({}).sort({ createdAt: -1 });
    
    if (limit > 0) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const services = await query.exec();
    const total = await Service.countDocuments({});

    const response = NextResponse.json({ 
      success: true, 
      data: services,
      pagination: {
        total,
        page,
        limit,
        pages: limit > 0 ? Math.ceil(total / limit) : 1
      }
    });
    
    return addPublicCorsHeaders(response, request);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new service
export async function POST(request) {
  // Verify authentication
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);
    
    // Revalidate paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin');
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
