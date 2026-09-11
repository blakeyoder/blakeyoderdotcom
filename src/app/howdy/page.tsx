import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { StyledList, StyledListItem } from "@/components/StyledList";
import { SITE_NAME, SITE_URL, ogImage } from "@/lib/site";

const description =
  "Blake Yoder helps teams rebuild their websites, automate manual operations with AI-native workflows, and adopt AI in ways that move the business.";

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
    <PageShell title="Howdy" subtitle="Here's what I do, and how to reach me.">
      <section className="mb-12">
        <p className="text-xl leading-relaxed">
          I spend my time where human systems and technical systems meet. That
          has meant scaling engineering teams through rapid growth, and it
          increasingly means helping companies put AI to work on the unglamorous
          parts of their business that actually cost them money.
        </p>

        <p>
          Most of the work falls into three buckets. Sometimes it&apos;s one of
          them. Often it starts as one and turns into another.
        </p>
      </section>

      <hr className="rule" />

      <section className="mb-12 pt-4">
        <h2 className="small-caps text-base mb-6">What I help with</h2>

        <StyledList>
          <StyledListItem>
            <strong>Website redesigns and rebuilds.</strong> Sites that have
            drifted away from the business they represent, or that were built
            fast and now need to be built properly. I handle the design
            direction and the engineering, so there is no handoff gap between
            the two.
          </StyledListItem>

          <StyledListItem>
            <strong>
              Automating manual operations with AI-native workflows.
            </strong>{" "}
            The spreadsheet someone maintains by hand every Friday. The inbox
            that gets triaged three times a day. The report that takes a person
            two hours and a lot of copy and paste. These are the places where AI
            pays for itself quickly, and where most teams have not looked yet.
          </StyledListItem>

          <StyledListItem>
            <strong>Helping teams adopt AI for real business value.</strong> Not
            a tool rollout and not a pilot that quietly dies. Figuring out which
            problems are worth pointing AI at, getting the team fluent enough to
            keep going without me, and being honest about the places it will not
            help.
          </StyledListItem>
        </StyledList>
      </section>

      <hr className="rule" />

      <section className="mb-12 pt-4">
        <h2 className="small-caps text-base mb-6">How I work</h2>

        <p>
          I like starting small and concrete. A short conversation about what is
          actually slowing you down usually tells us both whether there is a
          good fit, and I will say so if there is not. From there the work tends
          to move fast, because I would rather ship something you can react to
          than write a deck about it.
        </p>

        <p>
          Nearly a decade of this has been in healthcare, most recently helping
          scale{" "}
          <a
            href="https://thirtymadison.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thirty Madison
          </a>{" "}
          from Series A to over $250M in ARR. Regulated, high-stakes
          environments taught me to be careful about where automation belongs
          and where it does not.
        </p>
      </section>

      <hr className="rule-thick" />

      <section className="pt-4">
        <h2 className="text-xl mb-4">Want to chat?</h2>
        <p className="mb-8">
          Send me an email and tell me what you&apos;re working on. I read
          everything and reply to anything that isn&apos;t a pitch.
        </p>

        <a href={`mailto:${EMAIL}`} className="btn btn-accent">
          Email me
        </a>

        <p className="mt-6 text-text-secondary text-sm mb-0">
          Or copy it down:{" "}
          <a href={`mailto:${EMAIL}`} className="mono">
            {EMAIL}
          </a>
        </p>
      </section>
    </PageShell>
  );
}
