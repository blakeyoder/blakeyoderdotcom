import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Satori has no system fonts. Asking for `serif` silently fell back to the one
 * face next/og bundles, which is sans-serif Noto at weight 400, so every social
 * preview for this serif-branded site rendered in the wrong typeface.
 *
 * The file URL under fonts.gstatic.com carries a version that changes over
 * time, so it is resolved through the CSS API rather than hardcoded.
 */
const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap";

const FONT_NAME = "EB Garamond";

/** Keeps a long title from overflowing the fixed 1200x630 frame. */
const MAX_TITLE = 90;
const MAX_SUBTITLE = 120;

function clamp(value: string, max: number): string {
  const trimmed = value.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}\u2026` : trimmed;
}

let fontPromise: Promise<ArrayBuffer | null> | null = null;

async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const cssResponse = await fetch(FONT_CSS_URL, {
      headers: {
        // Without a browser UA, Google returns woff2, which satori cannot read.
        "User-Agent": "Mozilla/5.0",
      },
    });
    if (!cssResponse.ok) return null;

    const css = await cssResponse.text();
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    const fontResponse = await fetch(url);
    if (!fontResponse.ok) return null;

    return await fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}

function loadFont(): Promise<ArrayBuffer | null> {
  fontPromise ??= fetchFont();
  return fontPromise;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("title") || "Blake Yoder", MAX_TITLE);
  const subtitle = clamp(
    searchParams.get("subtitle") || "me, online",
    MAX_SUBTITLE,
  );

  const fontData = await loadFont();
  const fontFamily = fontData ? FONT_NAME : "serif";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#f8f8f8",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontFamily,
          color: "#1a1a1a",
          lineHeight: 1.2,
          marginBottom: 20,
          maxWidth: "100%",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 32,
          fontFamily,
          color: "#666",
          lineHeight: 1.4,
          maxWidth: "100%",
        }}
      >
        {subtitle}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? {
            fonts: [
              {
                name: FONT_NAME,
                data: fontData,
                weight: 400 as const,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    },
  );
}
