import Image from "next/image";

interface ArticleHeaderImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  hideHeaderImage?: boolean;
}

export function ArticleHeaderImage({
  src,
  alt,
  width = 1200,
  height = 630,
  hideHeaderImage = false,
}: ArticleHeaderImageProps) {
  if (hideHeaderImage) {
    return null;
  }

  return (
    <div className="article-header-image">
      <Image src={src} alt={alt} width={width} height={height} priority />
    </div>
  );
}
