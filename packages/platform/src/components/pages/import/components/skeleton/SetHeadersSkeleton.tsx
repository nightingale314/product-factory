import { Skeleton } from "@/components/ui/skeleton";

export const SetHeadersSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Table Rows */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-2 gap-4"
          style={{ opacity: 1 - i * 0.2 }}
        >
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
};
