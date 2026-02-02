'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Phone, Users, Split, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/store'
import { gameStore } from '@/lib/store'
import {
    DifficultySelect,
    VictoryScreen,
    GameHeader,
    GameStats,
} from '@/components/shared'
import {
    questionsData,
    formatPrize,
    useFiftyFifty,
    simulateAudience,
    type Question,
} from '@/components/shared/games/millionaire-utils'
import type { Difficulty } from '@/lib/store'

export default function MillionairePage() {
    const difficulty = useStore(gameStore, (s) => s.difficulty)
    const score = useStore(gameStore, (s) => s.score)
    const time = useStore(gameStore, (s) => s.time)
    const bestScores = useStore(gameStore, (s) => s.bestScores)

    const [gameStarted, setGameStarted] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [won, setWon] = useState(false)
    const [totalPrize, setTotalPrize] = useState(0)

    // Lifelines
    const [fiftyFifty, setFiftyFifty] = useState(true)
    const [phoneUsed, setPhoneUsed] = useState(false)
    const [audienceUsed, setAudienceUsed] = useState(false)
    const [hiddenOptions, setHiddenOptions] = useState<number[]>([])
    const [audienceVotes, setAudienceVotes] = useState<number[] | null>(null)
    const [friendAnswer, setFriendAnswer] = useState<number | null>(null)

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const timer = setInterval(() => {
                gameStore.setState({ time: time + 1 })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [gameStarted, gameOver, time])

    const handleDifficultySelect = (diff: Difficulty) => {
        gameStore.setState({ difficulty: diff, score: 0, time: 0 })
        setQuestions(questionsData[diff])
        setGameStarted(true)
    }

    const handleReset = () => {
        setGameStarted(false)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setGameOver(false)
        setWon(false)
        setTotalPrize(0)
        setFiftyFifty(true)
        setPhoneUsed(false)
        setAudienceUsed(false)
        setHiddenOptions([])
        setAudienceVotes(null)
        setFriendAnswer(null)
        gameStore.setState({ score: 0, time: 0 })
    }

    const handleAnswerSelect = (index: number) => {
        if (showResult || selectedAnswer !== null) return
        setSelectedAnswer(index)
    }

    const handleConfirmAnswer = () => {
        if (selectedAnswer === null) return

        const question = questions[currentQuestion]
        const isCorrect = selectedAnswer === question.correct

        if (isCorrect) {
            const newPrize = totalPrize + question.prize
            setTotalPrize(newPrize)
            gameStore.setState({ score: newPrize })
            setShowResult(true)

            setTimeout(() => {
                if (currentQuestion + 1 >= questions.length) {
                    setWon(true)
                    setGameOver(true)

                    const currentBest = bestScores[difficulty] || 0
                    if (newPrize > currentBest) {
                        gameStore.setState({
                            bestScores: { ...bestScores, [difficulty]: newPrize },
                        })
                    }
                } else {
                    setCurrentQuestion(currentQuestion + 1)
                    setSelectedAnswer(null)
                    setShowResult(false)
                    setHiddenOptions([])
                    setAudienceVotes(null)
                    setFriendAnswer(null)
                }
            }, 1500)
        } else {
            setShowResult(true)
            setTimeout(() => {
                setGameOver(true)
            }, 1500)
        }
    }

    const handleFiftyFifty = () => {
        if (!fiftyFifty || showResult) return
        const hidden = useFiftyFifty(questions[currentQuestion], hiddenOptions)
        setHiddenOptions(hidden)
        setFiftyFifty(false)
    }

    const handlePhone = () => {
        if (phoneUsed || showResult) return
        const question = questions[currentQuestion]

        // Friend is 70% correct
        const answer = Math.random() < 0.7
            ? question.correct
            : Math.floor(Math.random() * 4)

        setFriendAnswer(answer)
        setPhoneUsed(true)
    }

    const handleAudience = () => {
        if (audienceUsed || showResult) return
        const question = questions[currentQuestion]
        const votes = simulateAudience(question.correct)
        setAudienceVotes(votes)
        setAudienceUsed(true)
    }

    if (!gameStarted) {
        return (
            <div className="container max-w-7xl py-8">
                <DifficultySelect
                    title="Кто хочет стать миллионером?"
                    description="Ответьте на все вопросы и выиграйте миллион!"
                    onSelect={handleDifficultySelect}
                />
            </div>
        )
    }

    if (gameOver) {
        return (
            <VictoryScreen
                title={won ? 'Поздравляем! 🎉' : 'Игра окончена'}
                message={
                    won
                        ? `Вы выиграли ${formatPrize(totalPrize)}!`
                        : `Вы выиграли ${formatPrize(totalPrize)}`
                }
                score={totalPrize}
                time={time}
                bestScore={bestScores[difficulty] || 0}
                onPlayAgain={handleReset}
            />
        )
    }

    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
        <div className="container max-w-7xl py-8 space-y-6">
            <GameHeader title="Миллионер" onReset={handleReset} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Game Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress */}
                    <Card className="p-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
                                <span className="font-bold">{formatPrize(question.prize)}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </Card>

                    {/* Lifelines */}
                    <Card className="p-6">
                        <div className="flex gap-4 justify-center">
                            <Button
                                variant={fiftyFifty ? 'default' : 'ghost'}
                                disabled={!fiftyFifty}
                                onClick={handleFiftyFifty}
                                className="flex-1"
                            >
                                <Split className="mr-2 h-4 w-4" />
                                50/50
                            </Button>
                            <Button
                                variant={phoneUsed ? 'ghost' : 'default'}
                                disabled={phoneUsed}
                                onClick={handlePhone}
                                className="flex-1"
                            >
                                <Phone className="mr-2 h-4 w-4" />
                                Звонок другу
                            </Button>
                            <Button
                                variant={audienceUsed ? 'ghost' : 'default'}
                                disabled={audienceUsed}
                                onClick={handleAudience}
                                className="flex-1"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Помощь зала
                            </Button>
                        </div>
                    </Card>

                    {/* Question */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-8 text-center">
                            {question.question}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="wait">
                                {question.options.map((option, index) => {
                                    const isHidden = hiddenOptions.includes(index)
                                    const isSelected = selectedAnswer === index
                                    const isCorrect = question.correct === index
                                    const showCorrect = showResult && isCorrect
                                    const showIncorrect = showResult && isSelected && !isCorrect

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: isHidden ? 0.3 : 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Button
                                                variant={
                                                    showCorrect
                                                        ? 'default'
                                                        : showIncorrect
                                                            ? 'destructive'
                                                            : isSelected
                                                                ? 'secondary'
                                                                : 'outline'
                                                }
                                                className="w-full h-auto py-4 text-left justify-start"
                                                onClick={() => handleAnswerSelect(index)}
                                                disabled={isHidden || showResult}
                                            >
                                                <span className="mr-3 font-bold">
                                                    {String.fromCharCode(65 + index)}:
                                                </span>
                                                {option}
                                            </Button>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>

                        {selectedAnswer !== null && !showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex justify-center"
                            >
                                <Button onClick={handleConfirmAnswer} size="lg">
                                    Подтвердить ответ
                                </Button>
                            </motion.div>
                        )}

                        {/* Friend Answer */}
                        {friendAnswer !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                            >
                                <p className="text-center">
                                    <Phone className="inline mr-2 h-4 w-4" />
                                    Друг считает, что правильный ответ:{' '}
                                    <strong>{String.fromCharCode(65 + friendAnswer)}</strong>
                                </p>
                            </motion.div>
                        )}

                        {/* Audience Votes */}
                        {audienceVotes && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg space-y-2"
                            >
                                <p className="text-center font-semibold mb-3">
                                    <Users className="inline mr-2 h-4 w-4" />
                                    Голоса зала:
                                </p>
                                {audienceVotes.map((votes, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="w-6 font-bold">
                                            {String.fromCharCode(65 + index)}:
                                        </span>
                                        <Progress value={votes} className="h-6 flex-1" />
                                        <span className="w-12 text-right">{votes}%</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <GameStats score={totalPrize} time={time} bestScore={bestScores[difficulty] || 0} />

                    {/* Prize Ladder */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center">
                            <Trophy className="mr-2 h-5 w-5" />
                            Призовая лестница
                        </h3>
                        <div className="space-y-2">
                            {questions.map((q, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg text-sm ${index === currentQuestion
                                            ? 'bg-primary text-primary-foreground font-bold'
                                            : index < currentQuestion
                                                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                                : 'bg-muted/50'
                                        }`}
                                >
                                    <div className="flex justify-between">
                                        <span>{index + 1}.</span>
                                        <span>{formatPrize(q.prize)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
