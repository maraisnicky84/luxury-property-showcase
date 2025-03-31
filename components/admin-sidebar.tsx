"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Calendar, Users, Home, BarChart3, Menu, X, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { usePropertyStatus } from "@/hooks/use-property-status"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { propertyStatus } = usePropertyStatus()

  const navItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin",
      exact: true,
    },
    {
      title: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/bookings",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      title: "Availability",
      icon: <AlertTriangle className="h-5 w-5" />,
      href: "/admin/availability",
    },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsMobileOpen(true)} className="bg-background">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all lg:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-lg transition-transform duration-300 ease-in-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col p-4 space-y-1">
            <Button
              variant="outline"
              className="justify-start mb-4"
              onClick={() => {
                router.push("/")
                setIsMobileOpen(false)
              }}
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Home
            </Button>

            <Separator className="my-2" />

            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item) ? "default" : "ghost"}
                className={cn("justify-start", isActive(item) ? "" : "hover:bg-muted")}
                onClick={() => {
                  router.push(item.href)
                  setIsMobileOpen(false)
                }}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <Separator className="mb-4" />
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-30 border-r bg-background transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn("flex items-center h-16 px-4 border-b", isCollapsed ? "justify-center" : "justify-between")}
          >
            {!isCollapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col p-2 space-y-1">
            <Button
              variant="outline"
              size={isCollapsed ? "icon" : "default"}
              className={cn(isCollapsed ? "justify-center w-10 h-10 mx-auto" : "justify-start w-full", "mb-4")}
              onClick={() => router.push("/")}
              title={isCollapsed ? "Go to Home" : undefined}
            >
              <Home className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Go to Home</span>}
            </Button>

            <Separator className="my-2" />

            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item) ? "default" : "ghost"}
                size={isCollapsed ? "icon" : "default"}
                className={cn(
                  isCollapsed ? "justify-center w-10 h-10 mx-auto" : "justify-start w-full",
                  isActive(item) ? "" : "hover:bg-muted",
                )}
                onClick={() => router.push(item.href)}
                title={isCollapsed ? item.title : undefined}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            ))}
          </div>

          <div className={cn("p-2 border-t mt-auto", isCollapsed ? "flex justify-center" : "")}>
            <Button
              variant="outline"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                isCollapsed ? "w-10 h-10" : "w-full justify-start",
                "text-destructive hover:text-destructive",
              )}
              onClick={handleSignOut}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

