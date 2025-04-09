// components/credit/FormField.tsx
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  required?: boolean;
};

export function FormField({
  id,
  label,
  children,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

// components/credit/DebtorSelector.tsx
