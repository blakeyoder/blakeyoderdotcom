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
          <h2>Recent Essays</h2>
          
          <article style={{ 
            marginBottom: '4rem', 
            paddingBottom: '2rem', 
            borderBottom: '1px solid var(--border-color)' 
          }}>
            <header style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>
                <Link href="/writing/the-rise-of-generalist-leaders" style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-primary)',
                  transition: 'color 0.2s ease'
                }}>
                  The Rise of Generalist Leaders
                </Link>
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '1.1rem', 
                fontWeight: '400', 
                margin: '0 0 0.75rem' 
              }}>
                How Agentic Tools Are Reshaping Engineering Leadership
              </p>
              <time style={{ 
                color: 'var(--text-tertiary)', 
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                September 6, 2025
              </time>
            </header>
            <p style={{ marginBottom: '1.5rem' }}>
              How agentic tools are democratizing technical capability and reshaping engineering leadership, creating organizations led by generalists who synthesize across domains.
            </p>
            <Link 
              href="/writing/the-rise-of-generalist-leaders" 
              style={{ 
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--text-primary)',
                paddingBottom: '2px',
                transition: 'all 0.2s ease'
              }}
            >
              Read essay →
            </Link>
          </article>
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
