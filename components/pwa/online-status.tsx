"use client";

import React, { useEffect, useState } from "react";

interface OnlineStatusProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onlineOnly?: boolean;
  offlineOnly?: boolean;
}

/**
 * A component that conditionally renders content based on the user's online status
 *
 * @param children - Content to render
 * @param fallback - Content to render when the condition is not met
 * @param onlineOnly - Only render children when online
 * @param offlineOnly - Only render children when offline
 */
export default function OnlineStatus({
  children,
  fallback = null,
  onlineOnly = false,
  offlineOnly = false,
}: OnlineStatusProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Determine if we should show the content
  const shouldShowContent =
    (onlineOnly && isOnline) ||
    (offlineOnly && !isOnline) ||
    (!onlineOnly && !offlineOnly);

  return shouldShowContent ? children : fallback;
}

/**
 * A component that only renders its children when the user is online
 */
export function OnlineOnly({
  children,
  fallback = null,
}: Omit<OnlineStatusProps, "onlineOnly" | "offlineOnly">) {
  return (
    <OnlineStatus onlineOnly fallback={fallback}>
      {children}
    </OnlineStatus>
  );
}

/**
 * A component that only renders its children when the user is offline
 */
export function OfflineOnly({
  children,
  fallback = null,
}: Omit<OnlineStatusProps, "onlineOnly" | "offlineOnly">) {
  return (
    <OnlineStatus offlineOnly fallback={fallback}>
      {children}
    </OnlineStatus>
  );
}
