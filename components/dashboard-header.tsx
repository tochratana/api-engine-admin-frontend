"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/lib/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const { setTheme, theme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
