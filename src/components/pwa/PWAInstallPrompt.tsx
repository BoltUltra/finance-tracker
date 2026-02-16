"use client";

import { useState, useEffect } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X, Share, PlusSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useAuth } from "@/context/AuthContext";

export function PWAInstallPrompt() {
  const { isInstallable, isIOS, isStandalone, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Optional: Only show to logged in users? Or everyone. Let's show to everyone.

  // Don't show if already in standalone mode
  if (isStandalone) return null;

  // Auto-show logic (optional, but requested: "android can automatically see... if it is ios, add a quick instruction")
  // We can show a small banner at the bottom or top.

  if (isIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Install App
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Install BudgetPro for the best experience.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded">
                <Share className="h-4 w-4 text-blue-500" />
              </span>
              <span>
                Tap the <span className="font-bold">Share</span> button
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded">
                <PlusSquare className="h-4 w-4 text-gray-500" />
              </span>
              <span>
                Select <span className="font-bold">Add to Home Screen</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm">Install App</h3>
            <p className="text-xs text-indigo-100">
              Add to home screen for quick access
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={install}
            className="bg-white text-indigo-600 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Install
          </Button>
          <button
            onClick={() => setIsOpen(false)} // Need to handle dismiss properly, maybe local storage
            className="absolute -top-2 -right-2 bg-white text-gray-500 rounded-full p-1 shadow-md hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
