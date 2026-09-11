/**
 * POST /api/contact - Handle contact form submissions
 * Server-side validation, spam prevention, and email sending
 */

import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";
import {
  checkRateLimit,
  consumeRateLimit,
  getClientIP,
} from "@/lib/rate-limit";

/** Generous ceiling; the message field itself is capped at 2000 characters. */
const MAX_BODY_BYTES = 64 * 1024;

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Request body is too large" },
        { status: 413 },
      );
    }

    // A malformed or non-JSON body is a client error, not a server fault.
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON" },
        { status: 400 },
      );
    }

    const payload = (body ?? {}) as Record<string, unknown>;

    // Honeypot check - if filled, silently reject (appears successful to bot)
    if (payload.honeypot) {
      console.log("Honeypot triggered - bot submission blocked");
      return NextResponse.json(
        { success: true, message: "Message sent successfully" },
        { status: 200 },
      );
    }

    // Validate BEFORE touching the rate limit, so a visitor who mistypes a
    // field is not locked out while correcting it.
    const validation = validateContactForm(payload);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fix the errors below",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const clientId = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientId);

    if (!rateLimitResult.allowed) {
      const waitMinutes = Math.max(
        1,
        Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000),
      );
      return NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please wait ${waitMinutes} minute${
            waitMinutes !== 1 ? "s" : ""
          } before trying again.`,
        },
        { status: 429 },
      );
    }

    // Send the normalized values, not the raw body.
    await sendContactEmail(validation.normalized);

    // Only a delivered message counts against the quota.
    consumeRateLimit(clientId);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}
