import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type LabelProps = {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
};

export function FieldLabel({ label, hint, required, children, error }: LabelProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-red-500 ml-0.5">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-muted block">{hint}</span> : null}
      {error ? (
        <span className="text-xs text-red-600 block">{error}</span>
      ) : null}
    </label>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-brand/60 focus:ring-4 focus:ring-brand/20 [&_option]:bg-background [&_option]:text-ink";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${INPUT_CLASS} ${className}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return <select {...rest} className={`${INPUT_CLASS} ${className}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`${INPUT_CLASS} min-h-[80px] resize-y ${className}`}
    />
  );
}
