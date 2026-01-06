import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks | Blake Yoder",
  description:
    "A curated collection of engineering leadership, technical practices, and career development resources I've saved over the years.",
  openGraph: {
    title: "Bookmarks by Blake Yoder",
    description:
      "A curated collection of engineering leadership, technical practices, and career development resources I've saved over the years.",
    url: "https://blakeyoder.com/bookmarks",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/og?title=Bookmarks&subtitle=Curated%20resources%20for%20engineering%20leaders",
        width: 1200,
        height: 630,
        alt: "Bookmarks by Blake Yoder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmarks by Blake Yoder",
    description:
      "A curated collection of engineering leadership, technical practices, and career development resources I've saved over the years.",
    images: [
      "/og?title=Bookmarks&subtitle=Curated%20resources%20for%20engineering%20leaders",
    ],
  },
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
