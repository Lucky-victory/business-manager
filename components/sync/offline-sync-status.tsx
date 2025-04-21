"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CloudOff,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useSyncStore,
  isSyncEnabledForUser,
  syncOperations,
} from "@/lib/sync/sync-service";
import { formatDistanceToNow } from "date-fns";

interface OfflineSyncStatusProps {
  showWhenOnline?: boolean;
}

export default function OfflineSyncStatus({
  showWhenOnline = false,
}: OfflineSyncStatusProps) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const {
    operations,
    pendingCount,
    failedCount,
    isSyncing: storeSyncing,
    lastSyncTime,
  } = useSyncStore();

  // Check if sync is enabled for the user
  useEffect(() => {
    const checkSyncEnabled = async () => {
      const enabled = await isSyncEnabledForUser();
      setIsEnabled(enabled);
    };

    checkSyncEnabled();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsExpanded(true); // Auto-expand when going offline
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Watch for syncing state
  useEffect(() => {
    setIsSyncing(storeSyncing);
  }, [storeSyncing]);

  // Don't show if online and showWhenOnline is false
  if (isOnline && !showWhenOnline) return null;

  // Don't show if sync is not enabled for this user
  if (!isEnabled) return null;

  // Calculate total operations
  const totalOperations = operations.length;
  const syncProgress =
    totalOperations > 0
      ? ((totalOperations - pendingCount) / totalOperations) * 100
      : 100;

  const handleSyncNow = async () => {
    if (isOnline && !isSyncing) {
      setIsSyncing(true);
      await syncOperations();
      setIsSyncing(false);
    }
  };

  return (
    <div className="mb-4">
      <Alert
        variant={isOnline ? "default" : "destructive"}
        className="relative overflow-hidden"
      >
        {isSyncing && (
          <div className="absolute top-0 left-0 right-0">
            <Progress value={syncProgress} className="h-1 rounded-none" />
          </div>
        )}

        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {isOnline ? (
              pendingCount > 0 ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )
            ) : (
              <WifiOff className="h-5 w-5" />
            )}
          </div>

          <div className="ml-3 flex-1">
            <AlertTitle className="flex items-center justify-between text-base">
              <span>
                {isOnline
                  ? pendingCount > 0
                    ? "Pending Sync"
                    : "All Data Synced"
                  : "Offline Mode"}
              </span>
              <Badge
                variant={isOnline ? "outline" : "destructive"}
                className="ml-2"
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </AlertTitle>

            <AlertDescription className="mt-1 text-sm">
              {isOnline ? (
                pendingCount > 0 ? (
                  <div className="space-y-2">
                    <p>
                      You have {pendingCount} pending{" "}
                      {pendingCount === 1 ? "operation" : "operations"} to sync.
                      {failedCount > 0 && ` (${failedCount} failed)`}
                    </p>
                    {isExpanded && (
                      <div className="text-xs mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Last sync attempt:</span>
                          <span>
                            {lastSyncTime
                              ? formatDistanceToNow(new Date(lastSyncTime), {
                                  addSuffix: true,
                                })
                              : "Never"}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        onClick={handleSyncNow}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>All your data is synced and up to date.</p>
                )
              ) : (
                <div className="space-y-2">
                  <p>
                    You're currently working offline. Changes you make will be
                    synchronized when you reconnect.
                  </p>
                  {isExpanded && (
                    <div className="text-xs mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Pending operations:</span>
                        <span>{pendingCount}</span>
                      </div>
                      {pendingCount > 0 && (
                        <div className="border-t pt-1 mt-1">
                          <div className="text-xs font-medium mb-1">
                            Queued operations:
                          </div>
                          <div className="max-h-20 overflow-y-auto">
                            {operations
                              .filter((op) => op.status === "pending")
                              .slice(0, 3)
                              .map((op, index) => (
                                <div key={index} className="text-xs truncate">
                                  {op.method}{" "}
                                  {op.endpoint.split("/").slice(-2).join("/")}
                                </div>
                              ))}
                            {pendingCount > 3 && (
                              <div className="text-xs text-right mt-1">
                                +{pendingCount - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-2"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </Button>
                  </div>
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}
