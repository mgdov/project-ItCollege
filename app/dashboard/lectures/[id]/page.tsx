"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Clock, BookOpen, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const lectureContent = {
  1: {
    title: "Введение в линейную алгебру",
    subject: "Математика",
    duration: "45 мин",
    content: `
# Линейная алгебра: Основы

## 1. Введение

Линейная алгебра — это раздел математики, изучающий векторные пространства и линейные отображения между ними. Она является одним из фундаментальных разделов современной математики.

## 2. Векторы

**Определение:** Вектор — это направленный отрезок, который характеризуется длиной и направлением.

### Операции над векторами:
- Сложение векторов
- Умножение вектора на скаляр
- Скалярное произведение
- Векторное произведение

## 3. Матрицы

**Определение:** Матрица — это прямоугольная таблица чисел, расположенных в строках и столбцах.

### Типы матриц:
1. Квадратная матрица
2. Единичная матрица
3. Диагональная матрица
4. Нулевая матрица

## 4. Операции над матрицами

- Сложение матриц
- Умножение матриц
- Транспонирование
- Нахождение определителя
- Нахождение обратной матрицы

## 5. Системы линейных уравнений

Система линейных уравнений — это система уравнений, каждое из которых является линейным.

### Методы решения:
- Метод Гаусса
- Метод Крамера
- Матричный метод

## Заключение

Линейная алгебра находит широкое применение в физике, компьютерной графике, машинном обучении и многих других областях.
    `,
  },
  2: {
    title: "Дифференциальные уравнения",
    subject: "Математика",
    duration: "60 мин",
    content: `
# Дифференциальные уравнения

## 1. Основные понятия

Дифференциальное уравнение — это уравнение, связывающее независимую переменную, искомую функцию и её производные.

## 2. Классификация

### По порядку:
- Уравнения первого порядка
- Уравнения второго порядка
- Уравнения высших порядков

### По линейности:
- Линейные уравнения
- Нелинейные уравнения

## 3. Методы решения

### Уравнения с разделяющимися переменными

Уравнение вида: dy/dx = f(x)g(y)

Метод: Разделяем переменные и интегрируем обе части.

### Линейные уравнения первого порядка

Уравнение вида: y' + p(x)y = q(x)

Метод: Метод вариации постоянной или метод интегрирующего множителя.

## 4. Применение

- Физика (движение тел, колебания)
- Биология (рост популяций)
- Экономика (модели роста)
- Инженерия (электрические цепи)
    `,
  },
}

export default function LecturePage() {
  const params = useParams()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const lecture = lectureContent[params.id as keyof typeof lectureContent] || {
    title: "Лекция",
    subject: "Предмет",
    duration: "30 мин",
    content: "# Содержание лекции\n\nМатериал лекции загружается...",
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const scrollProgress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100
    setProgress(Math.min(scrollProgress, 100))
    if (scrollProgress >= 95) {
      setCompleted(true)
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">{lecture.title}</h1>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {lecture.subject}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lecture.duration}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Скачать PDF
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6 border-border/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Прогресс чтения</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="border-border/50">
        <CardContent
          className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto p-6 md:p-8"
          style={{ maxHeight: "60vh" }}
          onScroll={handleScroll}
        >
          <div className="whitespace-pre-wrap font-sans leading-relaxed">
            {lecture.content.split("\n").map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="mb-4 text-2xl font-bold">
                    {line.replace("# ", "")}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="mb-3 mt-6 text-xl font-semibold">
                    {line.replace("## ", "")}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="mb-2 mt-4 text-lg font-medium">
                    {line.replace("### ", "")}
                  </h3>
                )
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={index} className="font-semibold">
                    {line.replace(/\*\*/g, "")}
                  </p>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-4">
                    {line.replace("- ", "")}
                  </li>
                )
              }
              if (line.match(/^\d+\. /)) {
                return (
                  <li key={index} className="ml-4 list-decimal">
                    {line.replace(/^\d+\. /, "")}
                  </li>
                )
              }
              if (line.trim() === "") {
                return <br key={index} />
              }
              return (
                <p key={index} className="mb-2">
                  {line}
                </p>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completion */}
      {completed && (
        <Card className="mt-6 border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Лекция завершена!</p>
              <p className="text-sm text-muted-foreground">Вы успешно прочитали материал</p>
            </div>
            <Button className="ml-auto" onClick={() => router.push("/dashboard/lectures")}>
              К списку лекций
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
