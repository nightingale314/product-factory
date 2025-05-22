/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Image } from "lucide-react";

interface ThumbnailProps {
  url?: string;
  alt: string;
  className?: string;
}

export const Thumbnail = ({ url, alt, className }: ThumbnailProps) => {
  const [hasError, setHasError] = useState(!url);
  return (
    <div
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded overflow-clip border",
        className
      )}
    >
      {hasError ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image />
      ) : (
        <img
          loading="lazy"
          src={url}
          alt={alt}
          onError={() => {
            console.log("error");
            setHasError(true);
          }}
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};
