'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Clock, Search, Download, Eye, CheckCircle2, Lock, Play } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore, studentStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState } from '@/components/shared'

export default function LecturesPage() {
    const [search, setSearch] = useState('')
    const lectures = useStore(studentStore, (s) => s.lectures)
    const isLoading = useStore(studentStore, (s) => s.isLoading)

    useEffect(() => {
        studentStore.getState().fetchLectures()
    }, [])

    if (isLoading) {
        return <LoadingState message="Загрузка лекций..." />
    }

    const filteredLectures = lectures.filter(
        (lecture) =>
            lecture.title.toLowerCase().includes(search.toLowerCase()) ||
            lecture.subject.toLowerCase().includes(search.toLowerCase())
    )

    const completedCount = lectures.filter((l) => l.status === 'completed').length

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Пройдено
                    </Badge>
                )
            case 'available':
                return (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                        <Play className="h-3 w-3 mr-1" />
                        Доступно
                    </Badge>
                )
            case 'locked':
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

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Лекционные материалы"
                description="Учебные материалы и конспекты по всем предметам"
                icon={BookOpen}
            />

            <div className="container max-w-7xl py-8 space-y-6">
                {/* Search and Stats */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Поиск лекций..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{lectures.length} лекций</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="font-semibold">{completedCount} изучено</span>
                        </div>
                    </div>
                </div>

                {/* Lectures Grid */}
                {filteredLectures.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="Лекции не найдены"
                        description="Попробуйте изменить параметры поиска"
                    />
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredLectures.map((lecture, index) => (
                            <motion.div
                                key={lecture.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card
                                    className={`group relative h-full transition-all duration-300 ${lecture.status !== 'locked'
                                            ? 'hover:border-primary hover:shadow-lg hover:-translate-y-1'
                                            : 'opacity-60'
                                        }`}
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${lecture.gradient}`} />

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
                                            {lecture.status !== 'locked' ? (
                                                <>
                                                    <Link href={`/dashboard/lectures/${lecture.id}`} className="flex-1">
                                                        <Button className="w-full" variant="default">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Читать
                                                        </Button>
                                                    </Link>
                                                    <Button variant="outline" size="icon">
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
                )}
            </div>
        </div>
    )
}
