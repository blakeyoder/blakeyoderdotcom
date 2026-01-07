import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { StyledList, StyledListItem } from "@/components/StyledList";

export const metadata: Metadata = {
  title: "About | Blake Yoder",
  description:
    "Engineering leader focused on the intersection of human systems and technical systems in healthcare technology.",
  openGraph: {
    title: "About Blake Yoder",
    description:
      "Engineering leader focused on the intersection of human systems and technical systems in healthcare technology.",
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
    description:
      "Engineering leader focused on the intersection of human systems and technical systems in healthcare technology.",
    images: [
      "/og?title=About&subtitle=Engineering%20leader%20focused%20on%20healthcare%20technology",
    ],
  },
};

export default function About() {
  return (
    <PageShell title="About">
      <section className="mb-12">
        <p className="text-xl leading-relaxed">
          I used to think expertise meant knowing more than everyone else in the
          room. Now I think it means knowing which questions to ask—and which
          tools extend your reach.
        </p>

        <p>
          I lead engineering in digital health, working the seam between human
          systems and technical systems—the place where elegant architecture
          meets messy reality, where tools succeed or fail based on the people
          holding them.
        </p>

        <p>
          Seven years taught me that technology is leverage, not destination.
          The real win isn&apos;t shipping code. It&apos;s making a meaningful
          difference for the humans on the other side.
        </p>

        <p>
          Recently, something shifted. I spent years believing I had to choose
          between deep technical work and leadership. That choice felt
          permanent. Then new tools cracked it open—and my own creativity,
          dormant for years, began to grow.
        </p>

        <p>
          What I&apos;m watching now: the rise of generalist leaders, the
          changing shape of expertise, the question of human agency in
          increasingly automated systems. Not as abstract debates—as things
          I&apos;m living through and building toward.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="small-caps text-base mb-6">
          People who shaped my thinking
        </h2>
        <StyledList>
          <StyledListItem>
            <a
              href="https://www.reboot.io/team/jerry-colonna/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jerry Colonna
            </a>
            <span className="text-text-secondary">
              {" "}
              taught me leadership starts with self-awareness.
            </span>
          </StyledListItem>
          <StyledListItem>
            <a
              href="https://www.onebreathcounseling.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Derek Rutter
            </a>
            <span className="text-text-secondary">
              {" "}
              showed me the best answer is a better question.
            </span>
          </StyledListItem>
          <StyledListItem>
            <a
              href="https://www.operatorpartners.com/team-gil-shklarski"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gil Shklarski
            </a>
            <span className="text-text-secondary">
              {" "}
              reminded me that scaling is about trust, not tech.
            </span>
          </StyledListItem>
        </StyledList>
      </section>

      <hr className="rule" />

      <section className="pt-2">
        <h2 className="small-caps text-base mb-4">Let&apos;s talk</h2>
        <p className="nav-links m-0 flex flex-wrap items-center">
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
    </PageShell>
  );
}
