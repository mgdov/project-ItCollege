"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Calendar, Lock, Play, CheckCircle2, Award, Target } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос к бэкенду
// Пример: const { data: exams, isLoading } = useExams()
const useExams = () => {
  const [exams, setExams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Заменить на реальный API запрос
    // fetch('/api/exams').then(res => res.json()).then(setExams)
    setIsLoading(false)
    setExams([]) // Пустой массив вместо статических данных
  }, [])

  return { exams, isLoading }
}

export default function ExamsPage() {
  const { exams, isLoading } = useExams()

  const getStatusBadge = (exam: any) => {
    switch (exam.status) {
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Сдано: {exam.grade}
          </Badge>
        )
      case "available":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <Play className="h-3 w-3 mr-1" />
            Доступен
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            Заблокирован
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-12 md:px-8 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173"
            alt="Экзамены"
            fill
            className="object-cover"
            priority
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Экзамены и зачёты
          </h1>
          <p className="mt-3 text-lg text-white/90 md:text-xl">
            Итоговые тестирования по предметам
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
              <Award className="h-5 w-5" />
              <span className="font-semibold">{exams.filter(e => e.status === "completed").length} пройдено</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
              <Target className="h-5 w-5" />
              <span className="font-semibold">{exams.filter(e => e.status === "available").length} доступно</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Exams Grid */}
      <div className="px-4 py-8 md:px-8 md:py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка экзаменов...</p>
            </div>
          </div>
        ) : exams.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет доступных экзаменов</h3>
              <p className="text-muted-foreground">Экзамены и зачёты появятся здесь, когда будут назначены</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {exams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`group relative overflow-hidden border-2 transition-all duration-300 ${exam.status !== "locked"
                    ? "hover:border-primary hover:shadow-2xl hover:-translate-y-1"
                    : "opacity-60"
                    }`}
                >
                  {/* Gradient Header */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${exam.gradient}`} />

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="font-semibold">
                        {exam.type === "exam" ? "Экзамен" : "Зачёт"}
                      </Badge>
                      {getStatusBadge(exam)}
                    </div>
                    <CardTitle className="mt-3 text-xl group-hover:text-primary transition-colors">
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${exam.gradient}`} />
                      {exam.subject}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3 text-center">
                        <Calendar className="h-5 w-5 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Дата</span>
                        <span className="text-sm font-semibold mt-1">{exam.date}</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3 text-center">
                        <Clock className="h-5 w-5 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Время</span>
                        <span className="text-sm font-semibold mt-1">{exam.duration}</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3 text-center">
                        <FileText className="h-5 w-5 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Вопросы</span>
                        <span className="text-sm font-semibold mt-1">{exam.questions}</span>
                      </div>
                    </div>

                    {exam.status === "available" && (
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all">
                        <Play className="h-4 w-4 mr-2" />
                        Начать тестирование
                      </Button>
                    )}
                    {exam.status === "completed" && (
                      <Button variant="outline" className="w-full border-2 border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Посмотреть результат
                      </Button>
                    )}
                    {exam.status === "locked" && (
                      <Button disabled className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Недоступно
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
