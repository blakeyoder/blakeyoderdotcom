/**
 * Canonical site origin.
 *
 * The apex redirects to www, so www is the canonical host. Pointing metadata
 * at the apex made every Open Graph image URL resolve to a 307, which some
 * social scrapers will not follow when fetching an image.
 */
export const SITE_URL = "https://www.blakeyoder.com";

export const SITE_NAME = "Blake Yoder";

export const SITE_DESCRIPTION =
  "Engineering leader working at the intersection of technology, teams, and business outcomes.";

/** Builds an absolute Open Graph image URL for a page. */
export function ogImage(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  return `${SITE_URL}/og?${params.toString()}`;
}
