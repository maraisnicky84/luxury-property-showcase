"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, User, LogOut, Calendar, Settings, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ]

  const handleSignIn = () => {
    router.push("/auth/login")
  }

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-gray-900 py-3 text-gray-900 dark:text-white shadow-md"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className={`font-bold text-2xl ${isScrolled ? "text-primary dark:text-white" : "text-white"}`}>
          LUXE ESTATES
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-primary transition-colors ${
                isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white/90"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              href="/bookings"
              className={`hover:text-primary transition-colors ${
                isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white/90"
              }`}
            >
              Bookings
            </Link>
          )}

          {user && user.isAdmin && (
            <Link
              href="/admin"
              className={`hover:text-primary transition-colors ${
                isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white/90"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={isScrolled ? "" : "text-white hover:bg-white/10"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {user.hasNotifications && <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => router.push("/bookings")} className="relative">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                  {user.hasBookingUpdates && (
                    <Badge variant="destructive" className="ml-auto">
                      New
                    </Badge>
                  )}
                </DropdownMenuItem>

                {user.isAdmin && (
                  <DropdownMenuItem onSelect={() => router.push("/admin")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className={isScrolled ? "" : "text-white hover:bg-white/10"}
                onClick={handleSignIn}
              >
                <User className="w-5 h-5 mr-2" />
                Sign In
              </Button>
              <Button onClick={() => router.push("/auth/register")}>Register</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Theme Toggle Button (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={isScrolled ? "" : "text-white hover:bg-white/10"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <button
            className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <Link href="/" className="font-bold text-2xl">
                LUXE ESTATES
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground" aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary text-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {user && (
                <Link
                  href="/bookings"
                  className="text-foreground hover:text-primary text-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bookings
                </Link>
              )}

              {user && user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-foreground hover:text-primary text-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            <div className="mt-auto p-6 border-t flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode-mobile">Dark Mode</Label>
                <Switch
                  id="dark-mode-mobile"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              {user ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push("/profile")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push("/bookings")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    My Bookings
                  </Button>
                  {user.isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/admin")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push("/auth/login")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      router.push("/auth/register")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

