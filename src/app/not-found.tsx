import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="page-container">
      <div
        className="article-header-image"
        style={{ background: "var(--background)" }}
      >
        <Image
          src="/404-image.png"
          alt="Lady with an Ermine by Leonardo da Vinci"
          width={1100}
          height={1490}
          priority
          title="This is my favorite painting of all time."
        />
      </div>

      <main style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>
          Nothing here yet.
        </h1>

        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
      </main>
    </div>
  );
}
