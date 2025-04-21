"use client";

import React, { useEffect } from "react";
import InstallPrompt from "./install-prompt";

export default function PWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );

          if (registration.installing) {
            console.log("Service worker installing");
          } else if (registration.waiting) {
            console.log("Service worker installed");
          } else if (registration.active) {
            console.log("Service worker active");
          }
        } catch (error) {
          console.error(`Service worker registration failed: ${error}`);
        }
      } else {
        console.log("Service workers are not supported.");
      }
    };

    // Check for online/offline status
    const handleOnlineStatusChange = () => {
      const isOnline = navigator.onLine;
      if (isOnline) {
        document.body.classList.remove("offline");
        // Notify user they're back online
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("You're back online", {
              body: "Biz Manager is now fully functional.",
              icon: "/icons/icon-192x192.png",
            });
          }
        }
      } else {
        document.body.classList.add("offline");
      }
    };

    // Register event listeners for online/offline events
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Initial check
    handleOnlineStatusChange();

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}
