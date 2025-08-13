import Link from "next/link";

export default function About() {
  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="mb-4">About</h1>
        <p className="text-base text-secondary mb-0">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </p>
      </header>

      <main className="prose prose-lg">
        <div className="space-y-6 mb-12">
          <p className="text-lg leading-relaxed">
            I lead engineering at{' '}
            <a 
              href="https://berrystreet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ borderBottom: '1px solid var(--text-tertiary)' }}
            >
              Berry Street
            </a>
            , where we build technology that connects patients with registered dietitians. After nearly seven years in digital health, one thing&rsquo;s clear: the most interesting problems—and the most important ones—live at the messy intersection of human systems and technical systems.
          </p>

          <p className="text-lg leading-relaxed">
            Before Berry Street, I helped scale teams and technology through hyper-growth. Along the way, I learned that tools are only as effective as the people using them. That belief shapes everything I do—whether I&rsquo;m designing system architecture, structuring a team, or exploring how AI can make healthcare more human, not less.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-medium mb-6 text-primary">Influences</h2>
          <ul className="space-y-4 list-none pl-0">
            <li className="leading-relaxed">
              <a
                href="https://www.reboot.io/team/jerry-colonna/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: '1px solid var(--text-tertiary)' }}
              >
                Jerry Colonna
              </a>{' '}
    , whom I&rsquo;ve never met, taught me that leadership starts with self-awareness. 
            </li>
            <li className="leading-relaxed">
              <a
                href="https://www.onebreathcounseling.net/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: '1px solid var(--text-tertiary)' }}
              >
                Derek Rutter
              </a>{' '}
              showed me that the best answer is a better question.
            </li>
            <li className="leading-relaxed">
              <a
                href="https://www.operatorpartners.com/team-gil-shklarski"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: '1px solid var(--text-tertiary)' }}
              >
                Gil Shklarski
              </a>{' '}
              reminded me that scaling an organization is more about trust than it is about tech.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium mb-6 text-primary">Philosophy</h2>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              Great engineering teams run on three things: deep technical skill, clear communication, and genuine care for the problem. Technology should be leverage, not the destination. The real win isn&rsquo;t shipping code—it&rsquo;s making a meaningful difference for the humans on the other side of the screen.
            </p>

            <p className="text-lg leading-relaxed">
              Outside of work, I&rsquo;m often thinking about macro trends and their second-order effects. How will AI change how we think about expertise? How do we keep human agency alive in increasingly automated systems? These aren&rsquo;t just tech questions—they&rsquo;re questions about the kind of future we&rsquo;re building together.
            </p>
          </div>
        </section>

        <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-medium mb-4 text-primary">Get in touch</h3>
          <p className="text-lg">
            <a 
              href="mailto:me@blakeyoder.com"
              style={{ borderBottom: '1px solid var(--text-tertiary)' }}
            >
              me@blakeyoder.com
            </a>
            {' '} • {' '}
            <a 
              href="https://www.linkedin.com/in/blakeyoder/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ borderBottom: '1px solid var(--text-tertiary)' }}
            >
              LinkedIn
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
