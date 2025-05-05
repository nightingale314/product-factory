import { Skeleton } from "@/components/ui/skeleton";

export const ImportSkeleton = () => {
  return (
    <div className="grow flex flex-col h-full w-full space-y-4">
      <Skeleton className="h-5 w-full p-4" />
      <Skeleton className="h-full w-full" />
    </div>
  );
};
