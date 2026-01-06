import type { Metadata } from "next";
import { EB_Garamond, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import VimStatusBar from "../components/VimStatusBar";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blakeyoder.com"),
  title: "Blake Yoder",
  description:
    "Engineering leader. Writing about technology, leadership, and building teams that scale.",
  openGraph: {
    title: "Blake Yoder",
    description:
      "Engineering leader. Writing about technology, leadership, and building teams that scale.",
    url: "https://blakeyoder.com",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/og?title=Blake%20Yoder",
        width: 1200,
        height: 630,
        alt: "Blake Yoder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blake Yoder",
    description:
      "Engineering leader. Writing about technology, leadership, and building teams that scale.",
    images: ["/og?title=Blake%20Yoder"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ebGaramond.variable} ${sourceSerif.variable} ${ibmPlexMono.variable}`}
      >
        {children}
        <VimStatusBar />
      </body>
    </html>
  );
}
