"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FolderOpen, Star, HardDrive, Settings, LogOut, Menu, X } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Ratings", href: "/dashboard/ratings", icon: Star },
  { name: "Storage", href: "/dashboard/storage", icon: HardDrive },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
          "fixed lg:relative inset-y-0 left-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Panel</h2>}
            <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setIsCollapsed(!isCollapsed)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  isCollapsed && "justify-center",
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground",
              isCollapsed && "justify-center",
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
