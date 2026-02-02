"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, FileText, Clock, Search, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const lectures = [
  {
    id: 1,
    subject: "Математика",
    title: "Введение в линейную алгебру",
    description: "Основы векторов и матриц",
    duration: "45 мин",
    status: "completed",
    fileType: "pdf",
  },
  {
    id: 2,
    subject: "Математика",
    title: "Дифференциальные уравнения",
    description: "Основные методы решения",
    duration: "60 мин",
    status: "available",
    fileType: "pdf",
  },
  {
    id: 3,
    subject: "Программирование",
    title: "Основы Python",
    description: "Синтаксис и базовые конструкции",
    duration: "90 мин",
    status: "completed",
    fileType: "pdf",
  },
  {
    id: 4,
    subject: "Программирование",
    title: "ООП в Python",
    description: "Классы, объекты, наследование",
    duration: "75 мин",
    status: "available",
    fileType: "word",
  },
  {
    id: 5,
    subject: "Физика",
    title: "Механика",
    description: "Законы Ньютона и их применение",
    duration: "60 мин",
    status: "locked",
    fileType: "pdf",
  },
  {
    id: 6,
    subject: "История",
    title: "Древний мир",
    description: "Цивилизации древности",
    duration: "45 мин",
    status: "available",
    fileType: "word",
  },
]

export default function LecturesPage() {
  const [search, setSearch] = useState("")

  const filteredLectures = lectures.filter(
    (lecture) =>
      lecture.title.toLowerCase().includes(search.toLowerCase()) ||
      lecture.subject.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            Пройдено
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

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Лекции</h1>
          <p className="mt-1 text-muted-foreground">Учебные материалы в форматах Word и PDF</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск лекций..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLectures.map((lecture) => (
          <Card
            key={lecture.id}
            className={`border-border/50 transition-all ${
              lecture.status !== "locked" ? "hover:border-primary/50 hover:shadow-md" : "opacity-60"
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {lecture.fileType === "pdf" ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-primary" />
                  )}
                </div>
                {getStatusBadge(lecture.status)}
              </div>
              <CardTitle className="mt-3 text-lg">{lecture.title}</CardTitle>
              <CardDescription>{lecture.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {lecture.subject}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {lecture.duration}
                </span>
              </div>
              <div className="flex gap-2">
                {lecture.status !== "locked" ? (
                  <>
                    <Link href={`/dashboard/lectures/${lecture.id}`} className="flex-1">
                      <Button className="w-full gap-2" size="sm">
                        <Eye className="h-4 w-4" />
                        Читать
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button disabled className="w-full" size="sm">
                    Недоступно
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
