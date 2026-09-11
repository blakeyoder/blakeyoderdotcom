import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, ogImage } from "@/lib/site";

const description =
  "Get in touch with Blake Yoder about engineering leadership, AI adoption, or coffee in NYC.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    images: [
      {
        url: ogImage("Contact", "Say hello"),
        width: 1200,
        height: 630,
        alt: `Contact ${SITE_NAME}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${SITE_NAME}`,
    description,
    images: [ogImage("Contact", "Say hello")],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
