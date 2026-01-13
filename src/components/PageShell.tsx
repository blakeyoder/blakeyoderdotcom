import Link from "next/link";

interface PageShellProps {
  title: string;
  backLink?: string;
  backText?: string;
  subtitle?: string;
  subtitleStyle?: "date" | "default" | "small-caps";
  wide?: boolean;
  children: React.ReactNode;
}

function getSubtitleClasses(style: PageShellProps["subtitleStyle"]): string {
  switch (style) {
    case "date":
      return "article-date mb-4";
    case "small-caps":
      return "small-caps mt-2";
    default:
      return "text-text-secondary mt-2";
  }
}

export function PageShell({
  title,
  backLink = "/",
  backText = "Blake Yoder",
  subtitle,
  subtitleStyle = "default",
  wide = false,
  children,
}: PageShellProps): React.ReactElement {

  return (
    <div className={wide ? "page-container-wide" : "page-container"}>
      <header className="mb-8">
        <p className="small-caps mb-3">
          <Link href={backLink} className="nav-link">
            {backText}
          </Link>
        </p>
        <h1 className={subtitle ? "mb-2" : ""}>{title}</h1>
        {subtitle && <p className={getSubtitleClasses(subtitleStyle)}>{subtitle}</p>}
      </header>

      <hr className="rule-thick" />

      <main>{children}</main>
    </div>
  );
}
