'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FileQuestion, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, studentStore } from '@/lib/store'
import { PageHeader, VictoryScreen } from '@/components/shared'
import { useRouter } from 'next/navigation'

const quizQuestions = [
    {
        id: 1,
        question: 'Какой язык программирования используется для веб-разработки?',
        options: ['Python', 'JavaScript', 'C++', 'Java'],
        correct: 1,
    },
    {
        id: 2,
        question: 'Что означает HTML?',
        options: [
            'HyperText Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlinks and Text Markup Language',
        ],
        correct: 0,
    },
    {
        id: 3,
        question: 'Какая из этих баз данных является реляционной?',
        options: ['MongoDB', 'PostgreSQL', 'Redis', 'Cassandra'],
        correct: 1,
    },
    {
        id: 4,
        question: 'Что такое React?',
        options: [
            'Язык программирования',
            'Библиотека для создания UI',
            'База данных',
            'Операционная система',
        ],
        correct: 1,
    },
    {
        id: 5,
        question: 'Какой HTTP метод используется для получения данных?',
        options: ['POST', 'PUT', 'GET', 'DELETE'],
        correct: 2,
    },
    {
        id: 6,
        question: 'Что такое API?',
        options: [
            'Application Programming Interface',
            'Advanced Programming Integration',
            'Automated Program Installation',
            'Application Process Integration',
        ],
        correct: 0,
    },
]

export default function QuizLabPage() {
    const router = useRouter()
    const profile = useStore(studentStore, (s) => s.profile)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null))
    const [isComplete, setIsComplete] = useState(false)

    const question = quizQuestions[currentQuestion]
    const progress = ((currentQuestion + (showResult ? 1 : 0)) / quizQuestions.length) * 100

    const handleAnswer = (index: number) => {
        if (showResult) return
        setSelectedAnswer(index)
    }

    const checkAnswer = () => {
        if (selectedAnswer === null) return
        setShowResult(true)
        if (selectedAnswer === question.correct) {
            setScore(score + 1)
        }
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = selectedAnswer
        setAnswers(newAnswers)
    }

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setIsComplete(true)

            // Update grade in store
            const percentage = Math.round(((score + (selectedAnswer === question.correct ? 1 : 0)) / quizQuestions.length) * 100)
            studentStore.getState().updateGrade({
                subject: 'Программирование',
                grade: percentage,
                date: new Date().toISOString(),
            })
        }
    }

    const resetQuiz = () => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
        setAnswers(new Array(quizQuestions.length).fill(null))
        setIsComplete(false)
    }

    if (isComplete) {
        const percentage = Math.round((score / quizQuestions.length) * 100)
        return (
            <div className="min-h-screen">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="container max-w-2xl py-12"
                >
                    <Card className="text-center p-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${percentage >= 70
                                    ? 'bg-yellow-500/20'
                                    : percentage >= 50
                                        ? 'bg-blue-500/20'
                                        : 'bg-red-500/20'
                                }`}
                        >
                            {percentage >= 70 ? <Award className="h-12 w-12" /> : <Brain className="h-12 w-12" />}
                        </motion.div>
                        <h1 className="mb-4 text-4xl font-bold">Квиз завершён!</h1>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Вы ответили правильно на {score} из {quizQuestions.length} вопросов
                        </p>
                        <div className="mb-6 text-6xl font-bold">{percentage}%</div>
                        <Badge
                            className={`mb-8 px-6 py-2 text-lg ${percentage >= 70 ? 'bg-yellow-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-red-500'
                                }`}
                        >
                            {percentage >= 70
                                ? 'Превосходно!'
                                : percentage >= 50
                                    ? 'Хорошая попытка!'
                                    : 'Попробуйте снова'}
                        </Badge>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button variant="outline" size="lg" onClick={resetQuiz}>
                                <RotateCcw className="mr-2 h-5 w-5" />
                                Пройти снова
                            </Button>
                            <Button size="lg" onClick={() => router.push('/dashboard/labs')}>
                                К лабораторным
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Квиз по программированию"
                description="Проверьте свои знания"
                icon={FileQuestion}
            />

            <div className="container max-w-3xl py-8">
                {/* Progress */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="mb-2 flex justify-between text-sm">
                            <span>
                                Вопрос {currentQuestion + 1} из {quizQuestions.length}
                            </span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </CardContent>
                </Card>

                {/* Question */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{question.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {question.options.map((option, index) => {
                                const isSelected = selectedAnswer === index
                                const isCorrect = question.correct === index
                                const showCorrect = showResult && isCorrect
                                const showIncorrect = showResult && isSelected && !isCorrect

                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: showResult ? 1 : 1.02 }}
                                        whileTap={{ scale: showResult ? 1 : 0.98 }}
                                        onClick={() => handleAnswer(index)}
                                        disabled={showResult}
                                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${showCorrect
                                                ? 'border-green-500 bg-green-500/10'
                                                : showIncorrect
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : isSelected
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                            {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                                        </div>
                                    </motion.button>
                                )
                            })}

                            <div className="flex gap-3 pt-4">
                                {!showResult ? (
                                    <Button onClick={checkAnswer} disabled={selectedAnswer === null} className="flex-1">
                                        Проверить ответ
                                    </Button>
                                ) : (
                                    <Button onClick={nextQuestion} className="flex-1">
                                        {currentQuestion < quizQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить квиз'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Score */}
                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <div className="flex justify-between text-sm">
                            <span>Правильных ответов:</span>
                            <Badge variant="outline" className="font-bold">
                                {score} / {quizQuestions.length}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
