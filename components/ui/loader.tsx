import { Loader2 } from "lucide-react";

export const Loader = ({ loadingText }: { loadingText?: string }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-muted-foreground text-md ml-2">{loadingText}</span>
    </div>
  );
};
