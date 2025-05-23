import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export const Spinner = ({ className }: { className?: string }) => {
  return <LoaderCircle className={cn("size-4 animate-spin", className)} />;
};

export default Spinner;
