
"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import { MobileTabBar } from "@/components/layouts/mobile-tabbar";
import { PlansModal } from "@/components/subscription/plans-modal";
import { TabType } from "./types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab:TabType) => void;
}

export function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Close sidebar by default on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          isMobile ? "pb-16" : ""
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4">
          <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <PlansModal />
    </div>
  );
}
