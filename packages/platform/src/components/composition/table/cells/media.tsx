/* eslint-disable @next/next/no-img-element */
"use client";

import { Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MediaCellProps {
  urls?: string[];
  className?: string;
}

export const MediaCell = ({ urls, className }: MediaCellProps) => {
  const image = urls?.[0] ?? undefined;
  const [hasError, setHasError] = useState(!image);

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
          src={image}
          alt="image"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};
