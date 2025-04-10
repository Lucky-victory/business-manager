import Image from "next/image";
import { Loader2 } from "lucide-react";

type SocialProvider = "google" | "github" | "facebook";

type SocialSignInButtonProps = {
  provider: SocialProvider;
  onClick: () => void;
  isLoading: boolean;
};

export function SocialSignInButton({
  provider,
  onClick,
  isLoading,
}: SocialSignInButtonProps) {
  const providerIcons = {
    google: "/google.svg",
    github: "/github.svg",
    facebook: "/facebook.svg",
  };

  const providerNames = {
    google: "Google",
    github: "GitHub",
    facebook: "Facebook",
  };

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Image
            className="h-5 w-5 mr-2"
            src={providerIcons[provider]}
            alt={`${providerNames[provider]} logo`}
            width={20}
            height={20}
          />
          Register with {providerNames[provider]}
        </>
      )}
    </button>
  );
}
