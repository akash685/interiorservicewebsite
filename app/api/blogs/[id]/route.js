import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import Location from '@/models/Location'; // Ensure Location model is registered
import { NextResponse } from 'next/server';
import { verifyAdminAuth, addPublicCorsHeaders } from '@/lib/apiAuth';

export async function GET(request, { params }) {
  const { id } = await params;
  await dbConnect();
  try {
    const blog = await Blog.findById(id).populate('locations', 'name slug');
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    const response = NextResponse.json({ success: true, data: blog });
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
    
    // Handle publishing date logic
    if (body.isPublished === true) {
      const currentBlog = await Blog.findById(id);
      if (currentBlog && !currentBlog.isPublished && !body.publishedAt) {
        body.publishedAt = new Date();
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('locations', 'name slug');

    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    // Revalidate paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin');
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, data: blog });
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
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    // Revalidate paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin');
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
