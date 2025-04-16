import { cn } from "@/lib/utils";
import { Loader } from "./loader";

export const LoadingStateWrapper = ({
  isLoading,
  children,
  loadingText = "Loading...",
  minH = "400px",
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  minH?: string;
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          minH === "auto" ? "min-h-fit" : "min-h-[400px] mx-auto"
        )}
      >
        <Loader loadingText={loadingText} />
      </div>
    );
  }
  return <>{children}</>;
};
