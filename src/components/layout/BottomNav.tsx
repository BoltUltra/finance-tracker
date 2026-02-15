"use client";

import { useHaptic } from "@/hooks/useHaptic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, Wallet, User } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Budget", href: "/budget", icon: PieChart },
  { name: "Profile", href: "/settings", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { trigger } = useHaptic();

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-lg border border-gray-200/50 shadow-2xl rounded-2xl z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trigger("selection")}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Icon
                className={clsx("w-6 h-6", isActive && "fill-current")}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
