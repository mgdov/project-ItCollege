"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Shuffle, Check, X, Trophy, Star, Brain, Zap, Flame, Timer } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { saveGameScore, getBestScore, calculateScore } from "@/lib/scoring"

type Difficulty = "easy" | "medium" | "hard"

const wordsData = {
  easy: [
    { word: "СТОЛ", hint: "Мебель для работы" },
    { word: "КНИГА", hint: "Источник знаний" },
    { word: "УЧЕБА", hint: "Процесс получения знаний" },
    { word: "ШКОЛА", hint: "Учебное заведение" },
    { word: "УРОК", hint: "Занятие в школе" },
  ],
  medium: [
    { word: "ПРОГРАММА", hint: "Набор инструкций для компьютера" },
    { word: "СТУДЕНТ", hint: "Учащийся вуза" },
    { word: "КОМПЬЮТЕР", hint: "Электронное устройство" },
    { word: "МАТЕМАТИКА", hint: "Наука о числах" },
    { word: "ОБРАЗОВАНИЕ", hint: "Процесс получения знаний" },
  ],
  hard: [
    { word: "ПРОГРАММИРОВАНИЕ", hint: "Процесс создания компьютерных программ" },
    { word: "УНИВЕРСИТЕТ", hint: "Высшее учебное заведение" },
    { word: "ИНФОРМАТИКА", hint: "Наука об информации" },
    { word: "АЛГОРИТМ", hint: "Последовательность действий" },
    { word: "ЭНЦИКЛОПЕДИЯ", hint: "Справочное издание" },
  ],
}

export default function WordsPage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [words, setWords] = useState<typeof wordsData.easy>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [userWord, setUserWord] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const currentWord = words[currentWordIndex]

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff)
    setWords(wordsData[diff])
    setBestScore(getBestScore("Слова", diff))
    setTimerActive(true)
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

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const initWord = useCallback(() => {
    if (!currentWord) return
    const letters = currentWord.word.split("")
    setShuffledLetters(shuffleArray(letters))
    setUserWord([])
    setShowResult(false)
  }, [currentWord])

  useEffect(() => {
    if (currentWord) {
      initWord()
    }
  }, [initWord, currentWord])

  const handleLetterClick = (index: number) => {
    if (showResult) return
    const letter = shuffledLetters[index]
    setUserWord([...userWord, letter])
    const newShuffled = [...shuffledLetters]
    newShuffled.splice(index, 1)
    setShuffledLetters(newShuffled)
  }

  const handleUserLetterClick = (index: number) => {
    if (showResult) return
    const letter = userWord[index]
    const newUserWord = [...userWord]
    newUserWord.splice(index, 1)
    setUserWord(newUserWord)
    setShuffledLetters([...shuffledLetters, letter])
  }

  const checkWord = () => {
    if (!currentWord) return
    const correct = userWord.join("") === currentWord.word
    setIsCorrect(correct)
    setShowResult(true)
    if (correct) {
      const wordLength = currentWord.word.length
      const pointsPerLetter = 10
      const baseScore = wordLength * pointsPerLetter
      setScore(score + baseScore)

      // Проверка победы - все слова пройдены
      if (currentWordIndex === words.length - 1) {
        setTimerActive(false)
        // Бонус за время
        const timeBonus = Math.max(0, 300 - timer) // Бонус за скорость (максимум 5 минут)
        const finalScore = Math.floor((score + baseScore + timeBonus) * calculateScore(1, difficulty!))
        saveGameScore("Слова", finalScore, difficulty!)
        setShowScoreAnimation(true)
      }
    }
  }

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      setCurrentWordIndex(0)
    }
  }

  const reshuffleLetters = () => {
    const allLetters = [...shuffledLetters, ...userWord]
    setShuffledLetters(shuffleArray(allLetters))
    setUserWord([])
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setTimer(0)
    setTimerActive(true)
    setShowScoreAnimation(false)
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
                  <p className="text-sm text-muted-foreground">Короткие слова (4-5 букв)</p>
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
                  <p className="text-sm text-muted-foreground">Средние слова (7-10 букв)</p>
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
                  <p className="text-sm text-muted-foreground">Длинные слова (11-15 букв)</p>
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

  // Экран победы с баллами
  if (showScoreAnimation) {
    const timeBonus = Math.max(0, 300 - timer)
    const finalScore = Math.floor((score + timeBonus) * calculateScore(1, difficulty))

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
                  Победа!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 text-muted-foreground"
                >
                  Вы отгадали все слова на уровне "{difficulty === "easy" ? "Лёгкий" : difficulty === "medium" ? "Средний" : "Сложный"}"!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-2 space-y-2"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>Время: {formatTime(timer)}</span>
                  </div>
                  <div className="text-2xl font-bold">{words.length} слов</div>
                  <div className="text-sm text-muted-foreground">отгадано</div>
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
                      resetGame()
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Играть ещё
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setDifficulty(null)
                      resetGame()
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

  if (!currentWord) {
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
            <h1 className="text-2xl font-bold">Игра в слова</h1>
            <p className="text-sm text-muted-foreground">
              Слово {currentWordIndex + 1} из {words.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <Timer className="h-4 w-4" />
            {formatTime(timer)}
          </Badge>
          <Badge className="text-lg">Очки: {score}</Badge>
        </div>
      </div>

      <Card className="mx-auto max-w-2xl border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-muted-foreground">Подсказка</CardTitle>
          <p className="text-xl font-medium">{currentWord.hint}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User's word */}
          <div className="min-h-[60px] rounded-lg border-2 border-dashed border-border bg-muted/30 p-3">
            <div className="flex flex-wrap justify-center gap-2">
              {userWord.length === 0 ? (
                <span className="text-muted-foreground">Нажмите на буквы ниже</span>
              ) : (
                userWord.map((letter, index) => (
                  <Button
                    key={index}
                    variant="default"
                    className={`h-12 w-12 text-lg font-bold ${showResult
                      ? isCorrect
                        ? "bg-success hover:bg-success"
                        : "bg-destructive hover:bg-destructive"
                      : ""
                      }`}
                    onClick={() => handleUserLetterClick(index)}
                    disabled={showResult}
                  >
                    {letter}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Available letters */}
          <div className="flex flex-wrap justify-center gap-2">
            {shuffledLetters.map((letter, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 w-12 text-lg font-bold bg-transparent"
                onClick={() => handleLetterClick(index)}
                disabled={showResult}
              >
                {letter}
              </Button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div
              className={`flex items-center justify-center gap-2 rounded-lg p-4 ${isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}
            >
              {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              <span className="font-medium">
                {isCorrect ? "Правильно! +10 очков" : `Неправильно. Ответ: ${currentWord.word}`}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {!showResult ? (
              <>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={reshuffleLetters}>
                  <Shuffle className="h-4 w-4" />
                  Перемешать
                </Button>
                <Button className="flex-1" onClick={checkWord} disabled={userWord.length === 0}>
                  Проверить
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={initWord}>
                  <RotateCcw className="h-4 w-4" />
                  Попробовать снова
                </Button>
                <Button className="flex-1" onClick={nextWord}>
                  Следующее слово
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
