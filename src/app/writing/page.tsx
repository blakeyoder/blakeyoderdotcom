import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { StyledList, StyledListItem } from "@/components/StyledList";

export const metadata: Metadata = {
  title: "Writing | Blake Yoder",
  description:
    "Essays on technology, leadership, and the human systems that make or break great teams.",
  openGraph: {
    title: "Writing by Blake Yoder",
    description:
      "Essays on technology, leadership, and the human systems that make or break great teams.",
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
    description:
      "Essays on technology, leadership, and the human systems that make or break great teams.",
    images: [
      "/og?title=Writing&subtitle=Essays%20on%20technology%20and%20leadership",
    ],
  },
};

export default function Writing() {
  return (
    <PageShell
      title="Writing"
      subtitle="Essays on technology, leadership, and the human systems that make or break great teams."
    >
      <section>
        <ArticleCard
          date="December 4, 2025"
          title="Slop Might Save Your Startup"
          href="/writing/slop-might-save-your-startup"
          subtitle="Speed is the only moat that matters—until it isn't."
          excerpt="In early-stage startups, shipping fast isn't just important—it's the only sustainable competitive advantage you have. AI is fundamentally altering the cost structure of technical debt."
        />

        <ArticleCard
          date="November 28, 2025"
          title="What AI Won't Fix"
          href="/writing/what-ai-wont-fix"
          subtitle="Everyone's obsessing over what AI changes. The more interesting question: what doesn't it change at all?"
          excerpt='Slop, side-quests, and skipped learning existed long before ChatGPT. AI is a lever that amplifies whatever force you apply—the question was never "Will AI write good code?" but "Will you?"'
        />

        <ArticleCard
          date="September 11, 2025"
          title="When AI Gets Your Types Wrong"
          href="/writing/when-ai-gets-your-types-wrong"
          subtitle="A Pragmatic Solution"
          excerpt="How I built a TypeScript definitions MCP server to help AI tools understand and mock complex types correctly, turning a testing frustration into a practical solution."
        />

        <ArticleCard
          date="September 6, 2025"
          title="The Rise of Generalist Leaders"
          href="/writing/the-rise-of-generalist-leaders"
          subtitle="How Agentic Tools Are Reshaping Engineering Leadership"
          excerpt="How agentic tools are democratizing technical capability and reshaping engineering leadership, creating organizations led by generalists who synthesize across domains."
        />
      </section>

      <hr className="rule mt-12" />

      <section className="pt-4">
        <h2 className="text-xl mb-6">What I&apos;m thinking about</h2>
        <StyledList variant="sidebar">
          <StyledListItem>
            How do we maintain system understanding when AI writes more of our
            code? Hard-won insights came with well-fought battles, not just
            reading the code.
          </StyledListItem>
          <StyledListItem>
            LLMs are like water—they dilute everything they touch. How do we
            create concentrated inputs? Dilute orange juice is gross. Dilute
            orange juice concentrate is good enough.
          </StyledListItem>
          <StyledListItem>
            Building an autonomous business (or at least a business of one)?
          </StyledListItem>
          <StyledListItem>
            How do we build differentiated products when the ability to build
            approaches zero?
          </StyledListItem>
        </StyledList>
      </section>
    </PageShell>
  );
}
