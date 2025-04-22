"use client";

import { useAuth } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { PlanFeatures } from "@/types/subscription";
import { ProFeatureBadge } from "@/components/ui/pro-feature-badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  LogOut,
  Sparkles,
  ChevronDown,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { TabType } from "./types";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const router = useRouter();
  const auth = useAuth();
  const isMobile = useIsMobile();
  const { clearState } = useStore();
  const { hasFeatureAccess, setShowPlansModal, setFeatureClicked } =
    useSubscriptionStore();

  function handleLogout() {
    authClient.signOut().then(() => {
      clearState();
      router.push("/");
    });
  }

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!auth?.user?.name) return "U";
    const names = auth.user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const navItems = [
    {
      id: "sales",
      label: "Sales",
      icon: <BarChart3 className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: "credit",
      label: "Credit",
      icon: <CreditCard className="h-5 w-5" />,
      enabled: hasFeatureAccess("credit"),
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: <DollarSign className="h-5 w-5" />,
      enabled: hasFeatureAccess("expenses"),
    },
  ];

  // Filter sidebar items for mobile to prevent duplication with bottom tab bar
  const sidebarItems = isMobile
    ? [
        {
          id: "profile",
          label: "Profile Settings",
          icon: <Settings className="h-5 w-5" />,
          onClick: () => router.push("/profile"),
          enabled: true,
        },
        {
          id: "subscription",
          label: "Subscription Plans",
          icon: <Sparkles className="h-5 w-5" />,
          onClick: () => router.push("/plans"),
          enabled: true,
        },
      ]
    : navItems;

  return (
    <aside
      className={cn(
        "bg-white relative dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-full z-30 transition-all duration-300",
        isMobile
          ? `fixed inset-y-0 left-0 w-64 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`
          : `${sidebarOpen ? "w-64" : "w-20"} flex-shrink-0`
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div
          className={cn(
            "flex items-center",
            !sidebarOpen && !isMobile && "justify-center w-full"
          )}
        >
          {sidebarOpen ? (
            <h1 className="font-bold text-xl">Dashboard</h1>
          ) : (
            !isMobile && <BarChart3 className="h-6 w-6" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(!sidebarOpen && !isMobile && "hidden")}
        >
          {isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="py-4 px-2 space-y-3">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1 py-4",
              !sidebarOpen && !isMobile && "justify-center px-2"
            )}
            onClick={() => {
              if (!item.enabled) {
                setFeatureClicked(item.id as keyof PlanFeatures);
                setShowPlansModal(true);
                return;
              }

              if ("onClick" in item) {
                item.onClick();
              } else {
                setActiveTab(item.id as TabType);
              }

              if (isMobile) setSidebarOpen(false);
            }}
          >
            {item.icon}
            {(sidebarOpen || isMobile) && (
              <>
                <span className="ml-3">{item.label}</span>
                {!item.enabled && <ProFeatureBadge className="ml-auto" />}
              </>
            )}
          </Button>
        ))}
      </div>

      {/* Logout Button for Mobile */}
      {isMobile && (
        <div className="px-2 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      )}

      {/* User Profile Section */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800 p-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                !sidebarOpen && !isMobile && "justify-center px-2"
              )}
            >
              <Avatar className="h-8 w-8 border-2 border-emerald-100">
                <AvatarImage src={auth?.user?.image || ""} alt="User Avatar" />
                <AvatarFallback className="bg-emerald-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {(sidebarOpen || isMobile) && (
                <>
                  <span className="ml-3 truncate">
                    {auth?.user?.name || "User"}
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          {/* Popover content - Only shown in Desktop */}
          {!isMobile && (
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {auth?.user?.name || "User"}
                </div>
                <div className="px-2 py-1 text-xs text-muted-foreground truncate">
                  {auth?.user?.email || ""}
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left px-2 py-1.5"
                  asChild
                >
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left px-2 py-1.5"
                  asChild
                >
                  <Link href="/plans">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Subscription Plans
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left px-2 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>
    </aside>
  );
}
