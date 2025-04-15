// components/ui/page-header.tsx
import { ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  description?: string;
  backButton?: ReactNode;
};

export function PageHeader({
  title,
  description,
  backButton,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {backButton}
        <h1 className={`text-2xl font-bold ${backButton ? "ml-3" : ""}`}>
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
