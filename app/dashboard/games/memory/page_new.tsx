"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useStore, gameStore, type Difficulty } from "@/lib/store"
import {
    DifficultySelect,
    VictoryScreen,
    GameHeader,
    GameStats
} from "@/shared"
import { Timer } from "lucide-react"

const emojisData = {
    easy: ["🎮", "📚", "🎯", "🏆", "⭐", "🎨", "🎵", "🔬"],
    medium: ["🎮", "📚", "🎯", "🏆", "⭐", "🎨", "🎵", "🔬", "🎭", "🎪", "🎬", "🎤", "🎧", "🎸", "🎹", "🎺", "🎻", "🥁"],
    hard: ["🎮", "📚", "🎯", "🏆", "⭐", "🎨", "🎵", "🔬", "🎭", "🎪", "🎬", "🎤", "🎧", "🎸", "🎹", "🎺", "🎻", "🥁", "🎲", "🎰", "🎳", "🎾", "🎿", "⚽", "⚾", "🏀", "🏈", "🏐", "🏓", "🏸", "🏒", "🏑"],
}

const gridColsClass = {
    easy: "grid-cols-4",
    medium: "grid-cols-6",
    hard: "grid-cols-8",
}

interface CardItem {
    id: number
    emoji: string
    flipped: boolean
    matched: boolean
}

export default function MemoryGamePage() {
    const router = useRouter()

    // Game store state
    const difficulty = useStore(gameStore, s => s.difficulty)
    const score = useStore(gameStore, s => s.score)
    const isPlaying = useStore(gameStore, s => s.isPlaying)
    const timeElapsed = useStore(gameStore, s => s.timeElapsed)
    const bestScores = useStore(gameStore, s => s.bestScores)
    const startGame = useStore(gameStore, s => s.startGame)
    const endGame = useStore(gameStore, s => s.endGame)
    const updateScore = useStore(gameStore, s => s.updateScore)
    const updateTime = useStore(gameStore, s => s.updateTime)
    const resetGame = useStore(gameStore, s => s.resetGame)

    // Local game state
    const [cards, setCards] = useState<CardItem[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)
    const [matches, setMatches] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)

    // Timer
    useEffect(() => {
        if (!isPlaying || gameComplete) return

        const interval = setInterval(() => {
            updateTime(timeElapsed + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [isPlaying, timeElapsed, gameComplete, updateTime])

    const initCards = (diff: Difficulty) => {
        const emojis = emojisData[diff]
        const shuffledCards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                flipped: false,
                matched: false,
            }))
        setCards(shuffledCards)
        setFlippedCards([])
        setMoves(0)
        setMatches(0)
        setGameComplete(false)
    }

    const handleDifficultySelect = (diff: Difficulty) => {
        startGame('memory', diff)
        initCards(diff)
    }

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return

        const newCards = [...cards]
        newCards[id].flipped = true
        setCards(newCards)

        const newFlippedCards = [...flippedCards, id]
        setFlippedCards(newFlippedCards)

        if (newFlippedCards.length === 2) {
            setMoves(moves + 1)
            const [first, second] = newFlippedCards

            if (cards[first].emoji === cards[second].emoji) {
                setTimeout(() => {
                    const matchedCards = [...cards]
                    matchedCards[first].matched = true
                    matchedCards[second].matched = true
                    setCards(matchedCards)
                    setFlippedCards([])
                    setMatches(matches + 1)

                    const pairsCount = emojisData[difficulty].length
                    if (matches + 1 === pairsCount) {
                        handleGameComplete()
                    }
                }, 500)
            } else {
                setTimeout(() => {
                    const resetCards = [...cards]
                    resetCards[first].flipped = false
                    resetCards[second].flipped = false
                    setCards(resetCards)
                    setFlippedCards([])
                }, 1000)
            }
        }
    }

    const handleGameComplete = () => {
        setGameComplete(true)

        const baseScore = 1000
        const movesPenalty = moves * 5
        const timeBonus = Math.max(0, 300 - timeElapsed)
        const diffMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2
        const finalScore = Math.floor((baseScore - movesPenalty + timeBonus) * diffMultiplier)

        updateScore(finalScore)
        endGame(finalScore)
    }

    const handleReset = () => {
        resetGame()
        setCards([])
        setFlippedCards([])
        setMoves(0)
        setMatches(0)
        setGameComplete(false)
    }

    const handleRestart = () => {
        setGameComplete(false)
        initCards(difficulty)
        startGame('memory', difficulty)
    }

    // Show difficulty selection
    if (!isPlaying && cards.length === 0) {
        return (
            <div className="px-4 py-6 md:px-8 md:py-8">
                <DifficultySelect
                    title="Игра Память"
                    description="Найди все пары карточек"
                    onSelect={handleDifficultySelect}
                />
            </div>
        )
    }

    const bestScore = bestScores.memory[difficulty]

    return (
        <div className="px-4 py-6 md:px-8 md:py-8">
            <GameHeader
                title="Игра Память"
                onReset={handleReset}
            />

            <GameStats
                score={score}
                timeElapsed={timeElapsed}
                bestScore={bestScore}
                difficulty={difficulty}
                moves={moves}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
            >
                <Card>
                    <div className={`grid gap-3 p-6 ${gridColsClass[difficulty]}`}>
                        {cards.map((card) => (
                            <MemoryCard
                                key={card.id}
                                card={card}
                                onClick={() => handleCardClick(card.id)}
                            />
                        ))}
                    </div>
                </Card>
            </motion.div>

            {gameComplete && (
                <VictoryScreen
                    score={score}
                    bestScore={bestScore}
                    isNewRecord={score > bestScore}
                    difficulty={difficulty}
                    timeSpent={timeElapsed}
                    onRestart={handleRestart}
                    stats={[
                        { label: 'Ходы', value: moves },
                        { label: 'Пары найдено', value: matches },
                    ]}
                />
            )}
        </div>
    )
}

// Memory Card Component
interface MemoryCardProps {
    card: CardItem
    onClick: () => void
}

function MemoryCard({ card, onClick }: MemoryCardProps) {
    return (
        <motion.div
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className={`aspect-square flex items-center justify-center text-4xl md:text-5xl transition-all ${card.matched
                    ? 'bg-green-500/10 border-green-500/50'
                    : card.flipped
                        ? 'bg-primary/10 border-primary/50'
                        : 'bg-muted hover:bg-muted/80'
                }`}>
                <motion.div
                    initial={false}
                    animate={{
                        rotateY: card.flipped || card.matched ? 0 : 180,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {(card.flipped || card.matched) ? card.emoji : '?'}
                </motion.div>
            </Card>
        </motion.div>
    )
}
