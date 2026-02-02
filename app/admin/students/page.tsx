"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Mail, Phone, UserPlus, Download } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос
const useStudents = () => {
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    // Данные будут загружаться с сервера
  }, [])

  return { students, isLoading }
}

export default function StudentsPage() {
  const { students, isLoading } = useStudents()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = students.filter((student: any) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.group?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка студентов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white">
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
              <UserPlus className="h-5 w-5" />
              <span className="text-sm font-medium">Управление студентами</span>
            </motion.div>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Студенты</h1>
                <p className="text-lg opacity-90">Управление списком студентов</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-white/90">
                  <Plus className="h-5 w-5" />
                  Добавить студента
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <Download className="h-5 w-5" />
                  Экспорт
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Search and Stats */}
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
                  placeholder="Поиск студентов..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="px-4 py-2">
                  Всего: {students.length}
                </Badge>
                <Badge className="bg-green-500 px-4 py-2">
                  Активных: {students.filter(s => s.status === "active").length}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Students Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle>Список студентов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Студент</TableHead>
                        <TableHead>Контакты</TableHead>
                        <TableHead>Группа</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="group hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                                  {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {student.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {student.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.group}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={student.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                              {student.status === "active" ? "Активен" : "Неактивен"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Изменить
                              </Button>
                              <Button size="sm" variant="ghost" className="gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
