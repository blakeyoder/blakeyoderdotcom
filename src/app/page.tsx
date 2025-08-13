import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>Blake Yoder</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          Head of Engineering at <a href="https://berrystreet.co" target="_blank" rel="noopener noreferrer">Berry Street</a>
        </p>
      </header>

      <main>
        <p style={{ marginBottom: '1.5rem' }}>
          The most interesting problems live at the intersection of human systems and technical systems. Over the past decade—including seven years in digital healthcare—I&rsquo;ve learned how technology, when used well, can create outsized business outcomes.
        </p>

        <p style={{ marginBottom: '1.5rem' }}>
          I&rsquo;ve applied that belief in scaling teams and businesses through rapid growth—most notably helping scale <a 
            href="https://thirtymadison.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ borderBottom: '1px solid var(--text-tertiary)' }}
          >
            Thirty Madison
          </a> from Series A to over $250M in ARR. My work sits at the crossroads of technology and business strategy, aligning people, process, and product to turn uncertainty into momentum.
        </p>

        <p>
          I write about the overlap between technical execution and business impact—covering macro trends, team dynamics, and the personal reflections that come from leading through change.
        </p>

        <nav style={{ marginTop: '3rem' }}>
          <p>
            <Link href="/writing">Writing</Link> • <Link href="/bookmarks">Bookmarks</Link> • <Link href="/about">About</Link> • <Link href="/vim">Vim</Link> • <a href="https://www.linkedin.com/in/blakeyoder/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </nav>
      </main>
    </div>
  );
}
