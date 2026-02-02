"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Menu, X, Shield, Home, Info, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
          ? "border-border/60 bg-background/95 backdrop-blur-lg shadow-sm"
          : "border-border/40 bg-background/80 backdrop-blur-xl"
        }`}
    >
      <div className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-all group-hover:shadow-xl group-hover:shadow-primary/30">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight">EduSpace</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Образование будущего</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="#features">
            <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
              <Home className="h-4 w-4" />
              Возможности
            </Button>
          </Link>
          <Link href="#about">
            <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
              <Info className="h-4 w-4" />
              О платформе
            </Button>
          </Link>
          <Link href="#contact">
            <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Контакты
            </Button>
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden xl:inline">Админ</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="bg-background/50">
              Войти
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="shadow-lg shadow-primary/20">
              Подать заявку
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/40 bg-background/95 backdrop-blur-lg lg:hidden overflow-hidden"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-4 sm:px-6">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base" size="lg">
                  <Home className="h-5 w-5" />
                  Возможности
                </Button>
              </Link>
              <Link href="#about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base" size="lg">
                  <Info className="h-5 w-5" />
                  О платформе
                </Button>
              </Link>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base" size="lg">
                  <Phone className="h-5 w-5" />
                  Контакты
                </Button>
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base" size="lg">
                  <Shield className="h-5 w-5" />
                  Админ-панель
                </Button>
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40 mt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-base" size="lg">
                    Войти
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-base shadow-lg" size="lg">
                    Подать заявку
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
