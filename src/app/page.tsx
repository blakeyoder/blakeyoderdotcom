import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <header className="animate-slide-left">
        <h1>Blake Yoder</h1>
        <p className="mono" style={{
          color: 'var(--text-tertiary)',
          fontSize: '0.875rem',
          marginTop: '-1rem',
          marginBottom: '2.5rem',
          letterSpacing: '0.05em'
        }}>
          ENGINEERING LEADER
        </p>
      </header>

      <main>
        <div className="animate-in delay-1">
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.7',
            marginBottom: '2rem',
            color: 'var(--text-primary)'
          }}>
            The most interesting problems live at the intersection of human systems and technical systems. Over the past decade—including seven years in digital healthcare—I&apos;ve learned how technology, when used well, can create outsized business outcomes.
          </p>
        </div>

        <div className="animate-in delay-2">
          <p style={{ marginBottom: '2rem' }}>
            I&apos;ve applied that belief in scaling teams and businesses through rapid growth—most notably helping scale{" "}
            <a
              href="https://thirtymadison.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Thirty Madison
            </a>
            {" "}from Series A to over $250M in ARR. My work sits at the crossroads of technology and business strategy, aligning people, process, and product to turn uncertainty into momentum.
          </p>
        </div>

        <div className="animate-in delay-3">
          <p>
            I write about the overlap between technical execution and business impact—covering macro trends, team dynamics, and the personal reflections that come from leading through change.
          </p>
        </div>

        <div className="animate-in delay-4" style={{ marginTop: '4rem' }}>
          <div style={{
            borderTop: '2px solid var(--border-color)',
            paddingTop: '2rem'
          }}>
            <nav>
              <p style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                fontSize: '1rem'
              }}>
                <Link href="/writing">Writing</Link>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <Link href="/bookmarks">Bookmarks</Link>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <Link href="/about">About</Link>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <Link href="/contact">Contact</Link>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <Link href="/vim">Vim</Link>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <a
                  href="https://www.linkedin.com/in/blakeyoder/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </p>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
