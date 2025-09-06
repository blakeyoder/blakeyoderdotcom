import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import VimStatusBar from "../components/VimStatusBar";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "Blake Yoder",
  description: "Head of Engineering at Berry Street. Writing about technology, leadership, and building teams that scale.",
  openGraph: {
    title: "Blake Yoder",
    description: "Head of Engineering at Berry Street. Writing about technology, leadership, and building teams that scale.",
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
    description: "Head of Engineering at Berry Street. Writing about technology, leadership, and building teams that scale.",
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
      <body className={crimsonText.variable}>
        {children}
        <VimStatusBar />
      </body>
    </html>
  );
}
