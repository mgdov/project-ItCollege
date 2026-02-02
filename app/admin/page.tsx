"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, School, BookOpen, Calendar, TrendingUp, Activity, Award, Bell } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// TODO: Заменить на API запрос
const useAdminStats = () => {
  const [stats, setStats] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    // Данные будут загружаться с сервера
  }, [])

  return { stats, recentActivity, isLoading }
}

export default function AdminDashboard() {
  const { stats, recentActivity, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200"
            alt="Admin Background"
            fill
            className="object-cover"
            priority
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
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">Панель управления</span>
            </motion.div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Админ-панель</h1>
                <p className="text-lg opacity-90">Управление образовательной платформой</p>
              </div>
              <Button size="lg" className="gap-2 bg-white text-indigo-600 hover:bg-white/90">
                <Bell className="h-5 w-5" />
                Уведомления (0)
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Stats Grid */}
          {stats.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет данных статистики</h3>
                <p className="text-muted-foreground">Статистика появится после подключения к API</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat: any, index: number) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-2 border-border/50 transition-all hover:border-primary/50 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-500">{stat.change}</span>
                          </div>
                        </div>
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} transition-transform group-hover:scale-110`}>
                          <stat.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Последняя активность
                  </CardTitle>
                  <CardDescription>Недавние действия в системе</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Нет недавней активности</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="group flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                            <activity.icon className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.details}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Быстрые действия</CardTitle>
                  <CardDescription>Часто используемые функции</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button className="h-auto flex-col gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 py-4 hover:from-blue-600 hover:to-cyan-600">
                      <Users className="h-6 w-6" />
                      <span>Добавить студента</span>
                    </Button>
                    <Button className="h-auto flex-col gap-2 bg-gradient-to-br from-purple-500 to-pink-500 py-4 hover:from-purple-600 hover:to-pink-600">
                      <School className="h-6 w-6" />
                      <span>Создать группу</span>
                    </Button>
                    <Button className="h-auto flex-col gap-2 bg-gradient-to-br from-green-500 to-emerald-500 py-4 hover:from-green-600 hover:to-emerald-600">
                      <Calendar className="h-6 w-6" />
                      <span>Расписание</span>
                    </Button>
                    <Button className="h-auto flex-col gap-2 bg-gradient-to-br from-orange-500 to-red-500 py-4 hover:from-orange-600 hover:to-red-600">
                      <Award className="h-6 w-6" />
                      <span>Новый экзамен</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="mt-6 border-border/50">
                <CardHeader>
                  <CardTitle>Состояние системы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Загрузка сервера</span>
                      <Badge className="bg-green-500">Отлично</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">База данных</span>
                      <Badge className="bg-green-500">Подключено</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Хранилище</span>
                      <Badge className="bg-yellow-500">75% занято</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
