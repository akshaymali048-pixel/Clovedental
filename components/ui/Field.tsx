import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseFieldProps = {
  label: string;
  name: string;
  error?: string;
  className?: string;
};

type InputFieldProps = BaseFieldProps & {
  as?: "input";
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaFieldProps = BaseFieldProps & {
  as: "textarea";
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type SelectFieldProps = BaseFieldProps & {
  as: "select";
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

type FieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const fieldClasses =
  "w-full min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base text-[#1a1a2e] outline-none transition focus:border-[#0d6e6e] focus:ring-2 focus:ring-[#0d6e6e]/20";

const shellKeys = ["as", "label", "name", "error", "className"] as const;

function withoutShellProps(props: FieldProps): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...props };
  for (const key of shellKeys) {
    delete rest[key];
  }
  return rest;
}

function FieldWrapper({
  label,
  id,
  error,
  className,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium text-[#1a1a2e]">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export function Field(props: FieldProps) {
  const { label, name, error, className } = props;
  const id = props.id ?? name;

  if (props.as === "textarea") {
    const rest = withoutShellProps(props);

    return (
      <FieldWrapper label={label} id={id} error={error} className={className}>
        <textarea
          id={id}
          name={name}
          className={`${fieldClasses} min-h-28 resize-y`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      </FieldWrapper>
    );
  }

  if (props.as === "select") {
    const { children, ...rest } = withoutShellProps(props);

    return (
      <FieldWrapper label={label} id={id} error={error} className={className}>
        <select
          id={id}
          name={name}
          className={fieldClasses}
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children as ReactNode}
        </select>
      </FieldWrapper>
    );
  }

  const rest = withoutShellProps(props);

  return (
    <FieldWrapper label={label} id={id} error={error} className={className}>
      <input
        id={id}
        name={name}
        className={fieldClasses}
        {...(rest as InputHTMLAttributes<HTMLInputElement>)}
      />
    </FieldWrapper>
  );
}
