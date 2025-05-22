/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Thumbnail } from "./thumbnail";
import { cn } from "@/lib/utils";
import Spinner from "../icons/Spinner";

interface ThumbnailLocalProps {
  file: File;
  className?: string;
}

export const ThumbnailLocal = ({ file, className }: ThumbnailLocalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <>
      {previewUrl ? (
        <Thumbnail
          url={previewUrl ?? undefined}
          alt={file.name}
          className={className}
        />
      ) : (
        <div
          className={cn(
            className,
            " bg-gray-200 rounded-md flex items-center justify-center"
          )}
        >
          <Spinner />
        </div>
      )}
    </>
  );
};
