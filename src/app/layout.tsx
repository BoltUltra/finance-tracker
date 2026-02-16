import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { DesktopRestriction } from "@/components/layout/DesktopRestriction";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal finance tracker",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DesktopRestriction />
          <AuthProvider>
            <PWAInstallPrompt />
            <OfflineIndicator />
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
