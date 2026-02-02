'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, AlertCircle, CheckCircle, FileText, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, studentStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState } from '@/components/shared'

export default function ExamsPage() {
    const exams = useStore(studentStore, (s) => s.exams)
    const isLoading = useStore(studentStore, (s) => s.isLoading)

    useEffect(() => {
        studentStore.getState().fetchExams()
    }, [])

    if (isLoading) {
        return <LoadingState message="Загрузка экзаменов..." />
    }

    const upcomingExams = exams.filter((e) => e.status === 'upcoming')
    const completedExams = exams.filter((e) => e.status === 'completed')

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return (
                    <Badge variant="default" className="bg-blue-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Предстоит
                    </Badge>
                )
            case 'completed':
                return (
                    <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Сдан
                    </Badge>
                )
            case 'failed':
                return (
                    <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Не сдан
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen">
            <PageHeader title="Экзамены" description="Расписание и результаты экзаменов" icon={FileText} />

            <div className="container max-w-7xl py-8 space-y-8">
                {/* Upcoming Exams */}
                {upcomingExams.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="h-6 w-6" />
                            Предстоящие экзамены
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {upcomingExams.map((exam, index) => (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle>{exam.subject}</CardTitle>
                                                {getStatusBadge(exam.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(exam.date).toLocaleDateString('ru-RU', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {exam.time}
                                            </div>
                                            {exam.room && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FileText className="h-4 w-4" />
                                                    Аудитория: {exam.room}
                                                </div>
                                            )}
                                            <Button className="w-full mt-4">Подготовиться</Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Exams */}
                {completedExams.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Trophy className="h-6 w-6" />
                            Результаты экзаменов
                        </h2>
                        <div className="space-y-4">
                            {completedExams.map((exam, index) => (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="border-l-4 border-l-green-500">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg">{exam.subject}</h4>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(exam.date).toLocaleDateString('ru-RU')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(exam.status)}
                                                    {exam.grade && (
                                                        <div className="text-3xl font-bold mt-2">{exam.grade}%</div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {exams.length === 0 && (
                    <EmptyState
                        icon={FileText}
                        title="Нет экзаменов"
                        description="Экзамены появятся в расписании"
                    />
                )}
            </div>
        </div>
    )
}
