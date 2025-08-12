import Link from "next/link";

export default function About() {
  return (
    <div className="container">
      <header>
        <h1>About</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          <Link href="/">← Back to home</Link>
        </p>
      </header>

      <main>
        <p>
          I&apos;m Head of Engineering at Berry Street, where I lead teams building technology 
          that helps people access mental healthcare. Nearly seven years in digital healthcare 
          has taught me that the most interesting—and most important—problems live at the 
          intersection of human systems and technical systems.
        </p>

        <p>
          Before Berry Street, I&apos;ve helped scale teams and technology through hyper-growth, 
          learning that the tools we build are only as effective as the humans who use them. 
          This perspective shapes everything I do: from technical architecture decisions to 
          how we structure teams to how we think about the future of AI in healthcare.
        </p>

        <h2>Influences</h2>
        <p>
          I&apos;m inspired by leaders who understand that technology is fundamentally about people. 
          Jerry Colonna&apos;s work on conscious leadership, Derek Rutter&apos;s approach to systems thinking, 
          and Gil Shklarski&apos;s insights on scaling organizations all inform how I think about 
          building teams that can adapt and thrive through uncertainty.
        </p>

        <h2>Philosophy</h2>
        <p>
          I believe great engineering teams are built on three principles: deep technical 
          understanding, clear communication, and genuine care for the problems we&apos;re solving. 
          Technology should be leverage, not an end in itself.
        </p>

        <p>
          When I&apos;m not thinking about code or teams, I&apos;m usually reflecting on macro trends 
          and their second-order effects. How does AI change how we think about expertise? 
          How do we maintain human agency in increasingly automated systems? These questions 
          fascinate me because they&apos;re not just about technology—they&apos;re about the kind of 
          future we&apos;re building together.
        </p>

        <div style={{ marginTop: '3rem' }}>
          <h3>Get in touch</h3>
          <p>
            <a href="mailto:me@blakeyoder.com">me@blakeyoder.com</a> • <a href="https://www.linkedin.com/in/blakeyoder/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </div>
      </main>
    </div>
  );
}