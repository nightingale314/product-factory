import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldErrors, FieldName, FieldValues } from "react-hook-form";
import { FormError } from "./form-error";
import { FieldValuesFromFieldErrors } from "@hookform/error-message";

interface FormFieldProps<T extends FieldValues> {
  name: FieldName<FieldValuesFromFieldErrors<T>>;
  label?: string;
  errors?: FieldErrors<T>;
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
  required?: boolean;
  description?: string;
}
export const FormField = <T extends FieldValues>({
  name,
  label,
  className,
  errors,
  children,
  vertical = true,
  required = false,
  description,
}: FormFieldProps<T>) => {
  return (
    <div
      className={cn(
        "flex",
        vertical ? "flex-col" : "flex-row justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-1", vertical ? "pb-3" : "pr-6")}>
        {label ? (
          <Label htmlFor={name}>
            {label}
            {required ? <span className="text-red-500">*</span> : null}
          </Label>
        ) : null}
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div>{children}</div>
      <FormError errors={errors} name={name} />
    </div>
  );
};

FormField.displayName = "FormField";
