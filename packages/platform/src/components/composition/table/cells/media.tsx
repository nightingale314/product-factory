/* eslint-disable @next/next/no-img-element */
"use client";

import { Image } from "lucide-react";
import { useState } from "react";

interface MediaCellProps {
  urls?: string[];
}

export const MediaCell = ({ urls }: MediaCellProps) => {
  const [hasError, setHasError] = useState(false);
  const image = urls?.[0] ?? "";

  return (
    <div className="h-8 w-8">
      {hasError ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image />
      ) : (
        <img
          loading="lazy"
          src={image}
          alt="image"
          onError={() => setHasError(true)}
          className="w-full h-full"
        />
      )}
    </div>
  );
};
