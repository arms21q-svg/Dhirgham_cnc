import { cn } from "@/lib/utils";

type RemoteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  loading?: "lazy" | "eager";
};

export function RemoteImage({
  src,
  alt,
  fill,
  className,
  loading = "lazy",
}: RemoteImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin/project URLs may be any host
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
    />
  );
}
