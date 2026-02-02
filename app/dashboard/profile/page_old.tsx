"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, MapPin, GraduationCap, Calendar, BookOpen, Trophy } from "lucide-react"

const studentProfile = {
  name: "Иванов Иван Иванович",
  email: "ivanov@example.com",
  phone: "+7 (999) 123-45-67",
  address: "г. Ростов-на-Дону",
  group: "ИТ-21",
  course: 2,
  specialty: "Информационные технологии",
  enrollmentDate: "01.09.2023",
  progress: 78,
  averageGrade: 4.2,
  completedCourses: 12,
  totalCourses: 16,
}

const grades = [
  { subject: "Математика", grade: 5, credits: 4 },
  { subject: "Программирование", grade: 5, credits: 6 },
  { subject: "Физкультура", grade: 4, credits: 2 },
  { subject: "Физика", grade: 4, credits: 4 },
  { subject: "История", grade: 4, credits: 2 },
  { subject: "Английский язык", grade: 5, credits: 4 },
]

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Профиль студента</h1>
        <p className="mt-1 text-muted-foreground">Ваши личные данные и успеваемость</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage src="/student-avatar.png" />
                <AvatarFallback className="text-2xl">ИИ</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{studentProfile.name}</h2>
              <Badge className="mt-2">{studentProfile.group}</Badge>
              <p className="mt-2 text-sm text-muted-foreground">{studentProfile.specialty}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{studentProfile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{studentProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{studentProfile.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{studentProfile.course} курс</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Поступление: {studentProfile.enrollmentDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Grades */}
        <div className="space-y-6 lg:col-span-2">
          {/* Progress Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{studentProfile.progress}%</p>
                    <p className="text-xs text-muted-foreground">Общий прогресс</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <Trophy className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{studentProfile.averageGrade.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Средний балл</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <GraduationCap className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {studentProfile.completedCourses}/{studentProfile.totalCourses}
                    </p>
                    <p className="text-xs text-muted-foreground">Курсов пройдено</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Прогресс обучения</CardTitle>
              <CardDescription>
                Пройдено {studentProfile.completedCourses} из {studentProfile.totalCourses} курсов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={studentProfile.progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Grades Table */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Оценки по предметам</CardTitle>
              <CardDescription>Текущая успеваемость</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grades.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3"
                  >
                    <div>
                      <p className="font-medium">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.credits} кредитов</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xl font-bold ${
                          item.grade === 5
                            ? "text-success"
                            : item.grade === 4
                              ? "text-primary"
                              : item.grade === 3
                                ? "text-warning"
                                : "text-destructive"
                        }`}
                      >
                        {item.grade}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.grade === 5
                          ? "Отлично"
                          : item.grade === 4
                            ? "Хорошо"
                            : item.grade === 3
                              ? "Удовл."
                              : "Неуд."}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
