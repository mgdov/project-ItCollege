"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronLeft, ChevronRight, Clock, BookOpen, FlaskConical, Lock, Play, CheckCircle2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"

const weekDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]

// TODO: Replace with API call
function useSchedule() {
  return {
    scheduleData: {} as Record<string, any[]>,
    isLoading: true,
  }
}

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDay, setSelectedDay] = useState("Понедельник")
  const { scheduleData, isLoading } = useSchedule()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Завершено
          </Badge>
        )
      case "available":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <Play className="h-3 w-3 mr-1" />
            Доступно
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            Заблокировано
          </Badge>
        )
      default:
        return null
    }
  }

  const getLessonLink = (lesson: { id: number; type: string; subject: string; status: string }) => {
    if (lesson.status === "locked") return null
    return lesson.type === "lecture" ? "/dashboard/lectures" : "/dashboard/labs"
  }

  const totalLessons = Object.values(scheduleData).flat().length
  const completedLessons = Object.values(scheduleData).flat().filter(l => l.status === "completed").length
  const availableLessons = Object.values(scheduleData).flat().filter(l => l.status === "available").length

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-12 md:px-8 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe"
            alt="Расписание"
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
            Расписание занятий
          </h1>
          <p className="mt-3 text-lg text-white/90 md:text-xl">
            Учебное расписание на неделю
          </p>

          {/* Week Navigation */}
          <div className="mt-6 flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-white/80 text-sm">Текущая неделя</p>
              <p className="text-white font-semibold text-lg">
                Неделя {currentWeek + 1}
              </p>
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">{totalLessons} занятий</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">{completedLessons} пройдено</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
              <Play className="h-5 w-5" />
              <span className="font-semibold">{availableLessons} доступно</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Schedule Content */}
      <div className="px-4 py-8 md:px-8 md:py-12">
        <Tabs value={selectedDay} onValueChange={setSelectedDay} className="space-y-6">
          {/* Days Tabs */}
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto">
            {weekDays.map((day, index) => (
              <TabsTrigger
                key={day}
                value={day}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-border data-[state=active]:border-transparent transition-all"
              >
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.slice(0, 2)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Day Content */}
          {weekDays.map((day, dayIndex) => (
            <TabsContent key={day} value={day} className="mt-6 space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  {day}
                </h2>

                {scheduleData[day as keyof typeof scheduleData].length === 0 ? (
                  <Card className="border-2">
                    <CardContent className="py-12 text-center">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">Занятий нет</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {scheduleData[day as keyof typeof scheduleData].map((lesson, index) => {
                      const link = getLessonLink(lesson)

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card
                            className={`border-2 overflow-hidden relative group transition-all duration-300 ${lesson.status !== "locked"
                                ? "hover:shadow-xl hover:-translate-y-1"
                                : "opacity-60"
                              }`}
                          >
                            {/* Timeline indicator */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${lesson.gradient}`} />

                            <CardContent className="p-4 md:p-6 pl-6 md:pl-8">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Time */}
                                <div className="flex items-center gap-3 min-w-[140px]">
                                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${lesson.gradient} flex items-center justify-center shadow-lg`}>
                                    <Clock className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{lesson.time.split(" - ")[0]}</p>
                                    <p className="text-xs text-muted-foreground">{lesson.time.split(" - ")[1]}</p>
                                  </div>
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                      {lesson.subject}
                                    </h3>
                                    <Badge variant="outline" className="font-medium">
                                      {lesson.type === "lecture" ? (
                                        <>
                                          <BookOpen className="h-3 w-3 mr-1" />
                                          Лекция
                                        </>
                                      ) : (
                                        <>
                                          <FlaskConical className="h-3 w-3 mr-1" />
                                          Практика
                                        </>
                                      )}
                                    </Badge>
                                    {getStatusBadge(lesson.status)}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <User className="h-4 w-4" />
                                      {lesson.teacher}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {lesson.room}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <div className="md:ml-auto">
                                  {link && lesson.status !== "locked" ? (
                                    <Link href={link}>
                                      <Button className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all">
                                        {lesson.status === "completed" ? (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Повторить
                                          </>
                                        ) : (
                                          <>
                                            <Play className="h-4 w-4 mr-2" />
                                            Начать
                                          </>
                                        )}
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button disabled className="w-full md:w-auto">
                                      <Lock className="h-4 w-4 mr-2" />
                                      Недоступно
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
