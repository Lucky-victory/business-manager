"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const checkInstalled = () => {
      // Check if in standalone mode or display-mode is standalone (iOS)
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      ) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Don't show the prompt if already installed
    if (checkInstalled()) return;

    // Check if the app was previously installed
    const wasInstallPromptShown = localStorage.getItem(
      "pwa-install-prompt-shown"
    );
    if (wasInstallPromptShown) return;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Show our custom prompt after a short delay
      setTimeout(() => {
        setIsOpen(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsOpen(false);
      localStorage.setItem("pwa-install-prompt-shown", "true");
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    await deferredPrompt.prompt();

    // Wait for the user's choice
    const choiceResult = await deferredPrompt.userChoice;

    // User accepted the install
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      localStorage.setItem("pwa-install-prompt-shown", "true");
    } else {
      console.log("User dismissed the install prompt");
      // We'll show the prompt again later
      setTimeout(() => {
        localStorage.removeItem("pwa-install-prompt-shown");
      }, 1000 * 60 * 60 * 24 * 7); // 1 week
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Don't show again for a day
    localStorage.setItem("pwa-install-prompt-shown", "true");

    // We'll show the prompt again later
    setTimeout(() => {
      localStorage.removeItem("pwa-install-prompt-shown");
    }, 1000 * 60 * 60 * 24); // 1 day
  };

  // Don't render anything if the app is already installed or not installable
  if (isInstalled || !isInstallable) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Install Biz Manager
          </DialogTitle>
          <DialogDescription>
            Install Biz Manager on your device for a better experience, faster
            access, and offline capabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-sm mb-2">
              Benefits of installing:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Access Biz Manager directly from your home screen</li>
              <li>• Work offline when you don't have internet</li>
              <li>• Faster loading times and better performance</li>
              <li>• Get push notifications for important updates</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={handleClose}>
            Not now
          </Button>
          <Button onClick={handleInstallClick} className="gap-2">
            <Download className="h-4 w-4" />
            Install App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
