import { Label } from "@/components/ui/label";

interface InputWrapperProps {
  id: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}

export const InputWrapper = ({
  id,
  name,
  required,
  children,
}: InputWrapperProps) => {
  return (
    <div className="grid grid-cols-[minmax(0,200px)_1fr] w-full">
      <Label className="items-start pt-2" htmlFor={id}>
        <span className="truncate max-w-[200px]">
          {name} {required ? <span className="text-red-500">*</span> : null}
        </span>
      </Label>
      <div className="flex">{children}</div>
    </div>
  );
};
