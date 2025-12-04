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
      <header style={{ marginBottom: "2rem" }}>
        <p className="small-caps" style={{ marginBottom: "0.75rem" }}>
          <Link href="/" className="nav-link">Blake Yoder</Link>
        </p>
        <h1 style={{ marginBottom: "1rem" }}>Writing</h1>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Essays on technology, leadership, and the human systems that make or break great teams.
        </p>
      </header>

      <hr className="rule-thick" />

      <main>
        <section>
          <article className="article-card">
            <p className="article-date">December 4, 2025</p>
            <h2 className="article-title">
              <Link href="/writing/slop-might-save-your-startup">
                Slop Might Save Your Startup
              </Link>
            </h2>
            <p className="article-subtitle">Speed is the only moat that matters—until it isn&apos;t.</p>
            <p className="article-excerpt">
              In early-stage startups, shipping fast isn&apos;t just important—it&apos;s the only sustainable competitive advantage you have. AI is fundamentally altering the cost structure of technical debt.
            </p>
          </article>

          <article className="article-card">
            <p className="article-date">November 28, 2025</p>
            <h2 className="article-title">
              <Link href="/writing/what-ai-wont-fix">
                What AI Won&apos;t Fix
              </Link>
            </h2>
            <p className="article-subtitle">Everyone&apos;s obsessing over what AI changes. The more interesting question: what doesn&apos;t it change at all?</p>
            <p className="article-excerpt">
              Slop, side-quests, and skipped learning existed long before ChatGPT. AI is a lever that amplifies whatever force you apply—the question was never &quot;Will AI write good code?&quot; but &quot;Will you?&quot;
            </p>
          </article>

          <article className="article-card">
            <p className="article-date">September 11, 2025</p>
            <h2 className="article-title">
              <Link href="/writing/when-ai-gets-your-types-wrong">
                When AI Gets Your Types Wrong
              </Link>
            </h2>
            <p className="article-subtitle">A Pragmatic Solution</p>
            <p className="article-excerpt">
              How I built a TypeScript definitions MCP server to help AI tools understand and mock complex types correctly, turning a testing frustration into a practical solution.
            </p>
          </article>

          <article className="article-card">
            <p className="article-date">September 6, 2025</p>
            <h2 className="article-title">
              <Link href="/writing/the-rise-of-generalist-leaders">
                The Rise of Generalist Leaders
              </Link>
            </h2>
            <p className="article-subtitle">How Agentic Tools Are Reshaping Engineering Leadership</p>
            <p className="article-excerpt">
              How agentic tools are democratizing technical capability and reshaping engineering leadership, creating organizations led by generalists who synthesize across domains.
            </p>
          </article>
        </section>

        <hr className="rule" style={{ marginTop: "3rem" }} />

        <section style={{ paddingTop: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>What I&apos;m thinking about</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{
              paddingLeft: "1rem",
              borderLeft: "2px solid var(--rule)",
              marginBottom: "1.25rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}>
              How do we maintain system understanding when AI writes more of our code? Hard-won insights came with well-fought battles, not just reading the code.
            </li>
            <li style={{
              paddingLeft: "1rem",
              borderLeft: "2px solid var(--rule)",
              marginBottom: "1.25rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}>
              LLMs are like water—they dilute everything they touch. How do we create concentrated inputs? Dilute orange juice is gross. Dilute orange juice concentrate is good enough.
            </li>
            <li style={{
              paddingLeft: "1rem",
              borderLeft: "2px solid var(--rule)",
              marginBottom: "1.25rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}>
              Building an autonomous business (or at least a business of one)?
            </li>
            <li style={{
              paddingLeft: "1rem",
              borderLeft: "2px solid var(--rule)",
              marginBottom: "0",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}>
              How do we build differentiated products when the ability to build approaches zero?
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
