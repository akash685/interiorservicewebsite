import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params;
  await dbConnect();
  try {
    const blog = await Blog.findByIdAndUpdate(
      id, 
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, views: blog.views });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
