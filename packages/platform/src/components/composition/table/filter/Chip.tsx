import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { QueryType } from "@/lib/parsers/enums";
import { QueryRangeType, QueryValue } from "@/lib/parsers/types";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, XCircleIcon } from "lucide-react";

const ChipDisplayLabel = ({
  type,
  value,
}: {
  type: QueryType;
  value?: QueryValue["value"];
}) => {
  console.log(type, value);

  switch (type) {
    case QueryType.STRING:
      return `${value}`;

    case QueryType.MULTI_STRING: {
      const multiString = value as string[];
      if (multiString && multiString.length > 3) {
        return `${multiString[0]} and ${multiString.length - 1} more`;
      }
      return multiString?.join(", ");
    }

    case QueryType.BOOLEAN: {
      return `${value?.toString().toLowerCase()}`;
    }

    case QueryType.RANGE: {
      const rangeValue = value as QueryRangeType["value"] | undefined;
      if (rangeValue) {
        if (rangeValue.min && rangeValue.max) {
          return `${rangeValue.min.value} to ${rangeValue.max.value}`;
        }
        if (rangeValue.min) {
          return `More than ${rangeValue.min.value}`;
        }
        if (rangeValue.max) {
          return `Less than ${rangeValue.max.value}`;
        }
      }
      break;
    }

    default:
      return null;
  }

  return null;
};

interface ChipProps {
  label: string;
  value?: QueryValue["value"];
  type?: QueryType;
  popover: React.ReactNode;
  disabled?: boolean;
  onRemove?: () => void;
}

export const Chip = ({
  label,
  value,
  type,
  popover,
  onRemove,
  disabled,
}: ChipProps) => {
  const hasValue = value !== null && value !== undefined;

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasValue) {
      onRemove?.();
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          size="sm"
          disabled={disabled}
          variant="outline"
          className={cn(
            "!rounded-full",
            hasValue ? "!border-solid" : "!border-dashed"
          )}
        >
          <div className="flex items-center gap-2 !text-xs">
            <div
              tabIndex={0}
              className="cursor-pointer group"
              onClick={onClick}
            >
              {hasValue ? (
                <XCircleIcon className="!w-4 !h-4 text-gray-400 group-hover:!text-red-500" />
              ) : (
                <PlusCircleIcon className="!w-4 !h-4 text-gray-400" />
              )}
            </div>

            <div>{label}</div>
            {hasValue && type ? (
              <>
                <Separator orientation="vertical" className="!h-5 w-1" />
                <div className="text-primary max-w-[100px] truncate">
                  <ChipDisplayLabel type={type} value={value} />
                </div>
              </>
            ) : null}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>{popover}</PopoverContent>
    </Popover>
  );
};
