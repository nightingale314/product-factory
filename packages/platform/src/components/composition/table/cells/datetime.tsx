import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  convertTimestampToDate,
  convertTimestampToFromNow,
} from "@/lib/datetime";

export const DateTimeCell = ({ value }: { value: Date }) => {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger>{convertTimestampToFromNow(value)}</TooltipTrigger>
        <TooltipContent>{convertTimestampToDate(value)}</TooltipContent>
      </Tooltip>
    </div>
  );
};
