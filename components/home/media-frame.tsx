"use client";

import Image from "next/image";
import { useState } from "react";
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
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <div className={cn("club-media", className)}>
      {src && src !== failedSrc ? (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={(event) => {
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              event.currentTarget.animate?.({ opacity: [0, 1] }, { duration: 220, easing: "ease-out" });
            }
          }}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div
          className="club-media-placeholder"
          role="img"
          aria-label={`${alt}. ${src ? "Photo unavailable" : "Photo placeholder"}.`}
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
              {src ? "Photo unavailable" : label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
