import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from "@hookform/error-message";
import { FieldErrors, FieldName, FieldValues } from "react-hook-form";

interface FormErrorProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  name: FieldName<FieldValuesFromFieldErrors<T>>;
}

export const FormError = <T extends FieldValues>({
  errors,
  name,
}: FormErrorProps<T>) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p className="text-sm text-red-500">{message}</p>
      )}
    />
  );
};
