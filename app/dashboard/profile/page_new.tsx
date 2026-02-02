'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Calendar,
    BookOpen,
    Trophy,
    Star,
    TrendingUp,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, studentStore } from '@/lib/store'
import { LoadingState, EmptyState, StatCard } from '@/components/shared'

export default function ProfilePage() {
    const profile = useStore(studentStore, (s) => s.profile)
    const grades = useStore(studentStore, (s) => s.grades)
    const isLoading = useStore(studentStore, (s) => s.isLoading)

    useEffect(() => {
        studentStore.getState().fetchProfile()
        studentStore.getState().fetchGrades()
    }, [])

    if (isLoading) {
        return <LoadingState message="Загрузка профиля..." />
    }

    if (!profile) {
        return (
            <EmptyState
                icon={GraduationCap}
                title="Профиль не найден"
                description="Данные профиля недоступны"
            />
        )
    }

    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0)
    const averageGrade = grades.length > 0
        ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1)
        : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-12 md:px-8 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6"
                >
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl">
                            <AvatarImage src={profile.avatar} />
                            <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {profile.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                    </motion.div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left text-white">
                        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{profile.name}</h1>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                <GraduationCap className="mr-1 h-4 w-4" />
                                {profile.group}
                            </Badge>
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                <Star className="mr-1 h-4 w-4" />
                                Средний балл: {averageGrade}
                            </Badge>
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                <BookOpen className="mr-1 h-4 w-4" />
                                {totalCredits} кредитов
                            </Badge>
                        </div>

                        <div className="mt-4 space-y-2 text-white/90">
                            {profile.email && (
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <Mail className="h-4 w-4" />
                                    <span>{profile.email}</span>
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <Phone className="h-4 w-4" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <MapPin className="h-4 w-4" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="container max-w-7xl px-4 py-8 md:px-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard
                        title="Средний балл"
                        value={averageGrade}
                        icon={Star}
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard
                        title="Всего кредитов"
                        value={totalCredits}
                        icon={BookOpen}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="Пройдено курсов"
                        value={grades.length}
                        icon={Trophy}
                        trend={{ value: 3, isPositive: true }}
                    />
                    <StatCard
                        title="Прогресс"
                        value={`${Math.round((grades.length / 20) * 100)}%`}
                        icon={TrendingUp}
                    />
                </div>

                {/* Grades Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Оценки по предметам
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {grades.length === 0 ? (
                            <EmptyState
                                icon={BookOpen}
                                title="Нет оценок"
                                description="Оценки появятся после прохождения курсов"
                            />
                        ) : (
                            <div className="space-y-4">
                                {grades.map((grade, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 rounded-lg border"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{grade.subject}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Progress value={grade.grade} className="h-2 flex-1 max-w-xs" />
                                                <span className="text-sm font-bold">{grade.grade}%</span>
                                            </div>
                                            {grade.date && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(grade.date).toLocaleDateString('ru-RU')}
                                                </div>
                                            )}
                                        </div>
                                        <Badge
                                            variant={grade.grade >= 90 ? 'default' : grade.grade >= 70 ? 'secondary' : 'outline'}
                                        >
                                            {grade.credits} кредитов
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Достижения
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Отличник</h4>
                                        <p className="text-sm text-muted-foreground">Средний балл 90+</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Книголюб</h4>
                                        <p className="text-sm text-muted-foreground">Прочитано 50+ лекций</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Star className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Первопроходец</h4>
                                        <p className="text-sm text-muted-foreground">Первый курс завершён</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
