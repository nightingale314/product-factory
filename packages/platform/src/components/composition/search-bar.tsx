import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { useCallback } from "react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({
  className,
  placeholder,
  onChange,
}: SearchBarProps) => {
  const debouncedOnChange = useCallback(
    debounce((value: string) => onChange?.(value), 300),
    []
  );

  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => debouncedOnChange?.(e.target.value)}
      className={cn("min-w-[200px]", className)}
    />
  );
};
