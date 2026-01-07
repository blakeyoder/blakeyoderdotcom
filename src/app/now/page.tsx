import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { StyledList, StyledListItem } from "@/components/StyledList";

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
    images: [
      "/og?title=Now&subtitle=What%20I%27m%20focused%20on%20right%20now",
    ],
  },
};

export default function Now() {
  return (
    <PageShell
      title="Now"
      subtitle="Updated November 2024"
      subtitleStyle="small-caps"
    >
      <section className="mb-12">
        <p className="text-xl leading-relaxed">
          After four years in the mountains of Western North Carolina, Amanda
          and I moved back to <strong>Brooklyn</strong> this year.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="small-caps text-base mb-6">Reading</h2>
        <StyledList>
          <StyledListItem>
            <a
              href="https://rickatkinson.com/british-are-coming/"
              target="_blank"
              rel="noopener noreferrer"
              className="italic"
            >
              The British Are Coming
            </a>
            <span className="text-text-secondary"> by Rick Atkinson</span>
          </StyledListItem>
          <StyledListItem>
            <a
              href="https://www.goodreads.com/book/show/10131648-the-greater-journey"
              target="_blank"
              rel="noopener noreferrer"
              className="italic"
            >
              The Greater Journey: Americans in Paris
            </a>
            <span className="text-text-secondary"> by David McCullough</span>
          </StyledListItem>
          <StyledListItem>
            <a
              href="https://en.wikipedia.org/wiki/One_Summer:_America,_1927"
              target="_blank"
              rel="noopener noreferrer"
              className="italic"
            >
              One Summer: America, 1927
            </a>
            <span className="text-text-secondary"> by Bill Bryson</span>
          </StyledListItem>
        </StyledList>
      </section>

      <section className="mb-12">
        <h2 className="small-caps text-base mb-6">Focusing On</h2>
        <p>
          My health. Loving the{" "}
          <a
            href="https://www.rayfit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent"
          >
            Rayfit
          </a>{" "}
          app.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="small-caps text-base mb-6">Thinking About</h2>
        <p>
          How belief is contagious—especially when it comes to building a team.
          The way conviction spreads (or doesn&apos;t) shapes what&apos;s
          possible.
        </p>
        <p>
          AI is being compared to the dot-com bubble, but we still have the
          internet. The genie is out of the bottle. What matters now is what we
          build with it.
        </p>
        <p>
          The role{" "}
          <a
            href="https://en.wikipedia.org/wiki/Mimetic_theory"
            target="_blank"
            rel="noopener noreferrer"
          >
            mimetic desire
          </a>{" "}
          plays in our lives—how much of what we want is truly ours, and how
          much is borrowed from others.
        </p>
        <p>
          How all roads lead back to relationships. Everything circles around
          eventually—it&apos;s better to build bridges than burn them.
        </p>
      </section>

      <hr className="rule" />

      <section className="pt-2">
        <p className="text-text-secondary text-[0.9375rem]">
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
    </PageShell>
  );
}
