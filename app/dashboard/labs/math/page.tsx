"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calculator, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, TrendingUp } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const mathProblems = [
  { id: 1, question: "Решите уравнение: x + 5 = 12", options: ["x = 5", "x = 7", "x = 17", "x = -7"], correct: 1 },
  { id: 2, question: "Решите уравнение: 2x - 4 = 10", options: ["x = 3", "x = 7", "x = 14", "x = 5"], correct: 1 },
  { id: 3, question: "Решите уравнение: x² = 25", options: ["x = 5", "x = -5", "x = ±5", "x = 12.5"], correct: 2 },
  { id: 4, question: "Найдите значение: 3² + 4²", options: ["25", "12", "7", "49"], correct: 0 },
  { id: 5, question: "Решите уравнение: 3x + 2 = 2x + 7", options: ["x = 5", "x = 9", "x = 3", "x = -5"], correct: 0 },
  { id: 6, question: "Вычислите: (2 + 3) × 4", options: ["14", "20", "11", "24"], correct: 1 },
  { id: 7, question: "Решите уравнение: x/2 = 8", options: ["x = 4", "x = 16", "x = 10", "x = 6"], correct: 1 },
  { id: 8, question: "Найдите корень: √144", options: ["12", "14", "11", "13"], correct: 0 },
]

export default function MathLabPage() {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>(new Array(mathProblems.length).fill(false))
  const [isComplete, setIsComplete] = useState(false)

  const problem = mathProblems[currentProblem]
  const progress = ((currentProblem + (showResult ? 1 : 0)) / mathProblems.length) * 100

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    if (selectedAnswer === problem.correct) {
      setScore(score + 1)
    }
    const newAnswered = [...answered]
    newAnswered[currentProblem] = true
    setAnswered(newAnswered)
  }

  const nextProblem = () => {
    if (currentProblem < mathProblems.length - 1) {
      setCurrentProblem(currentProblem + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentProblem(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswered(new Array(mathProblems.length).fill(false))
    setIsComplete(false)
  }

  if (isComplete) {
    const percentage = Math.round((score / mathProblems.length) * 100)
    return (
      <div className="min-h-screen pb-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200"
              alt="Math Background"
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
                className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${percentage >= 70 ? "bg-green-500/20" : percentage >= 50 ? "bg-yellow-500/20" : "bg-red-500/20"
                  } backdrop-blur-sm`}
              >
                {percentage >= 70 ? <CheckCircle2 className="h-12 w-12" /> : <Calculator className="h-12 w-12" />}
              </motion.div>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Тест завершён!</h1>
              <p className="mb-8 text-lg opacity-90">
                Вы ответили правильно на {score} из {mathProblems.length} вопросов
              </p>
              <div className="mb-6 text-6xl font-bold">{percentage}%</div>
              <Badge className={`mb-8 px-6 py-2 text-lg ${percentage >= 70 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}>
                {percentage >= 70 ? "Отлично!" : percentage >= 50 ? "Хорошо" : "Нужно повторить"}
              </Badge>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button variant="outline" size="lg" className="gap-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" onClick={resetQuiz}>
                  <RotateCcw className="h-5 w-5" />
                  Пройти снова
                </Button>
                <Button size="lg" className="gap-2 bg-white text-purple-600 hover:bg-white/90" onClick={() => (window.location.href = "/dashboard/labs")}>
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
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200"
            alt="Math Background"
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
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-medium">Математическая лаборатория</span>
            </motion.div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Математика</h1>
            <p className="mb-6 text-lg opacity-90">Решите уравнения и задачи</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5" />
                <span>Вопрос {currentProblem + 1} / {mathProblems.length}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Award className="h-5 w-5" />
                <span>Правильных: {score}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mb-6 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
              <CardContent className="py-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс выполнения</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-2 border-purple-500/30 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <Calculator className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Задача {currentProblem + 1}</CardTitle>
                    <CardDescription>Выберите правильный ответ</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-8 text-2xl font-medium">{problem.question}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {problem.options.map((option, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                      <Button
                        variant="outline"
                        className={`h-auto w-full justify-start p-4 text-left transition-all ${selectedAnswer === index
                            ? showResult
                              ? index === problem.correct
                                ? "border-green-500 bg-green-500/10 text-green-600"
                                : "border-red-500 bg-red-500/10 text-red-600"
                              : "border-purple-500 bg-purple-500/10"
                            : showResult && index === problem.correct
                              ? "border-green-500 bg-green-500/10 text-green-600"
                              : "hover:border-purple-500/50 hover:bg-purple-500/5"
                          }`}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                      >
                        <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-current font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && index === problem.correct && <CheckCircle2 className="ml-2 h-6 w-6" />}
                        {showResult && selectedAnswer === index && index !== problem.correct && <XCircle className="ml-2 h-6 w-6" />}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  {!showResult ? (
                    <Button onClick={checkAnswer} disabled={selectedAnswer === null} size="lg" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Проверить ответ
                    </Button>
                  ) : (
                    <Button onClick={nextProblem} size="lg" className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      {currentProblem < mathProblems.length - 1 ? (
                        <>Следующий вопрос <ArrowRight className="h-5 w-5" /></>
                      ) : (
                        <>Завершить тест <CheckCircle2 className="h-5 w-5" /></>
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
