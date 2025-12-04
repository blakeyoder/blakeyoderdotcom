import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="container">
      <div className="article-header-image">
        <Image
          src="/404-image.png"
          alt=""
          width={1200}
          height={630}
          priority
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
