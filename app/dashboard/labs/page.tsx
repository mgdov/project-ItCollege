"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlaskConical, Code2, Calculator, FileQuestion, Sparkles, Clock, ArrowRight, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const labTypes = [
  {
    id: "programming",
    title: "Программирование",
    description: "Онлайн-компилятор для написания и тестирования кода на разных языках",
    icon: Code2,
    color: "text-blue-500",
    bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    available: 3,
    total: 5,
    href: "/dashboard/labs/programming",
  },
  {
    id: "math",
    title: "Математика",
    description: "Решение уравнений и математических задач с интерактивными примерами",
    icon: Calculator,
    color: "text-purple-500",
    bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/20",
    available: 5,
    total: 8,
    href: "/dashboard/labs/math",
  },
  {
    id: "quiz",
    title: "Квизы",
    description: "Интерактивные тесты и вопросы по различным предметам",
    icon: FileQuestion,
    color: "text-green-500",
    bg: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
    available: 4,
    total: 7,
    href: "/dashboard/labs/quiz",
  },
]

export default function LabsPage() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200"
            alt="Labs Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative px-4 py-16 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
            >
              <FlaskConical className="h-5 w-5" />
              <span className="text-sm font-medium">Интерактивное обучение</span>
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Лабораторные работы
            </h1>
            <p className="mb-8 text-lg opacity-90 md:text-xl">
              Практические задания и эксперименты для закрепления знаний
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Trophy className="h-5 w-5" />
                <span>12 выполнено</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
                <span>5 доступно</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Labs Grid */}
      <div className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">Выберите направление</h2>
            <p className="text-muted-foreground">Интерактивные лабораторные работы по различным дисциплинам</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {labTypes.map((lab, index) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link href={lab.href}>
                  <Card className={`group h-full border-2 ${lab.borderColor} transition-all hover:scale-105 hover:shadow-2xl`}>
                    <CardHeader>
                      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${lab.bg} transition-transform group-hover:scale-110`}>
                        <lab.icon className={`h-8 w-8 ${lab.color}`} />
                      </div>
                      <CardTitle className="text-2xl">{lab.title}</CardTitle>
                      <CardDescription className="text-base">{lab.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 flex items-center justify-between">
                        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm">
                          {lab.available} из {lab.total} доступно
                        </Badge>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          1-2 часа
                        </span>
                      </div>
                      <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 transition-all hover:from-blue-700 hover:to-purple-700 group-hover:translate-x-1">
                        Начать работу
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
