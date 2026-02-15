"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useHaptic } from "@/hooks/useHaptic";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { LayoutGrid, LogOut, Palette, Wallet, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { userData } = useUserData();
  const { isEnabled: hapticEnabled, toggle: toggleHaptic } = useHaptic();

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userData?.displayName || user?.displayName || "User";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8 pb-24">
      {/* Profile Header */}
      <div className="flex items-center gap-4 py-4">
        <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
          <AvatarImage src={user?.photoURL || ""} />
          <AvatarFallback className="text-xl bg-blue-600 text-white">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {displayName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.email || "No email"}
          </p>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">
          General
        </h2>

        <SettingsItem
          icon={<LayoutGrid className="w-5 h-5" />}
          label="Categories"
          href="/settings/categories"
        />

        <SettingsItem
          icon={<Wallet className="w-5 h-5" />}
          label="Budget"
          href="/budget" // Directing to budget page for now where adjustment lives
        />

        <SettingsItem
          icon={<Palette className="w-5 h-5" />}
          label="Theme"
          rightElement={<ThemeToggle />}
        />

        <SettingsItem
          icon={<Smartphone className="w-5 h-5" />}
          label="Haptic Feedback"
          rightElement={
            <Switch checked={hapticEnabled} onCheckedChange={toggleHaptic} />
          }
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">
          Account
        </h2>

        <SettingsItem
          icon={<LogOut className="w-5 h-5" />}
          label="Log Out"
          onClick={logout}
          destructive
        />
      </div>
    </div>
  );
}
