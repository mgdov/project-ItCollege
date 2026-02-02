import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Trophy } from 'lucide-react'
import type { Difficulty } from '@/lib/store'

interface GameStatsProps {
    score: number
    timeElapsed?: number
    bestScore?: number
    difficulty: Difficulty
    moves?: number
}

export function GameStats({ score, timeElapsed, bestScore, difficulty, moves }: GameStatsProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getDifficultyColor = (diff: Difficulty) => {
        switch (diff) {
            case 'easy':
                return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'hard':
                return 'bg-red-500/10 text-red-500 border-red-500/20'
        }
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3"
        >
            <Card className="border-primary/20">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Счёт</p>
                            <p className="text-lg font-bold">{score}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {timeElapsed !== undefined && (
                <Card className="border-primary/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Время</p>
                                <p className="text-lg font-bold">{formatTime(timeElapsed)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {bestScore !== undefined && bestScore > 0 && (
                <Card className="border-primary/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Рекорд</p>
                                <p className="text-lg font-bold">{bestScore}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {moves !== undefined && (
                <Card className="border-primary/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Ходы</p>
                                <p className="text-lg font-bold">{moves}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-primary/20">
                <CardContent className="p-3 flex items-center">
                    <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                        {getDifficultyLabel(difficulty)}
                    </Badge>
                </CardContent>
            </Card>
        </motion.div>
    )
}
