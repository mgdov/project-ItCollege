"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, MapPin, GraduationCap, Calendar, BookOpen, Trophy, Star, TrendingUp, Award } from "lucide-react"
import { Image } from "next/image"
import { motion } from "framer-motion"

// TODO: Заменить на API запрос
const useProfile = () => {
    const [profile, setProfile] = useState<any>(null)
    const [grades, setGrades] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false)
        // Данные будут загружаться с сервера
    }, [])

    return { profile, grades, isLoading }
}

export default function ProfilePage() {
    const { profile, grades, isLoading } = useProfile()

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

    if (!profile) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Профиль не найден</h3>
                    <p className="text-muted-foreground">Данные профиля недоступны</p>
                </div>
            </div>
        )
    }

    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Hero Section with Background */}
            <div className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
                    <Image
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                        alt="Профиль"
                        fill
                        className="object-cover mix-blend-overlay"
                        priority
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6"
                >
                    {/* Avatar Section */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative">
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl">
                                <AvatarImage src="/student-avatar.png" />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                    ИИ
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                <Trophy className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left text-white">
                        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                            {profile.name}
                        </h1>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                {profile.group}
                            </Badge>
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1">
                                {profile.course} курс
                            </Badge>
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1">
                                <Star className="h-4 w-4 mr-1" />
                                {profile.averageGrade} средний балл
                            </Badge>
                        </div>
                        <p className="mt-3 text-lg text-white/90">
                            {profile.specialty}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="px-4 py-8 md:px-8 md:py-12">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Contact Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="border-2 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    Контактная информация
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                                        <Phone className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Телефон</p>
                                        <p className="text-sm font-medium">{profile.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                                        <MapPin className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Адрес</p>
                                        <p className="text-sm font-medium">{profile.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                                        <Calendar className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Дата поступления</p>
                                        <p className="text-sm font-medium">{profile.enrollmentDate}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats and Grades */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Statistics Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Card className="border-2 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="pt-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                                                <BookOpen className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                    {profile.progress}%
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">Общий прогресс</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="pt-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                                                <Trophy className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {profile.averageGrade}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">Средний балл</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="pt-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                                                <Award className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    {profile.completedCourses}/{profile.totalCourses}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">Курсов пройдено</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Card className="border-2">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium">Прогресс обучения</span>
                                        <span className="text-sm font-bold text-primary">{profile.progress}%</span>
                                    </div>
                                    <Progress value={profile.progress} className="h-3" />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Пройдено {profile.completedCourses} из {profile.totalCourses} курсов
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Grades Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        Оценки по предметам
                                    </CardTitle>
                                    <CardDescription>
                                        Всего кредитов: {totalCredits}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {grades.map((grade, index) => (
                                            <motion.div
                                                key={grade.subject}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${grade.color} flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow`}>
                                                        {grade.grade}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{grade.subject}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {grade.credits} {grade.credits === 1 ? 'кредит' : 'кредита'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < grade.grade
                                                                ? "fill-yellow-500 text-yellow-500"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
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
