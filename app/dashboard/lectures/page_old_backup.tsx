"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, FileText, Clock, Search, Download, Eye, CheckCircle2, Lock, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"

// TODO: Replace with API call
function useLectures() {
    return {
        lectures: [],
        isLoading: true,
    }
}

export default function LecturesPage() {
    const [search, setSearch] = useState("")
    const { lectures, isLoading } = useLectures()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    const filteredLectures = lectures.filter(
        (lecture) =>
            lecture.title.toLowerCase().includes(search.toLowerCase()) ||
            lecture.subject.toLowerCase().includes(search.toLowerCase()),
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Пройдено
                    </Badge>
                )
            case "available":
                return (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                        <Play className="h-3 w-3 mr-1" />
                        Доступно
                    </Badge>
                )
            case "locked":
                return (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        <Lock className="h-3 w-3 mr-1" />
                        Заблокировано
                    </Badge>
                )
            default:
                return null
        }
    }

    const getFileTypeIcon = (fileType: string) => {
        return fileType === "pdf" ? "📄" : "📝"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-12 md:px-8 md:py-16">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
                        alt="Лекции"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        Лекционные материалы
                    </h1>
                    <p className="mt-3 text-lg text-white/90 md:text-xl">
                        Учебные материалы и конспекты по всем предметам
                    </p>

                    {/* Search Bar */}
                    <div className="mt-6 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                            <Input
                                type="text"
                                placeholder="Поиск лекций..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
                            <BookOpen className="h-5 w-5" />
                            <span className="font-semibold">{lectures.length} лекций</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-semibold">{lectures.filter(l => l.status === "completed").length} изучено</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Lectures Grid */}
            <div className="px-4 py-8 md:px-8 md:py-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredLectures.map((lecture, index) => (
                        <motion.div
                            key={lecture.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className={`group relative overflow-hidden border-2 h-full transition-all duration-300 ${lecture.status !== "locked"
                                    ? "hover:border-primary hover:shadow-2xl hover:-translate-y-1"
                                    : "opacity-60"
                                    }`}
                            >
                                {/* Gradient Header */}
                                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${lecture.gradient}`} />

                                {/* File Type Badge */}
                                <div className="absolute top-4 right-4 text-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                                    {getFileTypeIcon(lecture.fileType)}
                                </div>

                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <Badge variant="outline" className="font-medium">
                                            {lecture.subject}
                                        </Badge>
                                        {getStatusBadge(lecture.status)}
                                    </div>
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                                        {lecture.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {lecture.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{lecture.duration}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {lecture.status !== "locked" ? (
                                            <>
                                                <Link href={`/dashboard/lectures/${lecture.id}`} className="flex-1">
                                                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Читать
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button disabled className="w-full">
                                                <Lock className="h-4 w-4 mr-2" />
                                                Недоступно
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredLectures.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">Лекции не найдены</p>
                        <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить параметры поиска</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
