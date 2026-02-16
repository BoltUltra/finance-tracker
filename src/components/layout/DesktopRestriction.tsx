import { Smartphone } from "lucide-react";

export function DesktopRestriction() {
  return (
    <div className="hidden lg:flex fixed inset-0 z-100 bg-gray-50 dark:bg-gray-950 flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
          <Smartphone className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mobile Experience Only
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            BudgetPro is designed to be used on your mobile phone or tablet.
            Please open this app on a mobile device for the best experience.
          </p>
        </div>

        {/* Optional QR Code or link could go here */}
        <div className="text-sm text-gray-400 pt-8">
          Resize your browser to mobile width to test on desktop.
        </div>
      </div>
    </div>
  );
}
