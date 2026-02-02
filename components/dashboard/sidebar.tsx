"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  BookOpen,
  FlaskConical,
  Gamepad2,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/dashboard/schedule", label: "Расписание", icon: Calendar },
  { href: "/dashboard/lectures", label: "Лекции", icon: BookOpen },
  { href: "/dashboard/labs", label: "Лабораторные", icon: FlaskConical },
  { href: "/dashboard/games", label: "Физкультура", icon: Gamepad2 },
  { href: "/dashboard/exams", label: "Экзамены", icon: FileText },
  { href: "/dashboard/profile", label: "Профиль", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-semibold tracking-tight">EduSpace</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 shrink-0 md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed && "justify-center px-2",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
            <ThemeToggle />
            <Link href="/login" className="flex-1">
              <Button variant="ghost" className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}>
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Выйти</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
