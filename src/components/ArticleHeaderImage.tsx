import Image from "next/image";

interface ArticleHeaderImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function ArticleHeaderImage({
  src,
  alt,
  width = 1200,
  height = 630,
}: ArticleHeaderImageProps): React.ReactElement {
  return (
    <div className="article-header-image">
      <Image src={src} alt={alt} width={width} height={height} priority />
    </div>
  );
}
