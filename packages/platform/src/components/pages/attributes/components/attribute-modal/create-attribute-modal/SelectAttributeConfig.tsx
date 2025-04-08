import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, X } from "lucide-react";
import { Fragment, useState } from "react";

interface SelectAttributeConfigProps {
  className?: string;
  initialOptions?: string[];
  onChange: (options: string[]) => void;
}

export const SelectAttributeConfig = ({
  initialOptions,
  onChange,
}: SelectAttributeConfigProps) => {
  const [options, setOptions] = useState<string[]>(initialOptions || []);
  const [value, setValue] = useState<string>("");

  const handleAddOptions = () => {
    const newOptions = value
      .split("\n")
      .filter((option) => option.trim() !== "");
    const uniqueOptions = new Set([...options, ...newOptions]);

    onChange([...uniqueOptions]);
    setOptions([...uniqueOptions]);
    setValue("");
  };

  return (
    <div className="grid grid-cols-2">
      <div className="flex items-center">
        <Textarea
          placeholder="E.g. Option 1, Option 2, Option 3"
          className="resize-none h-52"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <Button
          type="button"
          onClick={handleAddOptions}
          size="icon"
          variant="ghost"
          className="mx-2 grow-0"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
      <ScrollArea className="h-52 rounded-md border">
        {options && options?.length > 0 ? (
          options.map((option, idx) => (
            <Fragment key={`${option}-${idx}`}>
              <div className="text-sm p-2 flex items-center gap-2">
                <button
                  className="text-muted-foreground"
                  onClick={() => {
                    onChange(options?.filter((_, i) => i !== idx));
                    setOptions(options?.filter((_, i) => i !== idx));
                  }}
                >
                  <X className="size-4" />
                </button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-1 min-w-0 truncate max-w-[200px]">
                      {option}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{option}</TooltipContent>
                </Tooltip>
              </div>
              <Separator />
            </Fragment>
          ))
        ) : (
          <div className="text-sm text-muted-foreground p-2">
            No options added
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
