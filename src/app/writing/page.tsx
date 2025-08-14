import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing | Blake Yoder",
  description: "Essays on technology, leadership, and the human systems that make or break great teams.",
  openGraph: {
    title: "Writing by Blake Yoder",
    description: "Essays on technology, leadership, and the human systems that make or break great teams.",
    url: "https://blakeyoder.com/writing",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/og?title=Writing&subtitle=Essays%20on%20technology%20and%20leadership",
        width: 1200,
        height: 630,
        alt: "Writing by Blake Yoder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing by Blake Yoder",
    description: "Essays on technology, leadership, and the human systems that make or break great teams.",
    images: ["/og?title=Writing&subtitle=Essays%20on%20technology%20and%20leadership"],
  },
};

export default function Writing() {
  return (
    <div className="container">
      <header>
        <h1>Writing</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          <Link href="/">← Back to home</Link>
        </p>
      </header>

      <main>
        <p>
          Essays on technology, leadership, and the human systems that make or break great teams.
        </p>

        <div style={{ marginTop: '3rem' }}>
          <h2>Coming Soon</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            I&apos;m working on my first few essays. They will be published here soon. 
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3>What I&apos;m thinking about:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              • How do we maintain system understanding when AI writes more of our code? Hard-won insights came with well-fought battles, not just reading the code. This feels like it matters now but will it mater later (in a few years)?
            </li>
            <li style={{ marginBottom: '1rem' }}>
              • LLMs are like water, they dilute everything they touch. How do we create concentrated inputs. Dilute orange juice = gross. Dilute orange juice concentrate = good enough.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              • Building an autonomous business (or atleast a business of 1)? 
            </li>
            <li style={{ marginBottom: '1rem' }}>
              • How do we build differentiated products when the ability to build approaches zero?
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
