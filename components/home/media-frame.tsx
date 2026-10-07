import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function MediaFrame({
  src,
  alt,
  label,
  initials,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  showLabel = true,
}: {
  src?: string;
  alt: string;
  label: string;
  initials?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showLabel?: boolean;
}) {
  return (
    <div className={cn("club-media", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      ) : (
        <div
          className="club-media-placeholder"
          role="img"
          aria-label={`${alt}. Photo placeholder.`}
        >
          {initials ? (
            <span className="club-initials" aria-hidden="true">
              {initials}
            </span>
          ) : (
            <Camera size={28} strokeWidth={1.3} aria-hidden="true" />
          )}
          {showLabel && (
            <span className="club-media-label" aria-hidden="true">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
