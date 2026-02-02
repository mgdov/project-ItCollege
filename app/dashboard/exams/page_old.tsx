"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Calendar, Lock, Play, CheckCircle2, Award, Target } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const exams = [
  {
    id: 1,
    subject: "Математика",
    title: "Экзамен по линейной алгебре",
    date: "15.02.2025",
    duration: "90 мин",
    questions: 25,
    status: "available",
    type: "exam",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    subject: "Программирование",
    title: "Зачёт по основам Python",
    date: "18.02.2025",
    duration: "60 мин",
    questions: 20,
    status: "completed",
    grade: 5,
    type: "test",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    subject: "Физика",
    title: "Экзамен по механике",
    date: "22.02.2025",
    duration: "90 мин",
    questions: 30,
    status: "locked",
    type: "exam",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    subject: "История",
    title: "Зачёт по истории России",
    date: "25.02.2025",
    duration: "45 мин",
    questions: 15,
    status: "locked",
    type: "test",
    gradient: "from-orange-500 to-red-500",
  },
]

export default function ExamsPage() {
  const getStatusBadge = (exam: (typeof exams)[0]) => {
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
                      {exam.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {exam.duration}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {exam.questions} вопр.
                  </div>
                </div>

                {exam.status === "available" && (
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Начать
                  </Button>
                )}
                {exam.status === "completed" && (
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Просмотреть результат
                  </Button>
                )}
                {exam.status === "locked" && (
                  <Button disabled className="w-full gap-2">
                    <Lock className="h-4 w-4" />
                    Недоступен
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      )
}
