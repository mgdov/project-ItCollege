"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, Download } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос
const useSchedule = () => {
    const [schedule, setSchedule] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false)
        // Данные будут загружаться с сервера
    }, [])

    return { schedule, isLoading }
}

export default function SchedulePage() {
    const { schedule, isLoading } = useSchedule()

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

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-500 to-indigo-600 text-white">
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
                            <Calendar className="h-5 w-5" />
                            <span className="text-sm font-medium">Управление расписанием</span>
                        </motion.div>
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Расписание</h1>
                                <p className="text-lg opacity-90">Управление расписанием занятий</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-white/90">
                                    <Plus className="h-5 w-5" />
                                    Добавить занятие
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
                    {schedule.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Расписание отсутствует</h3>
                            <p className="text-muted-foreground mb-4">Добавьте первое занятие в расписание</p>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Добавить занятие
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {schedule.map((daySchedule, dayIndex) => (
                                <motion.div
                                    key={daySchedule.day}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + dayIndex * 0.1 }}
                                >
                                    <h2 className="mb-4 text-2xl font-bold">{daySchedule.day}</h2>
                                    <div className="grid gap-4 lg:grid-cols-3">
                                        {daySchedule.lessons.map((lesson, lessonIndex) => (
                                            <motion.div
                                                key={lessonIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + dayIndex * 0.1 + lessonIndex * 0.05 }}
                                            >
                                                <Card className="group border-2 border-border/50 transition-all hover:border-blue-500/50 hover:shadow-xl">
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between">
                                                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                {lesson.time}
                                                            </Badge>
                                                            <Badge variant="outline">{lesson.group}</Badge>
                                                        </div>
                                                        <CardTitle className="mt-3 text-lg">{lesson.subject}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">{lesson.teacher}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">Аудитория {lesson.room}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
