// components/ui/page-header.tsx
import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  backButton?: ReactNode;
};

export function PageHeader({ title, backButton }: PageHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      {backButton}
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
