"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  School,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ClipboardList,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Главная", icon: LayoutDashboard },
  { href: "/admin/groups", label: "Группы", icon: School },
  { href: "/admin/students", label: "Студенты", icon: Users },
  { href: "/admin/schedule", label: "Расписание", icon: Calendar },
  { href: "/admin/subjects", label: "Предметы", icon: BookOpen },
  { href: "/admin/exams", label: "Экзамены", icon: ClipboardList },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight">EduSpace</span>
                <span className="text-xs text-muted-foreground">Админ-панель</span>
              </div>
            )}
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
