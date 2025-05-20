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
      <label
        className="text-sm items-start pt-2 text-muted-foreground"
        htmlFor={id}
      >
        {name} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <div className="flex items-end">{children}</div>
    </div>
  );
};
