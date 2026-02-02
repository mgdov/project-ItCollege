"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, BookOpen, FileText } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос
const useSubjects = () => {
  const [subjects, setSubjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    // Данные будут загружаться с сервера
  }, [])

  return { subjects, isLoading }
}

const categories = ["Все", "Точные науки", "Информатика", "Гуманитарные"]

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const { subjects, isLoading } = useSubjects()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject?.teacher?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Все" || subject?.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200"
            alt="Admin Background"
            fill
            className="object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative px-4 py-12 md:px-8 md:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Управление предметами</span>
            </motion.div>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Предметы</h1>
                <p className="text-lg opacity-90">Управление учебными дисциплинами</p>
              </div>
              <Button size="lg" className="gap-2 bg-white text-green-600 hover:bg-white/90">
                <Plus className="h-5 w-5" />
                Добавить предмет
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск предметов..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 ${selectedCategory === category
                      ? "bg-green-500 hover:bg-green-600"
                      : "hover:bg-green-500/10"
                      }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subjects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет предметов</h3>
                <p className="text-muted-foreground mb-4">Предметы не найдены</p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Создать первый предмет
                </Button>
              </motion.div>
            ) : (
              filteredSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="group h-full border-2 border-border/50 transition-all hover:border-green-500/50 hover:shadow-xl">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                          <BookOpen className="h-6 w-6 text-green-500" />
                        </div>
                        <Badge variant="secondary">{subject.category}</Badge>
                      </div>
                      <CardTitle className="mt-3 text-xl">{subject.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {subject.teacher}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Лекции</span>
                          <Badge variant="outline">{subject.lectures}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Лабораторные</span>
                          <Badge variant="outline">{subject.labs}</Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            <Pencil className="h-4 w-4" />
                            Изменить
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2 text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
