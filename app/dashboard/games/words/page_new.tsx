"use client"

import { useState, useEffect, useCallback } from "react"
import { useStore, gameStore, type Difficulty } from "@/lib/store"
import {
    DifficultySelect,
    VictoryScreen,
    GameHeader,
    GameStats
} from "@/shared"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Check, X, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { wordsData, shuffleArray, calculateWordsScore, type WordData } from "@/shared/games/words-utils"

export default function WordsGamePage() {
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
    const [words, setWords] = useState<WordData[]>([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
    const [userWord, setUserWord] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)
    const [showHint, setShowHint] = useState(false)
    const [gameComplete, setGameComplete] = useState(false)

    const currentWord = words[currentWordIndex]

    // Timer
    useEffect(() => {
        if (!isPlaying || gameComplete) return

        const interval = setInterval(() => {
            updateTime(timeElapsed + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [isPlaying, timeElapsed, gameComplete, updateTime])

    const initWord = useCallback(() => {
        if (!currentWord) return
        const letters = currentWord.word.split("")
        setShuffledLetters(shuffleArray(letters))
        setUserWord([])
        setShowResult(false)
        setShowHint(false)
    }, [currentWord])

    useEffect(() => {
        if (currentWord) {
            initWord()
        }
    }, [initWord, currentWord])

    const handleDifficultySelect = (diff: Difficulty) => {
        startGame('words', diff)
        setWords(wordsData[diff])
        setCurrentWordIndex(0)
        setCorrectCount(0)
        setGameComplete(false)
    }

    const handleLetterClick = (index: number) => {
        if (showResult) return
        const letter = shuffledLetters[index]
        setUserWord([...userWord, letter])
        const newShuffled = [...shuffledLetters]
        newShuffled.splice(index, 1)
        setShuffledLetters(newShuffled)
    }

    const handleRemoveLetter = (index: number) => {
        if (showResult) return
        const letter = userWord[index]
        setShuffledLetters([...shuffledLetters, letter])
        const newUserWord = [...userWord]
        newUserWord.splice(index, 1)
        setUserWord(newUserWord)
    }

    const checkWord = () => {
        if (!currentWord) return
        const isWordCorrect = userWord.join("") === currentWord.word
        setIsCorrect(isWordCorrect)
        setShowResult(true)

        if (isWordCorrect) {
            const wordScore = currentWord.word.length * 10
            const newScore = score + wordScore
            updateScore(newScore)
            setCorrectCount(correctCount + 1)

            setTimeout(() => {
                if (currentWordIndex < words.length - 1) {
                    setCurrentWordIndex(currentWordIndex + 1)
                } else {
                    handleGameComplete()
                }
            }, 1500)
        }
    }

    const skipWord = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1)
        } else {
            handleGameComplete()
        }
    }

    const shuffleCurrentWord = () => {
        setShuffledLetters(shuffleArray(shuffledLetters))
    }

    const handleGameComplete = () => {
        setGameComplete(true)
        const finalScore = calculateWordsScore(correctCount, words.length, timeElapsed, difficulty)
        updateScore(finalScore)
        endGame(finalScore)
    }

    const handleReset = () => {
        resetGame()
        setWords([])
        setCurrentWordIndex(0)
        setShuffledLetters([])
        setUserWord([])
        setShowResult(false)
        setCorrectCount(0)
        setShowHint(false)
        setGameComplete(false)
    }

    const handleRestart = () => {
        setGameComplete(false)
        setWords(wordsData[difficulty])
        setCurrentWordIndex(0)
        setCorrectCount(0)
        startGame('words', difficulty)
    }

    const bestScore = bestScores.words[difficulty]

    // Show difficulty selection
    if (!isPlaying && words.length === 0) {
        return (
            <div className="px-4 py-6 md:px-8 md:py-8">
                <DifficultySelect
                    title="Составь слова"
                    description="Собери слова из перемешанных букв"
                    onSelect={handleDifficultySelect}
                />
            </div>
        )
    }

    if (!currentWord) return null

    return (
        <div className="px-4 py-6 md:px-8 md:py-8">
            <GameHeader title="Составь слова" onReset={handleReset} />

            <GameStats
                score={score}
                timeElapsed={timeElapsed}
                bestScore={bestScore}
                difficulty={difficulty}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 max-w-2xl mx-auto"
            >
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="text-lg px-4 py-2">
                                Слово {currentWordIndex + 1} / {words.length}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowHint(!showHint)}
                            >
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Подсказка
                            </Button>
                        </div>

                        <AnimatePresence>
                            {showHint && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-primary/10 rounded-lg"
                                >
                                    <p className="text-sm text-center">{currentWord.hint}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* User's word */}
                        <div className="min-h-[80px] flex items-center justify-center gap-2 mb-6 flex-wrap">
                            {userWord.length === 0 ? (
                                <p className="text-muted-foreground">Составьте слово из букв ниже</p>
                            ) : (
                                userWord.map((letter, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleRemoveLetter(index)}
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-primary text-primary-foreground text-2xl font-bold shadow-lg hover:bg-primary/80 transition-colors"
                                    >
                                        {letter}
                                    </motion.button>
                                ))
                            )}
                        </div>

                        {/* Available letters */}
                        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                            {shuffledLetters.map((letter, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLetterClick(index)}
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-muted hover:bg-muted/80 text-2xl font-bold shadow-lg transition-colors"
                                    disabled={showResult}
                                >
                                    {letter}
                                </motion.button>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="outline"
                                onClick={shuffleCurrentWord}
                                disabled={showResult}
                            >
                                <Shuffle className="h-4 w-4 mr-2" />
                                Перемешать
                            </Button>
                            <Button
                                onClick={checkWord}
                                disabled={userWord.length === 0 || showResult}
                                className="min-w-[120px]"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Проверить
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={skipWord}
                                disabled={showResult}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Пропустить
                            </Button>
                        </div>

                        {/* Result feedback */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`mt-6 p-4 rounded-lg text-center ${isCorrect
                                            ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                                            : 'bg-red-500/20 text-red-700 dark:text-red-400'
                                        }`}
                                >
                                    <p className="font-bold text-lg">
                                        {isCorrect ? '🎉 Правильно!' : '❌ Неправильно'}
                                    </p>
                                    {!isCorrect && (
                                        <p className="mt-2">Правильное слово: {currentWord.word}</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Прогресс</p>
                            <p className="text-2xl font-bold text-primary mt-1">
                                {correctCount} / {words.length}
                            </p>
                        </div>
                    </CardContent>
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
                        { label: 'Правильных слов', value: `${correctCount}/${words.length}` },
                        { label: 'Процент', value: `${Math.round((correctCount / words.length) * 100)}%` },
                    ]}
                />
            )}
        </div>
    )
}
