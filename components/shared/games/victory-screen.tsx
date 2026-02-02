import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Star, RotateCcw, Home, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Difficulty } from '@/lib/store'

interface VictoryScreenProps {
    score: number
    bestScore?: number
    isNewRecord?: boolean
    difficulty: Difficulty
    timeSpent?: number
    onRestart: () => void
    message?: string
    stats?: Array<{ label: string; value: string | number }>
}

export function VictoryScreen({
    score,
    bestScore,
    isNewRecord = false,
    difficulty,
    timeSpent,
    onRestart,
    message = 'Поздравляем!',
    stats = [],
}: VictoryScreenProps) {
    const router = useRouter()

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getDifficultyLabel = (diff: Difficulty) => {
        switch (diff) {
            case 'easy':
                return 'Легко'
            case 'medium':
                return 'Средне'
            case 'hard':
                return 'Сложно'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="w-full max-w-md border-primary/50 shadow-2xl">
                    <CardContent className="pt-6">
                        {/* Trophy Animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                                    <Trophy className="h-12 w-12 text-white" />
                                </div>
                                {isNewRecord && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-lg"
                                    >
                                        <Award className="h-6 w-6 text-white" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center text-3xl font-bold mb-2"
                        >
                            {message}
                        </motion.h2>

                        {isNewRecord && (
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-primary font-semibold mb-4"
                            >
                                🎉 Новый рекорд!
                            </motion.p>
                        )}

                        {/* Stats */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3 my-6"
                        >
                            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                                <span className="text-muted-foreground">Счёт</span>
                                <span className="text-2xl font-bold text-primary">{score}</span>
                            </div>

                            {bestScore !== undefined && bestScore > 0 && (
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-muted-foreground">Лучший результат</span>
                                    <span className="text-xl font-bold">{bestScore}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Сложность</span>
                                <span className="font-bold">{getDifficultyLabel(difficulty)}</span>
                            </div>

                            {timeSpent !== undefined && (
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-muted-foreground">Время</span>
                                    <span className="font-bold">{formatTime(timeSpent)}</span>
                                </div>
                            )}

                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                >
                                    <span className="text-muted-foreground">{stat.label}</span>
                                    <span className="font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-3"
                        >
                            <Button
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => router.push('/dashboard/games')}
                            >
                                <Home className="h-4 w-4" />
                                Главная
                            </Button>
                            <Button className="flex-1 gap-2" onClick={onRestart}>
                                <RotateCcw className="h-4 w-4" />
                                Заново
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
