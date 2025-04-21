import React from "react";
import { Metadata } from "next";
import OfflineSyncConfig from "@/components/admin/offline-sync-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WifiOff, Settings, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline Sync Configuration - Biz Manager Admin",
  description: "Configure offline synchronization settings for premium users",
};

export default function OfflineSyncAdminPage() {
  // In a real application, you would check if the current user is an admin
  const isAdmin = true;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <WifiOff className="h-8 w-8" />
            Offline Sync Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure offline data synchronization for premium users
          </p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="about">
            <Info className="h-4 w-4 mr-2" />
            About Offline Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <OfflineSyncConfig isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="about" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>About Offline Sync</CardTitle>
              <CardDescription>
                Understanding the offline synchronization feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">What is Offline Sync?</h3>
                <p className="text-muted-foreground mt-1">
                  Offline Sync allows premium users to continue working with the
                  application even when they don't have an internet connection.
                  Changes made while offline are stored locally and synchronized
                  with the server when the connection is restored.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">How it Works</h3>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>
                    <strong>Detect Offline Status:</strong> The application
                    detects when the user goes offline and enables offline mode.
                  </li>
                  <li>
                    <strong>Queue Operations:</strong> Any write operations
                    (POST, PUT, DELETE) performed while offline are queued
                    locally.
                  </li>
                  <li>
                    <strong>Visual Indicators:</strong> Users see clear
                    indicators that they're working offline and which operations
                    are pending.
                  </li>
                  <li>
                    <strong>Automatic Sync:</strong> When the connection is
                    restored, queued operations are automatically synchronized
                    with the server.
                  </li>
                  <li>
                    <strong>Conflict Resolution:</strong> If conflicts occur
                    during synchronization, they are resolved according to
                    predefined strategies.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium">Premium Feature</h3>
                <p className="text-muted-foreground mt-1">
                  Offline Sync is available exclusively to premium users. When
                  enabled in the settings, only users with an active premium
                  subscription will have access to this functionality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    Inform users about the offline capabilities and limitations
                    through onboarding and in-app guidance.
                  </li>
                  <li>
                    Regularly monitor the sync logs to identify and address any
                    recurring synchronization issues.
                  </li>
                  <li>
                    Consider implementing a data size limit for offline storage
                    to prevent excessive local storage usage.
                  </li>
                  <li>
                    Test the offline functionality thoroughly across different
                    devices and network conditions.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
