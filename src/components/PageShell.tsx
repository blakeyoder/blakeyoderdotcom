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

export function PageShell({
  title,
  backLink = "/",
  backText = "Blake Yoder",
  subtitle,
  subtitleStyle = "default",
  wide = false,
  children,
}: PageShellProps) {
  const getSubtitleClasses = () => {
    const baseClasses = "text-text-secondary";
    if (subtitleStyle === "date") {
      return `article-date mb-4`;
    }
    if (subtitleStyle === "small-caps") {
      return `small-caps mt-2`;
    }
    return `${baseClasses} mt-2`;
  };

  return (
    <div className={wide ? "container-wide" : "container"}>
      <header className="mb-8">
        <p className="small-caps mb-3">
          <Link href={backLink} className="nav-link">
            {backText}
          </Link>
        </p>
        <h1 className={subtitle ? "mb-2" : ""}>{title}</h1>
        {subtitle && <p className={getSubtitleClasses()}>{subtitle}</p>}
      </header>

      <hr className="rule-thick" />

      <main>{children}</main>
    </div>
  );
}
