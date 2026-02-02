"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Users, GraduationCap } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос
const useGroups = () => {
  const [groups, setGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    // Данные будут загружаться с сервера
  }, [])

  return { groups, isLoading }
}

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { groups, isLoading } = useGroups()

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

  const filteredGroups = groups.filter(group =>
    group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group?.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
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
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Управление группами</span>
            </motion.div>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Группы</h1>
                <p className="text-lg opacity-90">Управление учебными группами</p>
              </div>
              <Button size="lg" className="gap-2 bg-white text-purple-600 hover:bg-white/90">
                <Plus className="h-5 w-5" />
                Создать группу
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск групп..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Groups Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет групп</h3>
                <p className="text-muted-foreground mb-4">Группы не найдены</p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Создать первую группу
                </Button>
              </motion.div>
            ) : (
              filteredGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="group border-2 border-border/50 transition-all hover:border-purple-500/50 hover:shadow-xl">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                            <Users className="h-6 w-6 text-purple-500" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{group.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{group.course} курс</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Специальность</div>
                          <div className="font-medium">{group.specialty}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Куратор</div>
                          <div className="font-medium">{group.curator}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {group.students} студентов
                          </Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
