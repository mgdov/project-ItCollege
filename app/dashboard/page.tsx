"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressCard } from "@/components/dashboard/progress-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { UpcomingClasses } from "@/components/dashboard/upcoming-classes"
import { GradesChart } from "@/components/dashboard/grades-chart"
import { GraduationCap, BookOpen, Trophy, Target, ArrowRight, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { studentStore, useStore } from "@/lib/store"
import { EmptyState } from "@/components/shared"

export default function DashboardPage() {
  const profile = useStore(studentStore, (state) => state.profile)

  // Show empty state when no profile data
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState
          title="Нет данных профиля"
          description="Данные будут загружены после подключения к серверу"
        />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-6 md:p-8"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
            alt="Education background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Активный студент
          </div>
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Добро пожаловать, {profile.name}!</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Группа {profile.group} • {profile.course} курс • {profile.specialty}
          </p>
        </div>
      </motion.div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 shadow-lg">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold md:text-xl">Готовы продолжить обучение?</h2>
                <p className="text-sm text-muted-foreground md:text-base">Проверьте расписание занятий</p>
              </div>
            </div>
            <Link href="/dashboard/schedule">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                Начать учёбу
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <ProgressCard
          title="Общий прогресс"
          value={profile.progress || 0}
          icon={<Target className="h-5 w-5 text-primary" />}
          description="Прогресс обучения"
        />
        <StatsCard
          title="Средний балл"
          value={(profile.averageGrade || 0).toFixed(1)}
          icon={<Trophy className="h-5 w-5 text-warning" />}
        />
        <StatsCard
          title="Курс"
          value={`${profile.course} курс`}
          icon={<GraduationCap className="h-5 w-5 text-accent" />}
        />
        <StatsCard
          title="Группа"
          value={profile.group}
          icon={<BookOpen className="h-5 w-5 text-success" />}
          description={profile.specialty}
        />
      </motion.div>

      {/* Charts and Upcoming */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <GradesChart />
        <UpcomingClasses />
      </motion.div>

      {/* Student Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mt-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Информация о студенте
            </CardTitle>
            <CardDescription>Ваши личные данные и данные об обучении</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">ФИО</p>
                <p className="mt-1 font-semibold">{profile.name}</p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">Группа</p>
                <p className="mt-1 font-semibold">{profile.group}</p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">Курс</p>
                <p className="mt-1 font-semibold">{profile.course} курс</p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">Специальность</p>
                <p className="mt-1 font-semibold">{profile.specialty}</p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">Успеваемость</p>
                <p className="mt-1 font-semibold">{profile.progress || 0}%</p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground">Средний балл</p>
                <p className="mt-1 font-semibold">{(profile.averageGrade || 0).toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
