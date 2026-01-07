import { useId, cloneElement, isValidElement, ReactElement } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactElement<{
    id?: string;
    "aria-invalid"?: string;
    "aria-describedby"?: string;
  }>;
}

export function FormField({ label, error, children }: FormFieldProps) {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  if (!isValidElement(children)) {
    return null;
  }

  const childWithProps = cloneElement(children, {
    id: generatedId,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error ? errorId : undefined,
  });

  return (
    <div className="mb-8">
      <label htmlFor={generatedId}>{label}</label>
      {childWithProps}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-accent mb-0">
          {error}
        </p>
      )}
    </div>
  );
}
