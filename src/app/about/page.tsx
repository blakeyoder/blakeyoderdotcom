import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Blake Yoder",
  description: "Engineering leader focused on the intersection of human systems and technical systems in healthcare technology.",
  openGraph: {
    title: "About Blake Yoder",
    description: "Engineering leader focused on the intersection of human systems and technical systems in healthcare technology.",
    url: "https://blakeyoder.com/about",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/og?title=About&subtitle=Engineering%20leader%20focused%20on%20healthcare%20technology",
        width: 1200,
        height: 630,
        alt: "About Blake Yoder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Blake Yoder",
    description: "Engineering leader focused on the intersection of human systems and technical systems in healthcare technology.",
    images: ["/og?title=About&subtitle=Engineering%20leader%20focused%20on%20healthcare%20technology"],
  },
};

export default function About() {
  return (
    <div className="container">
      <header style={{ marginBottom: "2rem" }}>
        <p className="small-caps" style={{ marginBottom: "0.75rem" }}>
          <Link href="/" className="nav-link">Blake Yoder</Link>
        </p>
        <h1>About</h1>
      </header>

      <hr className="rule-thick" />

      <main>
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "1.25rem", lineHeight: 1.65 }}>
            I&apos;m an engineering leader building technology that connects patients with registered dietitians. After nearly seven years in digital health, one thing&apos;s clear: the most interesting problems—and the most important ones—live at the messy intersection of human systems and technical systems.
          </p>

          <p>
            Previously, I helped scale teams and technology through hyper-growth. Along the way, I learned that tools are only as effective as the people using them. That belief shapes everything I do—whether I&apos;m designing system architecture, structuring a team, or exploring how AI can make healthcare more human, not less.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }} className="small-caps">Influences</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{
              paddingBottom: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid var(--rule)"
            }}>
              <a
                href="https://www.reboot.io/team/jerry-colonna/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jerry Colonna
              </a>
              <span style={{ color: "var(--text-secondary)" }}>, whom I&apos;ve never met, taught me that leadership starts with self-awareness.</span>
            </li>
            <li style={{
              paddingBottom: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid var(--rule)"
            }}>
              <a
                href="https://www.onebreathcounseling.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Derek Rutter
              </a>
              <span style={{ color: "var(--text-secondary)" }}> showed me that the best answer is a better question.</span>
            </li>
            <li>
              <a
                href="https://www.operatorpartners.com/team-gil-shklarski"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gil Shklarski
              </a>
              <span style={{ color: "var(--text-secondary)" }}> reminded me that scaling an organization is more about trust than it is about tech.</span>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }} className="small-caps">Philosophy</h2>
          <p>
            Great engineering teams run on three things: deep technical skill, clear communication, and genuine care for the problem. Technology should be leverage, not the destination. The real win isn&apos;t shipping code—it&apos;s making a meaningful difference for the humans on the other side of the screen.
          </p>

          <p>
            Outside of work, I&apos;m often thinking about macro trends and their second-order effects. How will AI change how we think about expertise? How do we keep human agency alive in increasingly automated systems? These aren&apos;t just tech questions—they&apos;re questions about the kind of future we&apos;re building together.
          </p>
        </section>

        <hr className="rule" />

        <section style={{ paddingTop: "0.5rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }} className="small-caps">Get in touch</h2>
          <p style={{ margin: 0 }}>
            <a href="mailto:me@blakeyoder.com">me@blakeyoder.com</a>
            <span className="nav-divider">|</span>
            <a
              href="https://www.linkedin.com/in/blakeyoder/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
