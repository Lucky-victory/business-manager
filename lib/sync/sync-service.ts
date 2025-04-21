"use client";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for the sync operations
export type SyncOperation = {
  id: string;
  timestamp: number;
  endpoint: string;
  method: string;
  payload: any;
  status: "pending" | "syncing" | "completed" | "failed";
  retryCount: number;
  error?: string;
};

// Types for the sync store
interface SyncState {
  operations: SyncOperation[];
  isEnabled: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingCount: number;
  failedCount: number;

  // Actions
  addOperation: (endpoint: string, method: string, payload: any) => string;
  updateOperationStatus: (
    id: string,
    status: SyncOperation["status"],
    error?: string
  ) => void;
  removeOperation: (id: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: number) => void;
  resetFailedOperations: () => void;
  clearAllOperations: () => void;
}

// Create the sync store with persistence
export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      operations: [],
      isEnabled: false,
      isSyncing: false,
      lastSyncTime: null,
      pendingCount: 0,
      failedCount: 0,

      // Add a new operation to the queue
      addOperation: (endpoint, method, payload) => {
        const id = uuidv4();
        set((state) => {
          const newOperation: SyncOperation = {
            id,
            timestamp: Date.now(),
            endpoint,
            method,
            payload,
            status: "pending",
            retryCount: 0,
          };

          const newOperations = [...state.operations, newOperation];

          return {
            operations: newOperations,
            pendingCount: newOperations.filter((op) => op.status === "pending")
              .length,
          };
        });
        return id;
      },

      // Update the status of an operation
      updateOperationStatus: (id, status, error) => {
        set((state) => {
          const newOperations = state.operations.map((op) =>
            op.id === id
              ? {
                  ...op,
                  status,
                  error,
                  retryCount:
                    status === "failed" ? op.retryCount + 1 : op.retryCount,
                }
              : op
          );

          return {
            operations: newOperations,
            pendingCount: newOperations.filter((op) => op.status === "pending")
              .length,
            failedCount: newOperations.filter((op) => op.status === "failed")
              .length,
          };
        });
      },

      // Remove an operation from the queue
      removeOperation: (id) => {
        set((state) => {
          const newOperations = state.operations.filter((op) => op.id !== id);
          return {
            operations: newOperations,
            pendingCount: newOperations.filter((op) => op.status === "pending")
              .length,
            failedCount: newOperations.filter((op) => op.status === "failed")
              .length,
          };
        });
      },

      // Enable or disable sync
      setEnabled: (enabled) => {
        set({ isEnabled: enabled });
      },

      // Set syncing state
      setSyncing: (syncing) => {
        set({ isSyncing: syncing });
      },

      // Set last sync time
      setLastSyncTime: (time) => {
        set({ lastSyncTime: time });
      },

      // Reset failed operations to pending
      resetFailedOperations: () => {
        set((state) => {
          const newOperations = state.operations.map((op) =>
            op.status === "failed"
              ? { ...op, status: "pending" as const, retryCount: 0 }
              : op
          );

          return {
            operations: newOperations,
            pendingCount: newOperations.filter((op) => op.status === "pending")
              .length,
            failedCount: 0,
          };
        });
      },

      // Clear all operations
      clearAllOperations: () => {
        set({
          operations: [],
          pendingCount: 0,
          failedCount: 0,
        });
      },
    }),
    {
      name: "biz-manager-sync-storage",
    }
  )
);

// Function to check if the feature is enabled for the current user
export const isSyncEnabledForUser = async (): Promise<boolean> => {
  try {
    // Check if sync is enabled in the store
    const isEnabled = useSyncStore.getState().isEnabled;
    if (!isEnabled) return false;

    // Check if the user is on a premium plan
    const response = await fetch("/api/subscriptions/status");
    if (!response.ok) return false;

    const data = await response.json();
    return data.isPremium === true;
  } catch (error) {
    console.error("Error checking sync eligibility:", error);
    return false;
  }
};

// Main synchronization function
export const syncOperations = async (): Promise<void> => {
  const {
    operations,
    isSyncing,
    setSyncing,
    updateOperationStatus,
    removeOperation,
    setLastSyncTime,
  } = useSyncStore.getState();

  // Don't start a new sync if one is already in progress
  if (isSyncing) return;

  // Check if there are any pending operations
  const pendingOperations = operations.filter((op) => op.status === "pending");
  if (pendingOperations.length === 0) return;

  // Start syncing
  setSyncing(true);

  // Process each pending operation
  for (const operation of pendingOperations) {
    try {
      // Update status to syncing
      updateOperationStatus(operation.id, "syncing");

      // Perform the API call
      const response = await fetch(operation.endpoint, {
        method: operation.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(operation.payload),
      });

      if (response.ok) {
        // Operation succeeded
        updateOperationStatus(operation.id, "completed");
        // Remove completed operations after a delay to allow UI to show success
        setTimeout(() => removeOperation(operation.id), 5000);
      } else {
        // Operation failed
        const errorText = await response.text();
        updateOperationStatus(operation.id, "failed", errorText);
      }
    } catch (error) {
      // Network or other error
      updateOperationStatus(
        operation.id,
        "failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Update last sync time
  setLastSyncTime(Date.now());

  // End syncing
  setSyncing(false);
};

// Initialize sync listener
export const initSyncListener = (): (() => void) => {
  // Function to handle online status change
  const handleOnline = () => {
    if (navigator.onLine) {
      syncOperations();
    }
  };

  // Add event listeners
  window.addEventListener("online", handleOnline);

  // Set up periodic sync (every minute)
  const intervalId = setInterval(() => {
    if (navigator.onLine) {
      syncOperations();
    }
  }, 60000);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    clearInterval(intervalId);
  };
};
