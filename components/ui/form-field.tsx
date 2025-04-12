import React from "react";
import { Input } from "./input";

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled: boolean;
  error?: string;
  required?: boolean;
};

export function FormField({
  id,
  name,
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled,
  error,
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1"
      >
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        className={` border ${error ? "border-destructive" : "border-input"} `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
