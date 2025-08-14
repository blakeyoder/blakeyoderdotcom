import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On Vim | Blake Yoder",
  description: "Interactive vim tutorial and my journey learning vim over 10 years. Try vim mode right in the browser.",
  openGraph: {
    title: "On Vim by Blake Yoder",
    description: "Interactive vim tutorial and my journey learning vim over 10 years. Try vim mode right in the browser.",
    url: "https://blakeyoder.com/vim",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/og?title=On%20Vim&subtitle=Interactive%20vim%20tutorial%20and%20journey",
        width: 1200,
        height: 630,
        alt: "On Vim by Blake Yoder",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "On Vim by Blake Yoder",
    description: "Interactive vim tutorial and my journey learning vim over 10 years. Try vim mode right in the browser.",
    images: ["/og?title=On%20Vim&subtitle=Interactive%20vim%20tutorial%20and%20journey"],
  },
};

export default function VimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}