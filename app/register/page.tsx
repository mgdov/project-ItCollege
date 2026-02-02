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
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-screen">
        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
    <div className="relative flex min-h-screen">
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-[10%] right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>

        <Link href="/" className="absolute left-4 top-4 z-10">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">На главную</span>
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 z-10 mt-20 sm:mt-8"
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
          className="relative w-full max-w-lg z-10 mb-8"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Подать заявку</CardTitle>
              <CardDescription className="text-center">
                Заполните форму и загрузите необходимые документы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">ФИО</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Иванов Иван Иванович"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Телефон</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Документы</Label>
                  <p className="text-xs text-muted-foreground">
                    Загрузите паспорт, СНИЛС и другие документы
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 sm:p-8 transition-all hover:border-primary/50 hover:bg-muted/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-semibold mb-1">Нажмите для загрузки</span>
                    <span className="text-xs text-muted-foreground">PDF, JPG, PNG до 10MB</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3 group hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <span className="truncate text-sm font-medium">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="h-11 w-full font-semibold shadow-lg mt-6" disabled={isLoading}>
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

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Уже есть аккаунт? </span>
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Войти
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
            После проверки заявки администратор свяжется с вами
          </motion.p>
        </motion.div>
      </div>

      <div className="relative hidden lg:block lg:flex-1">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
            alt="Education platform"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/80 via-accent/60 to-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Присоединяйтесь к EduSpace
              </h2>
              <p className="text-lg text-white/90 leading-relaxed max-w-lg">
                Начните своё обучение на современной платформе с доступом к лучшим образовательным материалам
              </p>
            </div>
 
            <div className="flex flex-wrap gap-4 max-w-lg">
              <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 flex-1 min-w-[150px]">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-white/80">Курсов доступно</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 flex-1 min-w-[150px]">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-white/80">Успешность</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
