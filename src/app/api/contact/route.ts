/**
 * POST /api/contact - Handle contact form submissions
 * Server-side validation, spam prevention, and email sending
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm } from '@/lib/validation';
import { sendContactEmail } from '@/lib/email';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { checkForSpam } from '@/lib/spam-detection';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Honeypot check - if filled, silently reject (appears successful to bot)
    if (body.honeypot) {
      console.log('Honeypot triggered - bot submission blocked');
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    }

    // Rate limiting check
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      const waitMinutes = Math.ceil(
        (rateLimitResult.resetTime - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please wait ${waitMinutes} minute${
            waitMinutes !== 1 ? 's' : ''
          } before trying again.`,
        },
        { status: 429 }
      );
    }

    // Validate form data
    const validation = validateContactForm({
      name: body.name || '',
      email: body.email || '',
      linkedin: body.linkedin || '',
      message: body.message || '',
    });

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fix the errors below',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Spam detection check
    const spamCheck = checkForSpam(body.message);
    if (spamCheck.isSpam) {
      console.log('Spam detected:', spamCheck.reason);
      return NextResponse.json(
        {
          success: false,
          message:
            'Your message was flagged as potential spam. Please remove any excessive links or promotional content and try again.',
        },
        { status: 400 }
      );
    }

    // Send email
    await sendContactEmail({
      name: body.name,
      email: body.email,
      linkedin: body.linkedin,
      message: body.message,
    });

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Return 405 for non-POST requests
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
