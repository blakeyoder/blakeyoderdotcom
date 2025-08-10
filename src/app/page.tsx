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
        <p>
          I scale teams and businesses through hyper-growth, using technology as leverage for business outcomes. 
          Nearly seven years in digital healthcare has taught me that the most interesting problems live at the 
          intersection of human systems and technical systems.
        </p>

        <p>
          <em>"AI is shipping more of our code. But who actually understands the system now?"</em>
        </p>

        <p>
          I write about technical subjects as they relate to business insights and macro trends, 
          team building, and the personal reflections that come from leading through uncertainty.
        </p>

        <nav style={{ marginTop: '3rem' }}>
          <p>
            <Link href="/writing">Writing</Link> • <Link href="/bookmarks">Bookmarks</Link> • <Link href="/about">About</Link> • <a href="https://www.linkedin.com/in/blakeyoder/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </nav>
      </main>
    </div>
  );
}
