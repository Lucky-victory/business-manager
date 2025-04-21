"use client";

import { useState, useEffect } from "react";
import {
  useSyncStore,
  isSyncEnabledForUser,
  syncOperations,
  initSyncListener,
} from "./sync-service";

interface UseSyncFetchOptions {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  skipOfflineSync?: boolean;
}

interface UseSyncFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  isOffline: boolean;
  isPending: boolean;
  execute: (body?: any, params?: { id?: string }) => Promise<T | null>;
}

/**
 * Hook for making API requests with offline sync support
 *
 * @param options - Fetch options
 * @returns Fetch result with offline sync status
 */
export function useSyncFetch<T = any>(
  options: UseSyncFetchOptions
): UseSyncFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);

  const addOperation = useSyncStore((state) => state.addOperation);
  const operations = useSyncStore((state) => state.operations);

  // Check if sync is enabled for the user
  useEffect(() => {
    const checkSyncEnabled = async () => {
      const enabled = await isSyncEnabledForUser();
      setSyncEnabled(enabled);
    };

    checkSyncEnabled();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check for pending operations for this endpoint
  useEffect(() => {
    const hasPendingOps = operations.some(
      (op) => op.endpoint === options.endpoint && op.status === "pending"
    );

    setIsPending(hasPendingOps);
  }, [operations, options.endpoint]);

  /**
   * Execute the fetch request
   *
   * @param overrideBody - Optional body to override the default body
   * @param params - Optional params to customize the request (e.g., dynamic endpoint)
   * @returns The fetch result
   */
  const execute = async (
    overrideBody?: any,
    params?: { id?: string }
  ): Promise<T | null> => {
    const body = overrideBody || options.body;
    const method = options.method || "GET";

    // Handle dynamic endpoint with ID parameter
    let endpoint = options.endpoint;
    if (params?.id) {
      // Replace placeholder with actual ID or append ID to the endpoint
      if (endpoint.includes("placeholder")) {
        endpoint = endpoint.replace("placeholder", params.id);
      } else {
        endpoint = `${endpoint}/${params.id}`;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // If offline and sync is enabled, queue the request
      if (
        isOffline &&
        syncEnabled &&
        !options.skipOfflineSync &&
        method !== "GET"
      ) {
        // Add to sync queue
        addOperation(endpoint, method, body);

        setIsPending(true);
        setLoading(false);
        return null;
      }

      // If online or sync is disabled, make the request normally
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      // If the error is due to network issues and sync is enabled, queue the request
      if (
        error.message.includes("Failed to fetch") &&
        syncEnabled &&
        !options.skipOfflineSync &&
        method !== "GET"
      ) {
        addOperation(options.endpoint, method, body);

        setIsPending(true);
      } else {
        setError(error);
      }

      setLoading(false);
      return null;
    }
  };

  return {
    data,
    error,
    loading,
    isOffline,
    isPending,
    execute,
  };
}

/**
 * Higher-order function that wraps fetch to provide offline sync
 *
 * @param originalFetch - The original fetch function
 * @returns A wrapped fetch function with offline sync
 */
export function createOfflineSyncFetch(
  originalFetch: typeof fetch
): typeof fetch {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const isEnabled = await isSyncEnabledForUser();
    const isOnline = navigator.onLine;

    // If online or sync is disabled, use normal fetch
    if (isOnline || !isEnabled) {
      return originalFetch(input, init);
    }

    // Only queue non-GET requests
    const method = init?.method || "GET";
    if (method === "GET") {
      return originalFetch(input, init);
    }

    // Queue the request for later
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : input.url;
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;

    useSyncStore.getState().addOperation(url, method, body);

    // Return a mock response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Request queued for offline sync",
        offlineSync: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Offline-Sync": "true",
        },
      }
    );
  };
}

/**
 * Initialize the offline sync system
 */
export function initOfflineSync(): void {
  // Override the global fetch
  if (typeof window !== "undefined") {
    const originalFetch = window.fetch;
    window.fetch = createOfflineSyncFetch(originalFetch);
  }

  // Start the sync listener
  const cleanup = initSyncListener();

  // Sync on load if online
  if (navigator.onLine) {
    syncOperations();
  }
}
