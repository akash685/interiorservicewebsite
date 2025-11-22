import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';

// Simple in-memory rate limiter
const rateLimit = new Map();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
    // Reset window
    rateLimit.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    // Timing-safe comparison
    const isUsernameValid = crypto.timingSafeEqual(
      Buffer.from(username),
      Buffer.from(adminUsername)
    );
    
    const isPasswordValid = crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(adminPassword)
    );

    if (isUsernameValid && isPasswordValid) {
      const secret = new TextEncoder().encode(jwtSecret);
      const alg = 'HS256';

      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg })
        .setExpirationTime('24h')
        .sign(secret);

      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
