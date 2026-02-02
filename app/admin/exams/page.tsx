"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, FileCheck, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос
const useExams = () => {
    const [exams, setExams] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false)
        // Данные будут загружаться с сервера
    }, [])

    return { exams, isLoading }
}

export default function ExamsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const { exams, isLoading } = useExams()

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

    const filteredExams = exams.filter(exam =>
        exam?.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam?.groups?.some((group: string) => group.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const upcomingExams = filteredExams.filter(e => e?.status === "scheduled")
    const completedExams = filteredExams.filter(e => e?.status === "completed")

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 text-white">
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
                            <FileCheck className="h-5 w-5" />
                            <span className="text-sm font-medium">Управление экзаменами</span>
                        </motion.div>
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Экзамены</h1>
                                <p className="text-lg opacity-90">Планирование и управление экзаменами</p>
                            </div>
                            <Button size="lg" className="gap-2 bg-white text-orange-600 hover:bg-white/90">
                                <Plus className="h-5 w-5" />
                                Создать экзамен
                            </Button>
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
                                    placeholder="Поиск экзаменов..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="px-4 py-2">
                                    Всего: {exams.length}
                                </Badge>
                                <Badge className="bg-orange-500 px-4 py-2">
                                    Запланировано: {upcomingExams.length}
                                </Badge>
                            </div>
                        </div>
                    </motion.div>

                    {/* Upcoming Exams */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="mb-4 text-xl font-bold">Предстоящие экзамены</h2>
                        {upcomingExams.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 border-2 border-dashed border-border rounded-lg"
                            >
                                <FileCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Нет предстоящих экзаменов</h3>
                                <p className="text-muted-foreground mb-4">Запланируйте первый экзамен</p>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Создать экзамен
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {upcomingExams.map((exam, index) => (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <Card className="group border-2 border-orange-500/30 transition-all hover:border-orange-500/50 hover:shadow-xl">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10">
                                                        <FileCheck className="h-6 w-6 text-orange-500" />
                                                    </div>
                                                    <Badge className="bg-orange-500">Запланирован</Badge>
                                                </div>
                                                <CardTitle className="mt-3 text-lg">{exam.subject}</CardTitle>
                                                <CardDescription className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        {exam.date}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        {exam.time} ({exam.duration})
                                                    </div>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="mb-2 text-sm text-muted-foreground">Группы:</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {exam.groups.map(group => (
                                                                <Badge key={group} variant="outline">{group}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <Button size="sm" className="flex-1 gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
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
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Completed Exams */}
                    {completedExams.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h2 className="mb-4 text-xl font-bold">Завершенные экзамены</h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {completedExams.map((exam, index) => (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.9 + index * 0.1 }}
                                    >
                                        <Card className="border-2 border-green-500/30 opacity-75">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                                                        <FileCheck className="h-6 w-6 text-green-500" />
                                                    </div>
                                                    <Badge className="bg-green-500">Завершен</Badge>
                                                </div>
                                                <CardTitle className="mt-3 text-lg">{exam.subject}</CardTitle>
                                                <CardDescription>
                                                    {exam.date} в {exam.time}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {exam.groups.map(group => (
                                                        <Badge key={group} variant="outline">{group}</Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
