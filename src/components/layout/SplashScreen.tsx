"use client";

import { PieChart } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white dark:bg-gray-950 animate-in fade-in duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="relative bg-linear-to-tr from-indigo-600 to-purple-600 rounded-2xl p-4 shadow-xl">
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        </div>
      </div>

      <div className="mt-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Finance Tracker
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Smart Finance Tracking
        </p>
      </div>

      <div className="absolute bottom-10">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
