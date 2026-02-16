"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!", {
        icon: <Wifi className="w-4 h-4" />,
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Changes may not save.", {
        icon: <WifiOff className="w-4 h-4" />,
        duration: Infinity, // Keep visible until online
        id: "offline-toast", // ID to programmatically dismiss if needed
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null; // Logic only component
}
