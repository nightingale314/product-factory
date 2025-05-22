import { Sparkles } from "lucide-react";
import { TooltipContent, Tooltip, TooltipTrigger } from "../tooltip";
import { convertTimestampToFromNow } from "@/lib/datetime";

export const AIEnrichedIcon = ({
  lastUpdatedAt,
}: {
  lastUpdatedAt: Date | null;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="bg-linear-to-r from-blue-200 via-blue-400 to-blue-600 rounded p-1 shadow-sm">
          <Sparkles fill="#FFF" className="w-3 h-3 text-white drop-shadow" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Enriched by AI{" "}
        {lastUpdatedAt ? convertTimestampToFromNow(lastUpdatedAt) : null}
      </TooltipContent>
    </Tooltip>
  );
};
