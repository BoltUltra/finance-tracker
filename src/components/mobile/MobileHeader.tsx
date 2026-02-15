import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";

export function MobileHeader() {
  const { user } = useAuth();
  const { userData } = useUserData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName =
    userData?.displayName || user?.displayName?.split(" ")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-4 dark:bg-gray-950">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-800">
          <AvatarImage src={user?.photoURL || ""} alt={displayName} />
          <AvatarFallback className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getGreeting()}, {displayName}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Have a good day!
          </p>
        </div>
      </div>
      <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
      </button>
    </header>
  );
}
