import { Thumbnail } from "./thumbnail";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableThumbnailProps {
  url: string;
  alt: string;
  thumbnailClassName?: string;
  onDelete: (url: string) => void;
}

const SortableThumbnail = ({
  url,
  alt,
  onDelete,
  thumbnailClassName,
}: SortableThumbnailProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  return (
    <div className="relative">
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Thumbnail url={url} alt={alt} className={thumbnailClassName} />
      </div>
      <button
        className="absolute top-1 right-1 text-muted-foreground hover:text-red-500"
        onClick={() => {
          console.log("onDelete", url);
          onDelete(url);
        }}
      >
        <X
          className="w-4 h-4"
          onClick={() => {
            console.log("ois");
          }}
        />
      </button>
    </div>
  );
};

interface ThumbnailGalleryProps {
  urls: string[];
  sortable?: boolean;
  thumbnailClassName?: string;
  onChange: (urls: string[]) => void;
}

export const ThumbnailGallery = ({
  urls,
  onChange,
  sortable = false,
  thumbnailClassName,
}: ThumbnailGalleryProps) => {
  const onDelete = (url: string) => {
    console.log("onDelete", url, urls);
    onChange(urls.filter((u) => u !== url));
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          const oldIndex = urls.indexOf(active.id as string);
          const newIndex = urls.indexOf(over.id as string);
          onChange(arrayMove(urls, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext
        items={urls}
        strategy={rectSortingStrategy}
        disabled={!sortable}
      >
        <div className="flex flex-wrap gap-2">
          {urls.length === 0 && (
            <div
              className={cn(thumbnailClassName, "rounded border border-dashed")}
            />
          )}
          {urls.map((url) => (
            <SortableThumbnail
              key={url}
              url={url}
              alt={url}
              onDelete={onDelete}
              thumbnailClassName={thumbnailClassName}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
