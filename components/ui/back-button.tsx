import { ChevronLeft } from "lucide-react";

type BackButtonProps = {
  onClick: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground flex items-center"
    >
      <ChevronLeft /> Back
    </button>
  );
}
