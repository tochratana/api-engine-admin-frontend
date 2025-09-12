"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/lib/hooks";

export default function DashboardHeader() {
  const { setTheme, theme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  // next-themes reads from localStorage and can cause mismatch during SSR.
  // Track mounted to avoid rendering theme-sensitive UI on the server.
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayName =
    user?.name || (user?.firstName && user?.lastName)
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "Admin";

  const userEmail = user?.email || "admin@example.com";
  const userInitial = displayName.charAt(0).toUpperCase();

  console.log("This is a data for user ", user);

  // Testing for user

  console.log("Email for admin ", user?.email);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-card-foreground lg:hidden">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Simple toggle button to avoid dropdown click issues */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              mounted ? `Toggle theme (current: ${theme})` : "Toggle theme"
            }
            onClick={() => {
              if (!mounted) return;
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {mounted ? (
              theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-accent-foreground">
                {userInitial}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-card-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
