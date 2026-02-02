"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Users, Percent, RotateCcw, Trophy, Star, Brain, Zap, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { saveGameScore, getBestScore, calculateScore } from "@/lib/scoring"

type Difficulty = "easy" | "medium" | "hard"

const questionsData = {
  easy: [
    {
      question: "Сколько планет в Солнечной системе?",
      options: ["7", "8", "9", "10"],
      correct: 1,
      prize: 500,
    },
    {
      question: "Кто написал 'Евгений Онегин'?",
      options: ["Лермонтов", "Пушкин", "Гоголь", "Толстой"],
      correct: 1,
      prize: 1000,
    },
    {
      question: "Какой химический элемент обозначается как 'Fe'?",
      options: ["Фтор", "Железо", "Фосфор", "Франций"],
      correct: 1,
      prize: 2000,
    },
    {
      question: "Какой город является столицей России?",
      options: ["Санкт-Петербург", "Москва", "Казань", "Новосибирск"],
      correct: 1,
      prize: 5000,
    },
    {
      question: "Сколько дней в году?",
      options: ["365", "366", "364", "360"],
      correct: 0,
      prize: 10000,
    },
  ],
  medium: [
    {
      question: "Какой город является столицей Австралии?",
      options: ["Сидней", "Мельбурн", "Канберра", "Перт"],
      correct: 2,
      prize: 500,
    },
    {
      question: "В каком году началась Первая мировая война?",
      options: ["1912", "1914", "1916", "1918"],
      correct: 1,
      prize: 1000,
    },
    {
      question: "Какая река самая длинная в мире?",
      options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"],
      correct: 1,
      prize: 2000,
    },
    {
      question: "Сколько костей в теле взрослого человека?",
      options: ["186", "206", "226", "246"],
      correct: 1,
      prize: 5000,
    },
    {
      question: "Кто изобрёл телефон?",
      options: ["Эдисон", "Тесла", "Белл", "Маркони"],
      correct: 2,
      prize: 10000,
    },
    {
      question: "В каком году был основан Google?",
      options: ["1996", "1998", "2000", "2002"],
      correct: 1,
      prize: 25000,
    },
    {
      question: "Какое озеро самое глубокое в мире?",
      options: ["Байкал", "Танганьика", "Виктория", "Мичиган"],
      correct: 0,
      prize: 50000,
    },
    {
      question: "Какая планета самая большая в Солнечной системе?",
      options: ["Юпитер", "Сатурн", "Уран", "Нептун"],
      correct: 0,
      prize: 100000,
    },
  ],
  hard: [
    {
      question: "Кто открыл закон всемирного тяготения?",
      options: ["Галилей", "Ньютон", "Кеплер", "Коперник"],
      correct: 1,
      prize: 500,
    },
    {
      question: "В каком году был подписан Версальский мирный договор?",
      options: ["1918", "1919", "1920", "1921"],
      correct: 1,
      prize: 1000,
    },
    {
      question: "Какой элемент имеет атомный номер 79?",
      options: ["Серебро", "Платина", "Золото", "Ртуть"],
      correct: 2,
      prize: 2000,
    },
    {
      question: "Кто написал 'Божественную комедию'?",
      options: ["Петрарка", "Боккаччо", "Данте", "Ариосто"],
      correct: 2,
      prize: 5000,
    },
    {
      question: "В каком году Юрий Гагарин совершил первый полёт в космос?",
      options: ["1959", "1961", "1963", "1965"],
      correct: 1,
      prize: 10000,
    },
    {
      question: "Какая скорость света в вакууме (км/с)?",
      options: ["299792", "300000", "301000", "298000"],
      correct: 0,
      prize: 25000,
    },
    {
      question: "Кто является автором теории относительности?",
      options: ["Планк", "Бор", "Эйнштейн", "Хокинг"],
      correct: 2,
      prize: 50000,
    },
    {
      question: "Сколько хромосом в клетке человека?",
      options: ["44", "46", "48", "50"],
      correct: 1,
      prize: 100000,
    },
    {
      question: "В каком году пала Римская империя?",
      options: ["410", "455", "476", "493"],
      correct: 2,
      prize: 250000,
    },
    {
      question: "Какая постоянная Планка (h)?",
      options: ["6.626×10⁻³⁴", "6.674×10⁻³⁴", "6.022×10²³", "3.141"],
      correct: 0,
      prize: 500000,
    },
    {
      question: "Кто доказал последнюю теорему Ферма?",
      options: ["Гаусс", "Эйлер", "Уайлс", "Перельман"],
      correct: 2,
      prize: 1000000,
    },
  ],
}

export default function MillionairePage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [questions, setQuestions] = useState<typeof questionsData.easy>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [totalPrize, setTotalPrize] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [hints, setHints] = useState({
    fiftyFifty: true,
    phone: true,
    audience: true,
  })
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([])

  const question = questions[currentQuestion]

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff)
    setQuestions(questionsData[diff])
    setBestScore(getBestScore("Миллионер", diff))
  }

  const handleAnswer = (index: number) => {
    if (showResult || hiddenOptions.includes(index)) return
    setSelectedAnswer(index)
  }

  const confirmAnswer = () => {
    if (selectedAnswer === null) return
    setShowResult(true)

    if (selectedAnswer === question.correct) {
      setTotalPrize(question.prize)
      if (currentQuestion === questions.length - 1) {
        // Победа! Рассчитываем баллы
        const score = Math.floor(question.prize * calculateScore(1, difficulty!))
        saveGameScore("Миллионер", score, difficulty!)
        setGameOver(true)
        setWon(true)
        setShowScoreAnimation(true)
      }
    } else {
      setGameOver(true)
      setWon(false)
    }
  }

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1)
    setSelectedAnswer(null)
    setShowResult(false)
    setHiddenOptions([])
  }

  const useFiftyFifty = () => {
    if (!hints.fiftyFifty) return
    setHints({ ...hints, fiftyFifty: false })

    const wrongAnswers = [0, 1, 2, 3].filter((i) => i !== question.correct)
    const toHide = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2)
    setHiddenOptions(toHide)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameOver(false)
    setWon(false)
    setTotalPrize(0)
    setHints({ fiftyFifty: true, phone: true, audience: true })
    setHiddenOptions([])
    setShowScoreAnimation(false)
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
                  <p className="text-sm text-muted-foreground">5 простых вопросов. До 10,000₽</p>
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
                  <p className="text-sm text-muted-foreground">8 вопросов средней сложности. До 100,000₽</p>
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
                  <p className="text-sm text-muted-foreground">11 сложных вопросов. До 1,000,000₽</p>
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

  // Экран победы с анимированными баллами
  if (showScoreAnimation) {
    const finalScore = Math.floor(totalPrize * calculateScore(1, difficulty))

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
                  Вы ответили на все вопросы на уровне "{difficulty === "easy" ? "Лёгкий" : difficulty === "medium" ? "Средний" : "Сложный"}"!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-2"
                >
                  <div className="text-3xl font-bold text-warning">{totalPrize.toLocaleString()} ₽</div>
                  <div className="text-sm text-muted-foreground">выигрыш</div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="mb-2"
                >
                  <div className="text-5xl font-bold text-primary">{finalScore}</div>
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

  if (gameOver) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <Card className="mx-auto max-w-lg border-border/50">
          <CardContent className="pt-8 text-center">
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-4xl ${won ? "bg-warning/10" : "bg-destructive/10"
                }`}
            >
              {won ? "🎉" : "😔"}
            </div>
            <h2 className="mb-2 text-2xl font-bold">{won ? "Поздравляем!" : "Игра окончена"}</h2>
            <p className="mb-4 text-muted-foreground">
              {won ? "Вы ответили на все вопросы!" : "К сожалению, вы ошиблись"}
            </p>
            <div className="mb-6 text-4xl font-bold text-warning">{totalPrize.toLocaleString()} ₽</div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={resetGame}>
                <RotateCcw className="h-4 w-4" />
                Играть снова
              </Button>
              <Button className="flex-1" onClick={() => router.push("/dashboard/games")}>
                К играм
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Кто хочет стать миллионером</h1>
            <p className="text-sm text-muted-foreground">
              Вопрос {currentQuestion + 1} из {questions.length}
            </p>
          </div>
        </div>
        <Badge className="bg-warning text-warning-foreground text-lg">{question.prize.toLocaleString()} ₽</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6 border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="py-8">
              <p className="text-center text-xl font-medium md:text-2xl">{question.question}</p>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-auto justify-start bg-transparent p-4 text-left text-base ${hiddenOptions.includes(index)
                  ? "invisible"
                  : selectedAnswer === index
                    ? showResult
                      ? index === question.correct
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-primary bg-primary/10"
                    : showResult && index === question.correct
                      ? "border-success bg-success/10 text-success"
                      : ""
                  }`}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
              >
                <span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-current font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))}
          </div>

          <div className="mt-6">
            {!showResult ? (
              <Button onClick={confirmAnswer} disabled={selectedAnswer === null} className="w-full" size="lg">
                Ответить
              </Button>
            ) : selectedAnswer === question.correct ? (
              <Button onClick={nextQuestion} className="w-full" size="lg">
                Следующий вопрос
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="py-4">
              <h3 className="mb-3 font-semibold">Подсказки</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className={`flex-col gap-1 py-3 bg-transparent ${!hints.fiftyFifty ? "opacity-50" : ""}`}
                  onClick={useFiftyFifty}
                  disabled={!hints.fiftyFifty || showResult}
                >
                  <Percent className="h-5 w-5" />
                  <span className="text-xs">50:50</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex-col gap-1 py-3 bg-transparent ${!hints.phone ? "opacity-50" : ""}`}
                  disabled={!hints.phone || showResult}
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Звонок</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex-col gap-1 py-3 bg-transparent ${!hints.audience ? "opacity-50" : ""}`}
                  disabled={!hints.audience || showResult}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Зал</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="py-4">
              <h3 className="mb-3 font-semibold">Призовая лестница</h3>
              <div className="space-y-1">
                {questions
                  .map((q, i) => (
                    <div
                      key={i}
                      className={`rounded px-3 py-1.5 text-sm ${i === currentQuestion
                        ? "bg-primary text-primary-foreground"
                        : i < currentQuestion
                          ? "bg-success/10 text-success"
                          : "text-muted-foreground"
                        }`}
                    >
                      {i + 1}. {q.prize.toLocaleString()} ₽
                    </div>
                  ))
                  .reverse()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
