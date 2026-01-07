import Link from "next/link";

interface ArticleCardProps {
  date: string;
  title: string;
  href: string;
  subtitle: string;
  excerpt: string;
}

export function ArticleCard({
  date,
  title,
  href,
  subtitle,
  excerpt,
}: ArticleCardProps) {
  return (
    <article className="article-card">
      <p className="article-date">{date}</p>
      <h2 className="article-title">
        <Link href={href}>{title}</Link>
      </h2>
      <p className="article-subtitle">{subtitle}</p>
      <p className="article-excerpt">{excerpt}</p>
    </article>
  );
}
