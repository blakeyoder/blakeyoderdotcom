import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now | Blake Yoder",
  description: "What I'm focused on right now.",
  openGraph: {
    title: "Now | Blake Yoder",
    description: "What I'm focused on right now.",
    url: "https://blakeyoder.com/now",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/og?title=Now&subtitle=What%20I%27m%20focused%20on%20right%20now",
        width: 1200,
        height: 630,
        alt: "Now - Blake Yoder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Now | Blake Yoder",
    description: "What I'm focused on right now.",
    images: ["/og?title=Now&subtitle=What%20I%27m%20focused%20on%20right%20now"],
  },
};

export default function Now() {
  return (
    <div className="container">
      <header style={{ marginBottom: "2rem" }}>
        <p className="small-caps" style={{ marginBottom: "0.75rem" }}>
          <Link href="/" className="nav-link">Blake Yoder</Link>
        </p>
        <h1>Now</h1>
        <p className="small-caps" style={{ marginTop: "0.5rem", marginBottom: 0 }}>
          Updated November 2024
        </p>
      </header>

      <hr className="rule-thick" />

      <main>
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "1.25rem", lineHeight: 1.65 }}>
            After four years in the mountains of Western North Carolina, Amanda and I moved back to <strong>Brooklyn</strong> this year.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }} className="small-caps">Reading</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{
              paddingBottom: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid var(--rule)"
            }}>
              <a
                href="https://rickatkinson.com/british-are-coming/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontStyle: "italic" }}
              >
                The British Are Coming
              </a>
              <span style={{ color: "var(--text-secondary)" }}> by Rick Atkinson</span>
            </li>
            <li style={{
              paddingBottom: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid var(--rule)"
            }}>
              <a
                href="https://www.goodreads.com/book/show/10131648-the-greater-journey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontStyle: "italic" }}
              >
                The Greater Journey: Americans in Paris
              </a>
              <span style={{ color: "var(--text-secondary)" }}> by David McCullough</span>
            </li>
            <li>
              <a
                href="https://en.wikipedia.org/wiki/One_Summer:_America,_1927"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontStyle: "italic" }}
              >
                One Summer: America, 1927
              </a>
              <span style={{ color: "var(--text-secondary)" }}> by Bill Bryson</span>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }} className="small-caps">Focusing On</h2>
          <p>
            My health. Loving the{" "}
            <a
              href="https://www.rayfit.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", textDecorationColor: "var(--accent)" }}
            >
              Rayfit
            </a>
            {" "}app.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }} className="small-caps">Thinking About</h2>
          <p>
            How belief is contagious—especially when it comes to building a team. The way conviction spreads (or doesn&apos;t) shapes what&apos;s possible.
          </p>
          <p>
            AI is being compared to the dot-com bubble, but we still have the internet. The genie is out of the bottle. What matters now is what we build with it.
          </p>
          <p>
            The role{" "}
            <a
              href="https://en.wikipedia.org/wiki/Mimetic_theory"
              target="_blank"
              rel="noopener noreferrer"
            >
              mimetic desire
            </a>
            {" "}plays in our lives—how much of what we want is truly ours, and how much is borrowed from others.
          </p>
          <p>
            How all roads lead back to relationships. Everything circles around eventually—it&apos;s better to build bridges than burn them.
          </p>
        </section>

        <hr className="rule" />

        <section style={{ paddingTop: "0.5rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
            This is a{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              now page
            </a>
            . If you have your own site, you should make one too.
          </p>
        </section>
      </main>
    </div>
  );
}
