import Link from "next/link";
import type { Metadata } from "next";
import { ArticleHeaderImage } from "@/components/ArticleHeaderImage";

export const metadata: Metadata = {
  title: "The Rise of Generalist Leaders | Blake Yoder",
  description:
    "How agentic tools are democratizing technical capability and reshaping engineering leadership, creating organizations led by generalists who synthesize across domains.",
  openGraph: {
    title:
      "The Rise of Generalist Leaders: How Agentic Tools Are Reshaping Engineering Leadership",
    description:
      "How agentic tools are democratizing technical capability and reshaping engineering leadership, creating organizations led by generalists who synthesize across domains.",
    url: "https://blakeyoder.com/writing/the-rise-of-generalist-leaders",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/the-rise-of-generalist-leaders.png",
        width: 1200,
        height: 630,
        alt: "The Rise of Generalist Leaders: How Agentic Tools Are Reshaping Engineering Leadership",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-09-06T00:00:00.000Z",
    authors: ["Blake Yoder"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "The Rise of Generalist Leaders: How Agentic Tools Are Reshaping Engineering Leadership",
    description:
      "How agentic tools are democratizing technical capability and reshaping engineering leadership, creating organizations led by generalists who synthesize across domains.",
    images: ["/the-rise-of-generalist-leaders.png"],
  },
};

export default function GeneralistLeaders() {
  return (
    <div className="container">
      <ArticleHeaderImage
        src="/the-rise-of-generalist-leaders.png"
        alt="The Rise of Generalist Leaders"
      />
      <header style={{ marginBottom: "2rem" }}>
        <p className="small-caps" style={{ marginBottom: "0.75rem" }}>
          <Link href="/writing" className="nav-link">
            Writing
          </Link>
        </p>
        <p className="article-date" style={{ marginBottom: "1rem" }}>
          September 6, 2025
        </p>
        <h1 style={{ marginBottom: "0.5rem" }}>
          The Rise of Generalist Leaders
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            fontStyle: "italic",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          How Agentic Tools Are Reshaping Engineering Leadership
        </p>
      </header>

      <hr className="rule-thick" />

      <main>
        <article>
          <p>
            I believe the way we think about engineering leadership, team
            building, management, and organizational structure is about to
            change drastically with the rise of agentic tooling.
          </p>

          <h2>The Path from Code to Leadership</h2>

          <p>
            Early in my career, I worked alongside an engineer who had come from
            Google. This was the first person who truly impressed—and frankly,
            intimidated—me with their programming ability. I&apos;d worked with
            good engineers before, people who seemed maybe a year or three ahead
            of me on a path I could eventually follow. But this person was
            different. They wrote lambda calculus functions in JavaScript{" "}
            <em>for fun</em>. Watching them work, I thought, &ldquo;If this is
            what it takes to be a staff or principal engineer, I don&apos;t know
            if it&apos;s worth it.&rdquo; This person didn&apos;t just work with
            code—they breathed, ate, and slept it.
          </p>

          <p>
            This reminds me of something Steve Jobs always believed: the best
            technologists aren&apos;t just coders—they&apos;re poets, musicians,
            and artists who happen to write code. He insisted that Apple&apos;s
            programmers would always be better than Microsoft&apos;s because
            they understood music, poetry, and beauty. At the time, working with
            this intimidating Google engineer, I thought I was witnessing
            Jobs&apos; ideal in action. I was wrong.
          </p>

          <p>
            As I progressed in my career, an opportunity emerged when a former
            boss recognized something in me: an ability to lead people,
            translate technical complexity for non-technical stakeholders, build
            alliances instead of burning bridges, and understand that
            programming wasn&apos;t just about writing code—it was about solving
            problems. This launched my journey into people leadership.
          </p>

          <p>
            I moved from line management to managing managers, then to directing
            departments. Now I lead engineering at Berry Street. During my time
            here, I&apos;ve had the privilege of witnessing the rise of agentic
            tools from the ground up: ChatGPT, Claude, Devin, Codex, and now my
            tool of choice, Claude Code.
          </p>

          <p>
            Something interesting is happening. As I&apos;ve explored these
            tools, my creativity has begun to flourish again. Like a seed
            dormant through winter, agentic tools provided the destratification
            needed to break through the hull and allow that creativity to
            germinate once more. It&apos;s not that I had lost my curiosity
            before—I would just get frustrated by my inability to debug Webpack,
            Babel, or TypeScript configs. When I wanted to spend a weekend
            coding, I wanted to <em>build</em> something, not untangle terrible
            configuration files.
          </p>

          <p>
            The narrative I told myself was clear: I was meant to be an
            engineering manager. My code would never match that Google
            engineer&apos;s brilliance. But here&apos;s what I understand now
            that I didn&apos;t then: that engineer, for all their technical
            prowess, was optimizing for the wrong thing. They were a specialist
            in a world that was about to reward generalists.
          </p>

          <h2>The Fundamental Shift</h2>

          <p>
            Agentic tools are democratizing technical capability, which means
            raw coding skill is becoming less of a differentiator. The
            &ldquo;intimidating expert&rdquo; model—where technical depth alone
            determined career trajectory—is becoming obsolete. Instead, success
            will flow to those who can synthesize across domains, understand
            context, and create elegant solutions to messy problems.
          </p>

          <p>
            I&apos;m not alone in noticing this. I&apos;m seeing it in
            conversations with other managers and leaders who chose the people
            path over the individual contributor track midway through their
            careers. These tools are re-sparking their creativity, allowing them
            to bypass the tedious obstacles that drove them away from hands-on
            coding in the first place. They can build again. Create again. And
            their efficiency multiplies because they were always problem
            solvers, product builders, tinkerers, and curious individuals.
          </p>

          <p>
            These tools are raising the floor, but more importantly,
            they&apos;re changing what the ceiling looks like. I believe
            we&apos;re entering a world where management, leadership, and
            organizational structures will be shaped by generalists—people who
            have seen enough across disciplines to understand how to build the
            right thing, navigate complex relationships, and synthesize diverse
            perspectives into effective solutions.
          </p>

          <p>
            This will create organizations with small, lean teams of generalists
            driven by curiosity, ambition, creativity, and the ability to create
            impact quickly. I&apos;m convinced we&apos;ll see managers and
            people leaders moving back to individual contributor roles. IC roles
            will shift indefinitely. The boundaries between manager, leader, and
            IC will merge into something new.
          </p>

          <p>
            Leadership will become less about scope—the size of your department
            or the complexity of your codebase—and more about pure impact.
            Success will be measured by quick cycles, the ability to weave
            compelling narratives through complex product solutions, and the
            skill to right-size your approach. It will be about working
            effectively with others while understanding how business context
            shapes architecture, which in turn shapes how we build.
          </p>

          <p>
            Will this transition be messy? Absolutely. Not everyone will make
            this shift successfully, and there will be awkward years where
            traditional hierarchies clash with this new reality. But the
            momentum is undeniable.
          </p>

          <h2>The Return of the Engineering Poets</h2>

          <p>
            To those early in their careers, to those coming of age in this new
            world: leverage this moment. The floor is being raised—use that to
            your advantage. Care deeply about your work. Show up consistently.
            Be an optimist. The glass is always half full, never half empty.
          </p>

          <p>
            This is how you create a life where you&apos;re fulfilled in what
            you put your hand to.
          </p>

          <p>
            We&apos;re moving toward a place where the engineering poets rule
            again—where science, liberal arts, and creativity merge into
            something powerful and new. Steve Jobs was right all along: the best
            technologists understand art, meaning, beauty, and romance, and they
            embody this understanding in the way they build and shape their
            tools.
          </p>

          <p>
            I&apos;m curious where this will all lead, but I have a feeling
            it&apos;s going somewhere none of us can predict. And that&apos;s
            exactly what makes it exciting.
          </p>
        </article>
      </main>
    </div>
  );
}
