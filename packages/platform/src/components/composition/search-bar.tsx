import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { useCallback } from "react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  debounceTime?: number;
}

export const SearchBar = ({
  className,
  placeholder,
  onChange,
  debounceTime = 300,
}: SearchBarProps) => {
  const debouncedOnChange = useCallback(
    debounce((value: string) => onChange?.(value), debounceTime),
    [debounceTime]
  );

  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => debouncedOnChange?.(e.target.value)}
      className={cn("min-w-[200px]", className)}
    />
  );
};
