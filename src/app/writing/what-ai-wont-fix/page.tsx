import type { Metadata } from "next";
import { ArticleShell } from "@/components/ArticleShell";

export const metadata: Metadata = {
  title: "What AI Won't Fix | Blake Yoder",
  description:
    "Everyone's obsessing over what AI changes. The more interesting question: what doesn't it change at all?",
  openGraph: {
    title: "What AI Won't Fix",
    description:
      "Everyone's obsessing over what AI changes. The more interesting question: what doesn't it change at all?",
    url: "https://blakeyoder.com/writing/what-ai-wont-fix",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/what-ai-wont-fix.png",
        width: 1200,
        height: 630,
        alt: "What AI Won't Fix",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-11-28T00:00:00.000Z",
    authors: ["Blake Yoder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "What AI Won't Fix",
    description:
      "Everyone's obsessing over what AI changes. The more interesting question: what doesn't it change at all?",
    images: ["/what-ai-wont-fix.png"],
  },
};

export default function WhatAIWontFix() {
  return (
    <ArticleShell
      title="What AI Won't Fix"
      date="November 28, 2025"
      tagline="Everyone's obsessing over what AI changes. The more interesting question: what doesn't it change at all?"
      headerImage={{
        src: "/what-ai-wont-fix.png",
        alt: "What AI Won't Fix",
      }}
    >
      <h2>Slop isn&apos;t new. The scapegoat is.</h2>

      <p>
        Before Cursor, Claude Code, etc, developers shipped sloppy code. After
        these tools, developers ship sloppy code. The only difference is who
        gets blamed.
      </p>

      <p>
        &quot;AI writes bad code, so don&apos;t use AI&quot; sounds reasonable
        until you think about it for three seconds. It&apos;s a false dichotomy.
        The argument assumes code quality is binary and inherent to the
        tool—ignoring the human wielding it.
      </p>

      <p>
        I&apos;ve worked in growth-stage startups where time-to-ship is hours,
        not weeks. No code is perfect in that environment. You make trade-offs.
        You accumulate debt. You ship. This was true in 2019. It&apos;s true in
        2025.
      </p>

      <p>
        Slop is slop whether it&apos;s hand-stitched or AI-generated. The origin
        doesn&apos;t determine quality. The intention does.
      </p>

      <p>
        Learn to use the tools well, and you write better code faster. Refuse to
        learn, blame the tool, and you write the same mediocre code you always
        did—just slower.
      </p>

      <h2>Guardrails still matter. Maybe more.</h2>

      <p>
        Agentic tools can send you down rabbit holes. So can a blank terminal
        and a curious mind.
      </p>

      <p>
        We&apos;ve all burned an afternoon chasing an elegant solution to a
        problem that didn&apos;t need solving. Side-quests aren&apos;t new—fuzzy
        definitions of done have always been the real enemy.
      </p>

      <p>
        AI doesn&apos;t fix this. If anything, it amplifies it. More capability
        means more surface area for distraction.
      </p>

      <p>
        The fix is the same as it&apos;s always been: clear expectations, hard
        deadlines, and the discipline to stop when something is good enough.
      </p>

      <p>
        Constraints create better results. They always have. AI doesn&apos;t
        change that equation—it just raises the stakes.
      </p>

      <h2>Learning didn&apos;t become optional.</h2>

      <p>
        AI is an intelligence multiplier. Used well, it&apos;s the best tutor
        you&apos;ve ever had. &quot;Explain how DNS works.&quot; &quot;My
        company deploys on ECS with Fargate—help me build a mental model of how
        requests flow.&quot; These prompts make you smarter.
      </p>

      <p>
        But slapping a stack trace into a window and accepting the fix?
        That&apos;s not learning. The problem is &quot;solved,&quot; but you
        never internalized what went wrong.
      </p>

      <p>
        This isn&apos;t new either. Pre-AI, you could pair with a senior
        engineer who found the bug in thirty seconds. If you didn&apos;t ask
        why, you walked away with working code and zero insight. The senior
        engineer moved on. You stayed stuck at the same level.
      </p>

      <p>
        AI makes it easier to skip the learning. It also makes it easier to do
        the learning. The choice was always yours. It still is.
      </p>

      <h2>The constant is us</h2>

      <p>Tools change. Human nature doesn&apos;t.</p>

      <p>
        We still need intention to write good code. We still need boundaries to
        finish projects. We still reach for something to blame when the work is
        hard.
      </p>

      <p>
        AI isn&apos;t magic. It&apos;s a lever. And levers don&apos;t care about
        direction—they amplify whatever force you apply.
      </p>

      <p>
        The question was never &quot;Will AI write good code?&quot; It&apos;s
        always been &quot;Will you?&quot;
      </p>
    </ArticleShell>
  );
}
