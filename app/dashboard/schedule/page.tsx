'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, studentStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState } from '@/components/shared'

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export default function SchedulePage() {
    const schedule = useStore(studentStore, (s) => s.schedule)
    const isLoading = useStore(studentStore, (s) => s.isLoading)

    useEffect(() => {
        studentStore.getState().fetchSchedule()
    }, [])

    if (isLoading) {
        return <LoadingState message="Загрузка расписания..." />
    }

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Расписание занятий"
                description="Ваше недельное расписание"
                icon={Calendar}
            />

            <div className="container max-w-7xl py-8 space-y-6">
                {schedule.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="Расписание пусто"
                        description="Расписание появится после регистрации на курсы"
                    />
                ) : (
                    <div className="space-y-6">
                        {DAYS.map((day, dayIndex) => {
                            const daySchedule = schedule.filter((item) => item.day === dayIndex)

                            if (daySchedule.length === 0) return null

                            return (
                                <motion.div
                                    key={day}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: dayIndex * 0.1 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                {day}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {daySchedule.map((item, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                                                    >
                                                        <div className="flex-shrink-0 w-20 text-center">
                                                            <div className="text-sm font-semibold">{item.time}</div>
                                                            <Badge variant="outline" className="mt-1">
                                                                {item.type}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex-1 space-y-2">
                                                            <h4 className="font-semibold text-lg">{item.subject}</h4>
                                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                                {item.teacher && (
                                                                    <div className="flex items-center gap-1">
                                                                        <User className="h-4 w-4" />
                                                                        {item.teacher}
                                                                    </div>
                                                                )}
                                                                {item.room && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="h-4 w-4" />
                                                                        {item.room}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
