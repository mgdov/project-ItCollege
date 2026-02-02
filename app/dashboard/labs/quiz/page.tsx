"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileQuestion, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Brain } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const quizQuestions = [
    {
        id: 1,
        question: "Какой язык программирования используется для веб-разработки?",
        options: ["Python", "JavaScript", "C++", "Java"],
        correct: 1,
    },
    {
        id: 2,
        question: "Что означает HTML?",
        options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
        correct: 0,
    },
    {
        id: 3,
        question: "Какая из этих баз данных является реляционной?",
        options: ["MongoDB", "PostgreSQL", "Redis", "Cassandra"],
        correct: 1,
    },
    {
        id: 4,
        question: "Что такое React?",
        options: ["Язык программирования", "Библиотека для создания UI", "База данных", "Операционная система"],
        correct: 1,
    },
    {
        id: 5,
        question: "Какой HTTP метод используется для получения данных?",
        options: ["POST", "PUT", "GET", "DELETE"],
        correct: 2,
    },
    {
        id: 6,
        question: "Что такое API?",
        options: ["Application Programming Interface", "Advanced Programming Integration", "Automated Program Installation", "Application Process Integration"],
        correct: 0,
    },
]

export default function QuizLabPage() {
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
            <div className="min-h-screen pb-12">
                <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white">
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200"
                            alt="Quiz Background"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative px-4 py-16 md:px-8 md:py-20"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${percentage >= 70 ? "bg-yellow-500/20" : percentage >= 50 ? "bg-blue-500/20" : "bg-red-500/20"
                                    } backdrop-blur-sm`}
                            >
                                {percentage >= 70 ? <Award className="h-12 w-12" /> : <Brain className="h-12 w-12" />}
                            </motion.div>
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Квиз завершён!</h1>
                            <p className="mb-8 text-lg opacity-90">
                                Вы ответили правильно на {score} из {quizQuestions.length} вопросов
                            </p>
                            <div className="mb-6 text-6xl font-bold">{percentage}%</div>
                            <Badge className={`mb-8 px-6 py-2 text-lg ${percentage >= 70 ? "bg-yellow-500" : percentage >= 50 ? "bg-blue-500" : "bg-red-500"
                                }`}>
                                {percentage >= 70 ? "Превосходно!" : percentage >= 50 ? "Хорошая попытка!" : "Попробуйте снова"}
                            </Badge>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Button variant="outline" size="lg" className="gap-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" onClick={resetQuiz}>
                                    <RotateCcw className="h-5 w-5" />
                                    Пройти снова
                                </Button>
                                <Button size="lg" className="gap-2 bg-white text-green-600 hover:bg-white/90" onClick={() => (window.location.href = "/dashboard/labs")}>
                                    К лабораторным
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200"
                        alt="Quiz Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative px-4 py-12 md:px-8 md:py-16"
                >
                    <div className="mx-auto max-w-4xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
                        >
                            <FileQuestion className="h-5 w-5" />
                            <span className="text-sm font-medium">Интерактивные квизы</span>
                        </motion.div>
                        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Квизы</h1>
                        <p className="mb-6 text-lg opacity-90">Проверьте свои знания</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                                <Brain className="h-5 w-5" />
                                <span>Вопрос {currentQuestion + 1} / {quizQuestions.length}</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                                <Award className="h-5 w-5" />
                                <span>Баллы: {score}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="px-4 py-8 md:px-8">
                <div className="mx-auto max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="mb-6 border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                            <CardContent className="py-4">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Прогресс</span>
                                    <span className="font-medium">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-3" />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="border-2 border-green-500/30 shadow-xl">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                                        <FileQuestion className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Вопрос {currentQuestion + 1}</CardTitle>
                                        <CardDescription>Выберите один правильный ответ</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-8 text-2xl font-medium">{question.question}</p>

                                <div className="grid gap-4">
                                    {question.options.map((option, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                                            <Button
                                                variant="outline"
                                                className={`h-auto w-full justify-start p-4 text-left transition-all ${selectedAnswer === index
                                                        ? showResult
                                                            ? index === question.correct
                                                                ? "border-green-500 bg-green-500/10 text-green-600"
                                                                : "border-red-500 bg-red-500/10 text-red-600"
                                                            : "border-green-500 bg-green-500/10"
                                                        : showResult && index === question.correct
                                                            ? "border-green-500 bg-green-500/10 text-green-600"
                                                            : "hover:border-green-500/50 hover:bg-green-500/5"
                                                    }`}
                                                onClick={() => handleAnswer(index)}
                                                disabled={showResult}
                                            >
                                                <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-current font-bold">
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="flex-1">{option}</span>
                                                {showResult && index === question.correct && <CheckCircle2 className="ml-2 h-6 w-6" />}
                                                {showResult && selectedAnswer === index && index !== question.correct && <XCircle className="ml-2 h-6 w-6" />}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8 flex gap-4">
                                    {!showResult ? (
                                        <Button onClick={checkAnswer} disabled={selectedAnswer === null} size="lg" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                            Проверить ответ
                                        </Button>
                                    ) : (
                                        <Button onClick={nextQuestion} size="lg" className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                            {currentQuestion < quizQuestions.length - 1 ? (
                                                <>Следующий вопрос <ArrowRight className="h-5 w-5" /></>
                                            ) : (
                                                <>Завершить квиз <CheckCircle2 className="h-5 w-5" /></>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
