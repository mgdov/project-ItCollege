'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FlaskConical, Code2, Calculator, FileQuestion, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/shared'

const labTypes = [
    {
        id: 'programming',
        title: 'Программирование',
        description: 'Онлайн-компилятор для написания и тестирования кода на разных языках',
        icon: Code2,
        color: 'text-blue-500',
        bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
        borderColor: 'border-blue-500/20',
        href: '/dashboard/labs/programming',
    },
    {
        id: 'math',
        title: 'Математика',
        description: 'Решение уравнений и математических задач с интерактивными примерами',
        icon: Calculator,
        color: 'text-purple-500',
        bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
        borderColor: 'border-purple-500/20',
        href: '/dashboard/labs/math',
    },
    {
        id: 'quiz',
        title: 'Квизы',
        description: 'Интерактивные тесты и вопросы по различным предметам',
        icon: FileQuestion,
        color: 'text-green-500',
        bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
        borderColor: 'border-green-500/20',
        href: '/dashboard/labs/quiz',
    },
]

export default function LabsPage() {
    return (
        <div className="min-h-screen">
            <PageHeader
                title="Лабораторные работы"
                description="Практические задания и интерактивные упражнения"
                icon={FlaskConical}
            />

            <div className="container max-w-7xl py-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {labTypes.map((lab, index) => {
                        const Icon = lab.icon
                        return (
                            <motion.div
                                key={lab.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className={`group relative overflow-hidden border-2 ${lab.borderColor} ${lab.bg} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${lab.bg} border-2 ${lab.borderColor}`}
                                            >
                                                <Icon className={`h-7 w-7 ${lab.color}`} />
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl mt-4">{lab.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{lab.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Link href={lab.href}>
                                            <Button className="w-full group-hover:bg-primary/90 transition-colors">
                                                Открыть
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
