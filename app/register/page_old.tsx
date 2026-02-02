"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Upload, X, CheckCircle2, Loader2, ArrowLeft, Mail, Phone as PhoneIcon, User, FileText } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface FileUpload {
  id: string
  name: string
  type: string
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  const [files, setFiles] = useState<FileUpload[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (newFiles) {
      const fileArray = Array.from(newFiles).map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type,
      }))
      setFiles([...files, ...fileArray])
    }
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-screen">
        {/* Left Side - Success Message */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {/* Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-[20%] left-1/4 h-[500px] w-[500px] rounded-full bg-success/10 blur-3xl" />
            <div className="absolute -bottom-[10%] right-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="absolute right-4 top-4 z-10">
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md z-10"
          >
            <Card className="border-border/50 bg-card/80 text-center backdrop-blur-xl shadow-2xl">
              <CardContent className="pt-12 pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 border-4 border-success/20"
                >
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </motion.div>
                <h2 className="mb-3 text-3xl font-bold">Заявка отправлена!</h2>
                <p className="mb-8 text-muted-foreground leading-relaxed px-4">
                  Ваша заявка успешно отправлена на рассмотрение. После проверки документов администратор свяжется с вами и
                  сообщит данные для входа.
                </p>
                <div className="space-y-3">
                  <Link href="/" className="block">
                    <Button className="w-full h-11 font-semibold shadow-lg">
                      Вернуться на главную
                    </Button>
                  </Link>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full h-11">
                      Страница входа
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Image (hidden on mobile) */}
        <div className="relative hidden lg:block lg:flex-1">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop"
              alt="Student success"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-success/80 via-success/60 to-primary/80 mix-blend-multiply" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[20%] right-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <Link href="/" className="relative mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold tracking-tight">EduSpace</span>
      </Link>

      <Card className="relative w-full max-w-lg border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Подать заявку</CardTitle>
          <CardDescription>Заполните форму и загрузите необходимые документы</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Документы</Label>
              <p className="text-xs text-muted-foreground">Загрузите паспорт, СНИЛС и другие необходимые документы</p>
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Нажмите для загрузки</span>
                  <span className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG до 10MB</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2"
                    >
                      <span className="truncate text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="h-11 w-full" disabled={isLoading || files.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                "Отправить заявку"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Войти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
