import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { StyledList, StyledListItem } from "@/components/StyledList";
import { SITE_NAME, SITE_URL, ogImage } from "@/lib/site";

const description =
  "Blake Yoder works with small businesses on website rebuilds, automating manual operations, and putting AI to sensible use.";

export const metadata: Metadata = {
  title: "Howdy",
  description,
  alternates: { canonical: "/howdy" },
  openGraph: {
    title: `Howdy | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/howdy`,
    siteName: SITE_NAME,
    images: [
      {
        url: ogImage("Howdy", "What I do, and how to reach me"),
        width: 1200,
        height: 630,
        alt: `Howdy from ${SITE_NAME}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Howdy | ${SITE_NAME}`,
    description,
    images: [ogImage("Howdy", "What I do, and how to reach me")],
  },
};

const EMAIL = "yoderblake@gmail.com";

export default function Howdy() {
  return (
    <PageShell title="Howdy">
      <section className="mb-12">
        <p className="text-xl leading-relaxed">
          Here&apos;s where I&apos;m interested in spending my time.
        </p>
      </section>

      <hr className="rule" />

      <section className="mb-12 pt-4">
        <h2 className="small-caps text-base mb-6">What I help with</h2>

        <StyledList>
          <StyledListItem>
            <strong>Website redesigns and rebuilds.</strong> Most of the sites I
            work on were put together quickly a few years ago and no longer
            match the business behind them. I do the design and the engineering,
            so nothing gets lost in a handoff.
          </StyledListItem>

          <StyledListItem>
            <strong>
              Automating manual operations with AI-native workflows.
            </strong>{" "}
            Most teams have a handful of recurring tasks that eat hours every
            week. A spreadsheet someone updates by hand, a report that gets
            rebuilt from scratch every month. Those are usually straightforward
            to automate, and the time comes back immediately.
          </StyledListItem>

          <StyledListItem>
            <strong>Helping teams adopt AI.</strong> I work out which problems
            are worth using AI for, get your team comfortable enough to keep
            going without me, and tell you when AI is the wrong tool for the
            job.
          </StyledListItem>
        </StyledList>
      </section>

      <hr className="rule" />

      <section className="mb-12 pt-4">
        <h2 className="small-caps text-base mb-6">How I work</h2>

        <p>
          I like to start with a short conversation about what is actually
          slowing you down. That usually tells us both whether I can help, and I
          will say so if I can&apos;t. After that I would rather build something
          you can look at than write a proposal about it.
        </p>

        <p>
          Most of my last decade was spent in healthcare, helping scale digital
          health companies from Series A to over $250M in ARR. Working under
          that much regulation made me careful about where automation is a good
          idea and where it isn&apos;t.
        </p>
      </section>

      <hr className="rule-thick" />

      <section className="pt-4">
        <h2 className="text-xl mb-4">Want to chat?</h2>
        <p className="mb-8">
          Send me an email and tell me what you&apos;re working on.
        </p>

        <a href={`mailto:${EMAIL}`} className="btn btn-accent">
          Email me
        </a>
      </section>
    </PageShell>
  );
}
