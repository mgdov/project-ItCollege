"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Code2, Gamepad2, GraduationCap, LineChart, FileText, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const features = [
  {
    icon: GraduationCap,
    title: "Личный кабинет",
    description: "Ваши данные, успеваемость и прогресс обучения в одном месте",
    color: "text-primary",
    bg: "bg-primary/10",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: Calendar,
    title: "Расписание занятий",
    description: "Модульная система с расписанием всех пар и занятий",
    color: "text-accent",
    bg: "bg-accent/10",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: BookOpen,
    title: "Лекции и материалы",
    description: "Доступ к учебным материалам в форматах Word и PDF",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: Code2,
    title: "Онлайн-компилятор",
    description: "Пишите и тестируйте код прямо в браузере",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: Gamepad2,
    title: "Интерактивные игры",
    description: "Шахматы, шашки и викторины для физкультуры",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: LineChart,
    title: "Отслеживание прогресса",
    description: "Автоматический расчёт успеваемости в процентах",
    color: "text-success",
    bg: "bg-success/10",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: FileText,
    title: "Экзамены и зачёты",
    description: "Система тестирования с вариантами ответов",
    color: "text-warning",
    bg: "bg-warning/10",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop",
  },
  {
    icon: Clock,
    title: "Гибкое время",
    description: "Настраиваемая длительность занятий (1.5 часа по умолчанию)",
    color: "text-destructive",
    bg: "bg-destructive/10",
    image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=400&auto=format&fit=crop",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 md:mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Возможности платформы
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Всё для эффективного обучения
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Современные инструменты и технологии для качественного образования
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-1">
                {/* Image Header */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

                  {/* Icon Badge */}
                  <div className={`absolute bottom-3 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
