import { Skeleton } from "@/components/ui/skeleton";

export const ProductTableSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Table Rows */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-5 gap-4"
          style={{ opacity: 1 - i * 0.15 }}
        >
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
};
