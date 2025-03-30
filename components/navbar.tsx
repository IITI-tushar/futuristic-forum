"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Menu, X, Home, Users, Bookmark, Settings, Moon, Sun, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Communities", href: "/communities", icon: Users },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-primary/10 py-3" : "bg-transparent py-5",
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(0, 255, 255, 0.5)",
                    "0 0 20px rgba(0, 255, 255, 0.5)",
                    "0 0 0px rgba(0, 255, 255, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center"
              >
                <Zap className="h-5 w-5 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-bold text-xl cyber-text">CYBER</span>
                <span className="text-xs -mt-1 text-muted-foreground">NEXUS</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-nav-item"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-muted/50 border-primary/10 focus-visible:ring-primary/30 cyber-input"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative cyber-button-icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative cyber-button-icon">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            <Avatar className="h-8 w-8 hidden sm:flex cyber-avatar">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden cyber-button-icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden cyber-mobile-menu"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl cyber-text">CYBER</span>
                    <span className="text-xs -mt-1 text-muted-foreground">NEXUS</span>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="cyber-button-icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-muted/50 border-primary/10 focus-visible:ring-primary/30 cyber-input"
                />
              </div>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors cyber-nav-item-mobile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10 cyber-avatar">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">User Name</p>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

