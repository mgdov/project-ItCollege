"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Eye, EyeOff, Loader2, ArrowLeft, Shield, Lock, User } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-[10%] right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        {/* Theme Toggle */}
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>

        {/* Back Button */}
        <Link href="/" className="absolute left-4 top-4 z-10">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">На главную</span>
          </Button>
        </Link>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 z-10"
        >
          <Link href="/" className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <GraduationCap className="h-9 w-9 text-primary-foreground" />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold tracking-tight">EduSpace</span>
              <p className="text-sm text-muted-foreground">Образование будущего</p>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative w-full max-w-md z-10"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Вход в систему</CardTitle>
              <CardDescription className="text-center">
                Введите ваши учётные данные для доступа к платформе
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login" className="text-sm font-medium">
                    Логин
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login"
                      type="text"
                      placeholder="Введите логин"
                      value={formData.login}
                      onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Пароль
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-11 pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="h-11 w-full font-semibold shadow-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    "Войти в систему"
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">или</span>
                  </div>
                </div>

                <Link href="/admin" className="w-full block">
                  <Button variant="outline" className="h-11 w-full gap-2 font-medium">
                    <Shield className="h-4 w-4" />
                    Войти как администратор
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Ещё нет аккаунта? </span>
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Подать заявку
                </Link>
              </div>
            </CardContent>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            Данные для входа выдаются администратором после проверки вашей заявки
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Image (hidden on mobile) */}
      <div className="relative hidden lg:block lg:flex-1">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
            alt="Students learning"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>

        {/* Overlay Content */}
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Добро пожаловать в EduSpace
              </h2>
              <p className="text-lg text-white/90 leading-relaxed max-w-lg">
                Современная платформа для эффективного обучения с интерактивными инструментами и персональным подходом
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-white/80">Студентов</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-white/80">Курсов</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
