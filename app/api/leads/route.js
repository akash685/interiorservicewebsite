import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { NextResponse } from 'next/server';
import { addPublicCorsHeaders } from '@/lib/apiAuth';
import { z } from 'zod';
import rateLimiter from '@/lib/rateLimit';

// Input validation schema
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Phone must be +91 followed by 10 digits'),
  service: z.string().optional(),
  message: z.string().max(1000, 'Message too long').optional(),
  location: z.string().optional(),
  sublocation: z.string().optional(),
  pageUrl: z.string().optional(),
});

export async function POST(request) {
  try {
    // Rate limiting - 10 requests per minute (whitelists search bots)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent');
    
    if (!rateLimiter.check(ip, 10, 60000, userAgent)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again in a minute.' 
        }, 
        { status: 429 }
      );
    }

    await dbConnect();
    const body = await request.json();

    // Validate input
    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error.issues[0].message 
        }, 
        { status: 400 }
      );
    }

    const lead = await Lead.create(result.data);

    const response = NextResponse.json({ success: true, data: lead }, { status: 201 });
    return addPublicCorsHeaders(response, request);
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
