/**
 * GET /api/linkedin-preview - Fetch LinkedIn profile metadata
 * Uses Open Graph meta tags to get profile information
 */

import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  consumeRateLimit,
  getClientIP,
} from "@/lib/rate-limit";

/** LinkedIn interstitial HTML is large; stop reading well before it hurts. */
const MAX_HTML_BYTES = 512 * 1024;
const FETCH_TIMEOUT_MS = 5000;
/** The form fetches a preview as the user types, so this is far looser than
 *  the submission quota, but still bounded. */
const PREVIEW_LIMIT = { max: 30, windowMs: 60_000 };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  // Validate it's a LinkedIn URL
  const linkedInPattern =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  if (!linkedInPattern.test(url)) {
    return NextResponse.json(
      { error: "Invalid LinkedIn URL" },
      { status: 400 },
    );
  }

  // This route makes an outbound request on the caller's behalf, so it needs
  // its own throttle. Keyed separately from the contact form quota.
  const clientId = `preview:${getClientIP(request.headers)}`;
  if (!checkRateLimit(clientId, PREVIEW_LIMIT).allowed) {
    return NextResponse.json(
      { error: "Too many preview requests" },
      { status: 429 },
    );
  }
  consumeRateLimit(clientId, PREVIEW_LIMIT);

  try {
    // Fetch the LinkedIn page with proper headers to avoid being blocked
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    // Redirects are followed, so confirm we did not end up off-host.
    if (!isLinkedInUrl(response.url)) {
      throw new Error("LinkedIn redirected off-host");
    }

    if (!response.ok) {
      console.error(
        "LinkedIn fetch failed:",
        response.status,
        response.statusText,
      );
      throw new Error("Failed to fetch LinkedIn profile");
    }

    const html = await readCapped(response, MAX_HTML_BYTES);

    // Extract Open Graph and Twitter meta tags
    const name =
      extractMetaTag(html, "og:title") || extractMetaTag(html, "twitter:title");
    const headline =
      extractMetaTag(html, "og:description") ||
      extractMetaTag(html, "twitter:description");
    const imageUrl =
      extractMetaTag(html, "og:image") ||
      extractMetaTag(html, "twitter:image") ||
      extractMetaTag(html, "twitter:image:src");

    return NextResponse.json({
      name: cleanText(name),
      headline: cleanText(headline),
      imageUrl: cleanText(imageUrl),
    });
  } catch (error) {
    console.error("LinkedIn preview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile preview" },
      { status: 500 },
    );
  }
}

/**
 * True when the URL is on linkedin.com. Empty/relative values are rejected.
 */
function isLinkedInUrl(value: string): boolean {
  if (!value) return true; // some runtimes leave response.url empty
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === "linkedin.com" || host.endsWith(".linkedin.com");
  } catch {
    return false;
  }
}

/**
 * Extract meta tag content from HTML
 */
function extractMetaTag(html: string, property: string): string | null {
  // Try property attribute (Open Graph)
  const propertyRegex = new RegExp(
    `<meta\\s+property=["']${escapeRegex(property)}["']\\s+content=["']([^"']+)["']`,
    "i",
  );
  const propertyMatch = html.match(propertyRegex);
  if (propertyMatch) return propertyMatch[1];

  // Try name attribute (Twitter)
  const nameRegex = new RegExp(
    `<meta\\s+name=["']${escapeRegex(property)}["']\\s+content=["']([^"']+)["']`,
    "i",
  );
  const nameMatch = html.match(nameRegex);
  if (nameMatch) return nameMatch[1];

  // Try reversed order (content before property/name)
  const reversedPropertyRegex = new RegExp(
    `<meta\\s+content=["']([^"']+)["']\\s+property=["']${escapeRegex(property)}["']`,
    "i",
  );
  const reversedPropertyMatch = html.match(reversedPropertyRegex);
  if (reversedPropertyMatch) return reversedPropertyMatch[1];

  const reversedNameRegex = new RegExp(
    `<meta\\s+content=["']([^"']+)["']\\s+name=["']${escapeRegex(property)}["']`,
    "i",
  );
  const reversedNameMatch = html.match(reversedNameRegex);
  if (reversedNameMatch) return reversedNameMatch[1];

  return null;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Clean extracted text (decode HTML entities, trim)
 */
function cleanText(text: string | null): string | undefined {
  if (!text) return undefined;

  // Decode common HTML entities
  // &amp; is decoded last so "&amp;lt;" does not turn into "<".
  const decoded = text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

  return decoded.trim();
}

/**
 * Reads a response body up to a byte ceiling, so an unexpectedly huge page
 * cannot balloon function memory.
 */
async function readCapped(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let received = 0;
  let out = "";

  while (received < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    out += decoder.decode(value, { stream: true });
  }

  await reader.cancel().catch(() => {});
  return out;
}
