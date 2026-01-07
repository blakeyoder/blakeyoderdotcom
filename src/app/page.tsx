import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>Blake Yoder</h1>
        <p className="small-caps -mt-2 mb-12">Engineering Leader</p>
      </header>

      <main>
        <section className="mb-10">
          <p className="text-xl leading-relaxed">
            The most interesting problems live at the intersection of human
            systems and technical systems. Over the past decade—including seven
            years in digital healthcare—I&apos;ve learned how technology, when
            used well, can create outsized business outcomes.
          </p>

          <p>
            I&apos;ve applied that belief in scaling teams and businesses
            through rapid growth—most notably helping scale{" "}
            <a
              href="https://thirtymadison.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Thirty Madison
            </a>{" "}
            from Series A to over $250M in ARR. My work sits at the crossroads
            of technology and business strategy, aligning people, process, and
            product to turn uncertainty into momentum.
          </p>

          <p>
            I write about the overlap between technical execution and business
            impact—covering macro trends, team dynamics, and the personal
            reflections that come from leading through change.
          </p>
        </section>

        <hr className="rule-thick" />

        <nav className="pt-2">
          <p className="nav-links flex flex-wrap items-center gap-0 m-0 text-base">
            <Link href="/about" className="nav-link">
              About
            </Link>
            <span className="nav-divider">|</span>
            <Link href="/writing" className="nav-link">
              Writing
            </Link>
            <span className="nav-divider">|</span>
            <Link href="/bookmarks" className="nav-link">
              Bookmarks
            </Link>
            <span className="nav-divider">|</span>
            <Link href="/now" className="nav-link">
              Now
            </Link>
            <span className="nav-divider">|</span>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            <span className="nav-divider">|</span>
            <a
              href="https://www.linkedin.com/in/blakeyoder/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              LinkedIn
            </a>
          </p>
        </nav>
      </main>
    </div>
  );
}
