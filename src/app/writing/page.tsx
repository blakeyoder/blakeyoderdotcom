import Link from "next/link";

export default function Writing() {
  return (
    <div className="container">
      <header>
        <h1>Writing</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          <Link href="/">← Back to home</Link>
        </p>
      </header>

      <main>
        <p>
          Essays on technology, leadership, and the human systems that make or break great teams.
        </p>

        <div style={{ marginTop: '3rem' }}>
          <h2>Coming Soon</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            I&apos;m working on my first essays about scaling engineering teams, 
            the intersection of AI and human decision-making, and lessons learned 
            from nearly seven years in digital healthcare.
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3>What I&apos;m thinking about:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              • How do we maintain system understanding when AI writes more of our code?
            </li>
            <li style={{ marginBottom: '1rem' }}>
              • The relationship between technical debt and organizational debt
            </li>
            <li style={{ marginBottom: '1rem' }}>
              • Building teams that can adapt to macro trends without losing their core
            </li>
            <li style={{ marginBottom: '1rem' }}>
              • What healthcare technology teaches us about human-centered design
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}