"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Trash2, WifiOff } from "lucide-react";
import { useSyncStore, syncOperations } from "@/lib/sync/sync-service";
import { formatDistanceToNow } from "date-fns";

interface OfflineSyncConfigProps {
  isAdmin: boolean;
}

export default function OfflineSyncConfig({ isAdmin }: OfflineSyncConfigProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    isEnabled,
    setEnabled,
    operations,
    pendingCount,
    failedCount,
    lastSyncTime,
    resetFailedOperations,
    clearAllOperations,
  } = useSyncStore();

  // Only admins can access this component
  if (!isAdmin) {
    return null;
  }

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await syncOperations();
    setIsSyncing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <WifiOff className="h-5 w-5" />
              Offline Sync Configuration
            </CardTitle>
            <CardDescription>
              Configure offline data synchronization for premium users
            </CardDescription>
          </div>
          <Badge variant={isEnabled ? "default" : "outline"}>
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">Enable Offline Sync</h3>
            <p className="text-sm text-gray-500">
              Allow premium users to perform operations while offline
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={setEnabled}
            aria-label="Toggle offline sync"
          />
        </div>

        <div className="border rounded-md p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-3">Sync Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending operations:</span>
              <span className="font-medium">{pendingCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Failed operations:</span>
              <span className="font-medium text-red-600">{failedCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last sync:</span>
              <span className="font-medium">
                {lastSyncTime
                  ? formatDistanceToNow(new Date(lastSyncTime), {
                      addSuffix: true,
                    })
                  : "Never"}
              </span>
            </div>
          </div>
        </div>

        {operations.length > 0 && (
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-3">Operation Queue</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {operations.map((op) => (
                <div
                  key={op.id}
                  className="text-xs p-2 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {op.method} {op.endpoint}
                    </div>
                    <div className="text-gray-500">
                      {new Date(op.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      op.status === "completed"
                        ? "success"
                        : op.status === "failed"
                        ? "destructive"
                        : op.status === "syncing"
                        ? "default"
                        : "outline"
                    }
                  >
                    {op.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFailedOperations}
            disabled={failedCount === 0}
          >
            Retry Failed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllOperations}
            disabled={operations.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
        <Button
          onClick={handleSyncNow}
          disabled={isSyncing || pendingCount === 0 || !navigator.onLine}
          size="sm"
        >
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
