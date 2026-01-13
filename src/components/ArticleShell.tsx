import Link from "next/link";
import { ArticleHeaderImage } from "./ArticleHeaderImage";

interface ArticleShellProps {
  title: string;
  date: string;
  tagline?: string;
  headerImage?: {
    src: string;
    alt: string;
  };
  hideHeaderImage?: boolean;
  children: React.ReactNode;
}

export function ArticleShell({
  title,
  date,
  tagline,
  headerImage,
  hideHeaderImage = false,
  children,
}: ArticleShellProps): React.ReactElement {
  const showHeaderImage = headerImage && !hideHeaderImage;

  return (
    <div className="page-container">
      {showHeaderImage && (
        <ArticleHeaderImage src={headerImage.src} alt={headerImage.alt} />
      )}
      <header className="mb-8">
        <p className="small-caps mb-3">
          <Link href="/writing" className="nav-link">
            Writing
          </Link>
        </p>
        <p className="article-date mb-4">{date}</p>
        <h1 className="mb-2">{title}</h1>
        {tagline && (
          <p className="text-xl italic text-text-secondary m-0">{tagline}</p>
        )}
      </header>

      <hr className="rule-thick" />

      <main>
        <article>{children}</article>
      </main>
    </div>
  );
}
