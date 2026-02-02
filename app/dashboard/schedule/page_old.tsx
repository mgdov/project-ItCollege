"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronLeft, ChevronRight, Clock, BookOpen, FlaskConical, Lock, Play } from "lucide-react"
import Link from "next/link"

const weekDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]

const scheduleData = {
  Понедельник: [
    {
      id: 1,
      subject: "Математика",
      type: "lecture",
      time: "09:00 - 10:30",
      status: "available",
      teacher: "Петров А.В.",
    },
    {
      id: 2,
      subject: "Программирование",
      type: "lab",
      time: "11:00 - 12:30",
      status: "available",
      teacher: "Сидоров И.П.",
    },
    { id: 3, subject: "Физика", type: "lecture", time: "14:00 - 15:30", status: "locked", teacher: "Козлов Н.М." },
  ],
  Вторник: [
    { id: 4, subject: "История", type: "lecture", time: "09:00 - 10:30", status: "completed", teacher: "Иванова М.С." },
    { id: 5, subject: "Физкультура", type: "lab", time: "11:00 - 12:30", status: "available", teacher: "Смирнов В.А." },
    { id: 6, subject: "Математика", type: "lab", time: "14:00 - 15:30", status: "locked", teacher: "Петров А.В." },
  ],
  Среда: [
    {
      id: 7,
      subject: "Программирование",
      type: "lecture",
      time: "09:00 - 10:30",
      status: "completed",
      teacher: "Сидоров И.П.",
    },
    { id: 8, subject: "Английский язык", type: "lab", time: "11:00 - 12:30", status: "available", teacher: "Brown J." },
  ],
  Четверг: [
    { id: 9, subject: "Физика", type: "lab", time: "09:00 - 10:30", status: "locked", teacher: "Козлов Н.М." },
    { id: 10, subject: "Математика", type: "lecture", time: "11:00 - 12:30", status: "locked", teacher: "Петров А.В." },
    { id: 11, subject: "История", type: "lab", time: "14:00 - 15:30", status: "locked", teacher: "Иванова М.С." },
  ],
  Пятница: [
    {
      id: 12,
      subject: "Программирование",
      type: "lab",
      time: "09:00 - 10:30",
      status: "locked",
      teacher: "Сидоров И.П.",
    },
    { id: 13, subject: "Физкультура", type: "lab", time: "11:00 - 12:30", status: "locked", teacher: "Смирнов В.А." },
  ],
  Суббота: [
    { id: 14, subject: "Математика", type: "lab", time: "09:00 - 10:30", status: "locked", teacher: "Петров А.В." },
  ],
}

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDay, setSelectedDay] = useState("Понедельник")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            Завершено
          </Badge>
        )
      case "available":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Доступно
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Заблокировано
          </Badge>
        )
      default:
        return null
    }
  }

  const getLessonLink = (lesson: { id: number; type: string; subject: string; status: string }) => {
    if (lesson.status === "locked") return null
    if (lesson.type === "lecture") return `/dashboard/lectures/${lesson.id}`
    if (lesson.subject === "Физкультура") return `/dashboard/games`
    if (lesson.subject === "Программирование") return `/dashboard/labs/programming`
    if (lesson.subject === "Математика") return `/dashboard/labs/math`
    return `/dashboard/labs/${lesson.id}`
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Расписание занятий</h1>
          <p className="mt-1 text-muted-foreground">Модульная система обучения</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(currentWeek - 1)}
            className="bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[120px] text-center font-medium">Неделя {currentWeek + 1}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week View - Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-6 gap-4">
          {weekDays.map((day) => (
            <div key={day} className="space-y-3">
              <h3 className="text-center font-semibold">{day}</h3>
              <div className="space-y-3">
                {scheduleData[day as keyof typeof scheduleData]?.map((lesson) => {
                  const link = getLessonLink(lesson)
                  const content = (
                    <Card
                      key={lesson.id} // Added key property
                      className={`border-border/50 transition-all ${
                        lesson.status !== "locked"
                          ? "cursor-pointer hover:border-primary/50 hover:shadow-md"
                          : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          {lesson.type === "lecture" ? (
                            <BookOpen className="h-4 w-4 text-primary" />
                          ) : (
                            <FlaskConical className="h-4 w-4 text-accent" />
                          )}
                          {lesson.status === "locked" && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <p className="mb-1 font-medium text-sm">{lesson.subject}</p>
                        <p className="mb-2 text-xs text-muted-foreground">{lesson.time}</p>
                        {getStatusBadge(lesson.status)}
                      </CardContent>
                    </Card>
                  )
                  return link ? (
                    <Link key={lesson.id} href={link}>
                      {content}
                    </Link>
                  ) : (
                    <div key={lesson.id}>{content}</div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day View - Mobile/Tablet */}
      <div className="lg:hidden">
        <Tabs value={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="mb-6 grid w-full grid-cols-3 sm:grid-cols-6">
            {weekDays.map((day) => (
              <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
                {day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {weekDays.map((day) => (
            <TabsContent key={day} value={day} className="space-y-4">
              <h2 className="text-lg font-semibold">{day}</h2>
              {scheduleData[day as keyof typeof scheduleData]?.map((lesson) => {
                const link = getLessonLink(lesson)
                const content = (
                  <Card
                    key={lesson.id} // Added key property
                    className={`border-border/50 transition-all ${
                      lesson.status !== "locked"
                        ? "cursor-pointer hover:border-primary/50 hover:shadow-md"
                        : "opacity-60"
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          lesson.type === "lecture" ? "bg-primary/10" : "bg-accent/10"
                        }`}
                      >
                        {lesson.type === "lecture" ? (
                          <BookOpen className="h-6 w-6 text-primary" />
                        ) : (
                          <FlaskConical className="h-6 w-6 text-accent" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{lesson.subject}</p>
                          {lesson.status === "locked" && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{lesson.teacher}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.time}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(lesson.status)}
                        {lesson.status === "available" && (
                          <Button size="sm" variant="ghost" className="h-8 gap-1">
                            <Play className="h-3 w-3" />
                            Начать
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
                return link ? (
                  <Link key={lesson.id} href={link}>
                    {content}
                  </Link>
                ) : (
                  <div key={lesson.id}>{content}</div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Legend */}
      <Card className="mt-8 border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-primary" />
            Условные обозначения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">ЛК — Лекция</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <FlaskConical className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm">ЛЗ — Лабораторная</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Завершено
              </Badge>
              <span className="text-sm">Пройденное занятие</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Доступно
              </Badge>
              <span className="text-sm">Можно начать</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                Заблокировано
              </Badge>
              <span className="text-sm">Недоступно</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
