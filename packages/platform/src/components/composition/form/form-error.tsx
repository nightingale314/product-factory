import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from "@hookform/error-message";
import { FieldErrors, FieldName, FieldValues } from "react-hook-form";

interface FormErrorProps<T extends FieldValues> {
  errors?: FieldErrors<T>;
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
      render={({ message, messages }) => {
        const rootErrors = errors?.[name]?.root;

        if (rootErrors && "message" in rootErrors) {
          return (
            <p className="text-sm text-red-500 pt-1.5 mb-2">
              {rootErrors.message}
            </p>
          );
        }

        if (messages) {
          return Object.entries(messages).map(([type, arrMessages]) => (
            <p key={type} className="text-sm text-red-500 pt-1.5 mb-2">
              {arrMessages}
            </p>
          ));
        }

        if (message) {
          return <p className="text-sm text-red-500 pt-1.5 mb-2">{message}</p>;
        }

        return null;
      }}
    />
  );
};
