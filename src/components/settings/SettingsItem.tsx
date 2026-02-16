import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { useHaptic } from "@/hooks/useHaptic";

interface SettingsItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  rightElement?: ReactNode;
  className?: string; // Allow overrides/margins
  destructive?: boolean;
}

export function SettingsItem({
  icon,
  label,
  onClick,
  href,
  rightElement,
  className,
  destructive = false,
}: SettingsItemProps) {
  const { trigger } = useHaptic();

  const Content = (
    <div
      className={`flex items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all hover:bg-gray-50 dark:hover:bg-gray-900 ${className}`}
      onClick={() => trigger("selection")}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-xl ${
            destructive
              ? "bg-red-50 text-red-600"
              : "bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          }`}
        >
          {icon}
        </div>
        <span
          className={`font-medium text-lg ${
            destructive ? "text-red-600" : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {rightElement}
        {!rightElement && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {Content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        {Content}
      </button>
    );
  }

  return <div className="block w-full">{Content}</div>;
}
