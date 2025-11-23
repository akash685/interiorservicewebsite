import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import Location from '@/models/Location'; // Ensure Location model is registered
import { NextResponse } from 'next/server';
import { verifyAdminAuth, addPublicCorsHeaders } from '@/lib/apiAuth';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get('published') === 'true';
  const limit = parseInt(searchParams.get('limit')) || 0;

  try {
    const query = publishedOnly ? { isPublished: true } : {};
    
    let blogsQuery = Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate('locations', 'name slug');
      
    if (limit > 0) {
      const page = parseInt(searchParams.get('page')) || 1;
      const skip = (page - 1) * limit;
      blogsQuery = blogsQuery.skip(skip).limit(limit);
    }

    const blogs = await blogsQuery.exec();
    const total = await Blog.countDocuments(query);

    const response = NextResponse.json({ 
      success: true, 
      data: blogs,
      pagination: {
        total,
        page: parseInt(searchParams.get('page')) || 1,
        limit,
        pages: limit > 0 ? Math.ceil(total / limit) : 1
      }
    });
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
    
    // If publishing now, set publishedAt if not set
    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = await Blog.create(body);
    
    // Revalidate paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin');
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
