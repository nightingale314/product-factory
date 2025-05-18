import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TextCellProps {
  value?: string | null;
  className?: string;
}

export const TextCell = ({ value, className }: TextCellProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn("!whitespace-normal text-start", className)}>
          <p className=" line-clamp-2">{value}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px]">{value}</TooltipContent>
    </Tooltip>
  );
};
