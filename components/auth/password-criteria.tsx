// components/auth/password-criteria.tsx
import { Check, X } from "lucide-react";

type PasswordCriteriaProps = {
  criteria: {
    minLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
};

export function PasswordCriteria({ criteria }: PasswordCriteriaProps) {
  const criteriaItems = [
    {
      met: criteria.minLength,
      label: "At least 8 characters",
    },
    {
      met: criteria.hasUppercase,
      label: "At least one uppercase letter",
    },
    {
      met: criteria.hasNumber,
      label: "At least one number",
    },
    {
      met: criteria.hasSpecial,
      label: "At least one special character",
    },
  ];

  return (
    <div className="mt-2 p-3 bg-background border border-input rounded-md transition-all duration-300">
      <p className="text-sm font-medium mb-2">Password must contain:</p>
      <ul className="space-y-1">
        {criteriaItems.map((item, index) => (
          <li key={index} className="flex items-center text-sm">
            {item.met ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <X className="h-4 w-4 mr-2 text-destructive" />
            )}
            <span
              className={item.met ? "text-green-500" : "text-muted-foreground"}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
