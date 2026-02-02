import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Zap, Flame, Brain } from 'lucide-react'
import type { Difficulty } from '@/lib/store'

interface DifficultySelectProps {
    onSelect: (difficulty: Difficulty) => void
    title?: string
    description?: string
}

const difficulties: Array<{
    id: Difficulty
    label: string
    description: string
    icon: React.ReactNode
    color: string
}> = [
        {
            id: 'easy',
            label: 'Легко',
            description: 'Отлично для начала',
            icon: <Gamepad2 className="h-8 w-8" />,
            color: 'from-green-500 to-emerald-500',
        },
        {
            id: 'medium',
            label: 'Средне',
            description: 'Проверь свои навыки',
            icon: <Zap className="h-8 w-8" />,
            color: 'from-yellow-500 to-orange-500',
        },
        {
            id: 'hard',
            label: 'Сложно',
            description: 'Для опытных игроков',
            icon: <Flame className="h-8 w-8" />,
            color: 'from-red-500 to-pink-500',
        },
    ]

export function DifficultySelect({
    onSelect,
    title = 'Выбери сложность',
    description
}: DifficultySelectProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
        >
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-500 shadow-lg">
                            <Brain className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl">{title}</CardTitle>
                    {description && (
                        <p className="text-muted-foreground mt-2">{description}</p>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {difficulties.map((diff, index) => (
                            <motion.div
                                key={diff.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Button
                                    variant="outline"
                                    className="h-auto w-full flex-col gap-3 p-6 hover:scale-105 transition-all group"
                                    onClick={() => onSelect(diff.id)}
                                >
                                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${diff.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                                        {diff.icon}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-lg">{diff.label}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {diff.description}
                                        </p>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
