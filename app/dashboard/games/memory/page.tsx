"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Trophy, Star, Brain, Zap, Flame, Timer } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { saveGameScore, getBestScore, calculateScore } from "@/lib/scoring"

type Difficulty = "easy" | "medium" | "hard"

const emojisData = {
  easy: ["🎮", "📚", "🎯", "🏆", "⭐", "🎨", "🎵", "🔬"], // 4x4 = 8 pairs
  medium: ["🎮", "📚", "🎯", "🏆", "⭐", "🎨", "🎵", "🔬", "🎭", "🎪", "🎬", "🎤", "🎧", "🎸", "🎹", "🎺", "🎻", "🥁"], // 6x6 = 18 pairs
  hard: ["🎮", "📚", "🎯", "🏆", "⭐", "🎨", "🎵", "🔬", "🎭", "🎪", "🎬", "🎤", "🎧", "🎸", "🎹", "🎺", "🎻", "🥁", "🎲", "🎰", "🎳", "🎾", "🎿", "⚽", "⚾", "🏀", "🏈", "🏐", "🏓", "🏸", "🏒", "🏑"], // 8x8 = 32 pairs
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

export default function MemoryPage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [emojis, setEmojis] = useState<string[]>([])
  const [cards, setCards] = useState<CardItem[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff)
    setEmojis(emojisData[diff])
    setBestScore(getBestScore("Мемори", diff))
  }

  // Таймер
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  const initGame = () => {
    if (emojis.length === 0) return

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
    setShowScoreAnimation(false)
    setTimer(0)
    setTimerActive(true)
  }

  useEffect(() => {
    if (emojis.length > 0) {
      initGame()
    }
  }, [emojis])

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].flipped || cards[id].matched) return

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

          if (matches + 1 === emojis.length) {
            setTimerActive(false)
            setGameComplete(true)

            // Расчет баллов
            const baseScore = 1000
            const movesPenalty = moves * 5
            const timeBonus = Math.max(0, 300 - timer) // Бонус за скорость
            const finalScore = Math.floor((baseScore - movesPenalty + timeBonus) * calculateScore(1, difficulty!))
            saveGameScore("Мемори", finalScore, difficulty!)
            setShowScoreAnimation(true)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Экран выбора сложности
  if (!difficulty) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Выберите сложность</h1>
        </div>

        <div className="mx-auto max-w-md space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="cursor-pointer border-border/50 transition-all hover:border-green-500/50 hover:shadow-lg"
              onClick={() => handleDifficultySelect("easy")}
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
                  <Zap className="h-7 w-7 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-600 dark:text-green-400">Лёгкий</h3>
                  <p className="text-sm text-muted-foreground">Сетка 4x4 (8 пар)</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" />
                    <span>Множитель: x1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              className="cursor-pointer border-border/50 transition-all hover:border-amber-500/50 hover:shadow-lg"
              onClick={() => handleDifficultySelect("medium")}
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
                  <Brain className="h-7 w-7 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-600 dark:text-amber-400">Средний</h3>
                  <p className="text-sm text-muted-foreground">Сетка 6x6 (18 пар)</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>Множитель: x1.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              className="cursor-pointer border-border/50 transition-all hover:border-red-500/50 hover:shadow-lg"
              onClick={() => handleDifficultySelect("hard")}
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
                  <Flame className="h-7 w-7 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Сложный</h3>
                  <p className="text-sm text-muted-foreground">Сетка 8x8 (32 пары)</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-red-500 text-red-500" />
                    <Star className="h-3 w-3 fill-red-500 text-red-500" />
                    <span>Множитель: x2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Экран победы
  if (showScoreAnimation) {
    const baseScore = 1000
    const movesPenalty = moves * 5
    const timeBonus = Math.max(0, 300 - timer)
    const finalScore = Math.floor((baseScore - movesPenalty + timeBonus) * calculateScore(1, difficulty))

    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-md"
          >
            <Card className="border-warning/50 bg-gradient-to-br from-warning/10 to-warning/5">
              <CardContent className="pt-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-warning/20"
                >
                  <Trophy className="h-12 w-12 text-warning" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-3xl font-bold"
                >
                  Поздравляем!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 text-muted-foreground"
                >
                  Вы нашли все пары на уровне "{difficulty === "easy" ? "Лёгкий" : difficulty === "medium" ? "Средний" : "Сложный"}"!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                    <div>
                      <div className="text-2xl font-bold">{moves}</div>
                      <div className="text-sm">ходов</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Timer className="h-5 w-5" />
                        {formatTime(timer)}
                      </div>
                      <div className="text-sm">время</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="mb-2"
                >
                  <div className="text-5xl font-bold text-warning">{finalScore}</div>
                  <div className="text-sm text-muted-foreground">баллов заработано</div>
                </motion.div>

                {bestScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6 text-sm text-muted-foreground"
                  >
                    Лучший результат: {bestScore} баллов
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 flex gap-3"
                >
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      initGame()
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Играть ещё
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setDifficulty(null)
                      setEmojis([])
                    }}
                  >
                    Выбрать сложность
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  if (gameComplete) {
    // Этот блок больше не нужен, используется showScoreAnimation
    return null
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setDifficulty(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Мемори</h1>
            <p className="text-sm text-muted-foreground">Найдите все одинаковые карточки</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <Timer className="h-4 w-4" />
            {formatTime(timer)}
          </Badge>
          <Badge variant="secondary">Ходов: {moves}</Badge>
          <Badge className="bg-success text-success-foreground">
            Найдено: {matches}/{emojis.length}
          </Badge>
        </div>
      </div>

      <Card className="mx-auto max-w-4xl border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-lg">Нажимайте на карточки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-2 ${gridColsClass[difficulty!]}`}>
            {cards.map((card) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex aspect-square items-center justify-center rounded-xl text-3xl transition-all ${card.flipped || card.matched ? "bg-primary/10" : "bg-muted hover:bg-muted/80 cursor-pointer"
                  } ${card.matched ? "opacity-50" : ""}`}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched}
              >
                {card.flipped || card.matched ? card.emoji : "?"}
              </motion.button>
            ))}
          </div>

          <Button variant="outline" className="mt-6 w-full gap-2 bg-transparent" onClick={initGame}>
            <RotateCcw className="h-4 w-4" />
            Новая игра
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
