/**
 * GET /api/linkedin-preview - Fetch LinkedIn profile metadata
 * Uses Open Graph meta tags to get profile information
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Validate it's a LinkedIn URL
  const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  if (!linkedInPattern.test(url)) {
    return NextResponse.json(
      { error: 'Invalid LinkedIn URL' },
      { status: 400 }
    );
  }

  try {
    // Fetch the LinkedIn page with proper headers to avoid being blocked
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      console.error('LinkedIn fetch failed:', response.status, response.statusText);
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const html = await response.text();

    // Log first 1000 chars for debugging
    console.log('LinkedIn HTML preview:', html.substring(0, 1000));

    // Extract Open Graph and Twitter meta tags
    const name = extractMetaTag(html, 'og:title') || extractMetaTag(html, 'twitter:title');
    const headline = extractMetaTag(html, 'og:description') || extractMetaTag(html, 'twitter:description');
    const imageUrl = extractMetaTag(html, 'og:image') ||
                     extractMetaTag(html, 'twitter:image') ||
                     extractMetaTag(html, 'twitter:image:src');

    console.log('Extracted data:', { name, headline, imageUrl });

    return NextResponse.json({
      name: cleanText(name),
      headline: cleanText(headline),
      imageUrl: cleanText(imageUrl),
    });
  } catch (error) {
    console.error('LinkedIn preview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile preview' },
      { status: 500 }
    );
  }
}

/**
 * Extract meta tag content from HTML
 */
function extractMetaTag(html: string, property: string): string | null {
  // Try property attribute (Open Graph)
  const propertyRegex = new RegExp(
    `<meta\\s+property=["']${escapeRegex(property)}["']\\s+content=["']([^"']+)["']`,
    'i'
  );
  const propertyMatch = html.match(propertyRegex);
  if (propertyMatch) return propertyMatch[1];

  // Try name attribute (Twitter)
  const nameRegex = new RegExp(
    `<meta\\s+name=["']${escapeRegex(property)}["']\\s+content=["']([^"']+)["']`,
    'i'
  );
  const nameMatch = html.match(nameRegex);
  if (nameMatch) return nameMatch[1];

  // Try reversed order (content before property/name)
  const reversedPropertyRegex = new RegExp(
    `<meta\\s+content=["']([^"']+)["']\\s+property=["']${escapeRegex(property)}["']`,
    'i'
  );
  const reversedPropertyMatch = html.match(reversedPropertyRegex);
  if (reversedPropertyMatch) return reversedPropertyMatch[1];

  const reversedNameRegex = new RegExp(
    `<meta\\s+content=["']([^"']+)["']\\s+name=["']${escapeRegex(property)}["']`,
    'i'
  );
  const reversedNameMatch = html.match(reversedNameRegex);
  if (reversedNameMatch) return reversedNameMatch[1];

  return null;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Clean extracted text (decode HTML entities, trim)
 */
function cleanText(text: string | null): string | undefined {
  if (!text) return undefined;

  // Decode common HTML entities
  const decoded = text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

  return decoded.trim();
}
