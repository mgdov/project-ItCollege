"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Code2, Play, CheckCircle2, XCircle, Lightbulb, Terminal } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

const codingTasks = [
    {
        id: 1,
        title: "Hello World",
        description: "Напишите программу, которая выводит 'Hello, World!'",
        difficulty: "Легко",
        difficultyColor: "bg-green-500",
        language: "python",
        expectedOutput: "Hello, World!",
        hint: "Используйте функцию print()",
    },
    {
        id: 2,
        title: "Сумма чисел",
        description: "Напишите функцию, которая возвращает сумму двух чисел",
        difficulty: "Легко",
        difficultyColor: "bg-green-500",
        language: "python",
        expectedOutput: "15",
        hint: "def sum(a, b): return a + b",
    },
    {
        id: 3,
        title: "Четное или нечетное",
        description: "Определите, является ли число четным или нечетным",
        difficulty: "Средне",
        difficultyColor: "bg-yellow-500",
        language: "python",
        expectedOutput: "Even",
        hint: "Используйте оператор %",
    },
]

export default function ProgrammingLabPage() {
    const [selectedTask, setSelectedTask] = useState(codingTasks[0])
    const [code, setCode] = useState("")
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [testPassed, setTestPassed] = useState<boolean | null>(null)

    const runCode = () => {
        setIsRunning(true)
        setTimeout(() => {
            // Симуляция выполнения кода
            const mockOutput = "Hello, World!" // В реальности здесь был бы API запрос
            setOutput(mockOutput)
            setTestPassed(mockOutput.trim() === selectedTask.expectedOutput)
            setIsRunning(false)
        }, 1000)
    }

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200"
                        alt="Programming Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative px-4 py-16 md:px-8 md:py-20"
                >
                    <div className="mx-auto max-w-4xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
                        >
                            <Code2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Лаборатория программирования</span>
                        </motion.div>
                        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Программирование</h1>
                        <p className="mb-8 text-lg opacity-90 md:text-xl">
                            Онлайн-компилятор для написания и тестирования кода
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <Terminal className="h-5 w-5" />
                                <div>
                                    <div className="text-sm opacity-80">Язык</div>
                                    <div className="font-bold">Python 3.x</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5" />
                                <div>
                                    <div className="text-sm opacity-80">Задач</div>
                                    <div className="font-bold">{codingTasks.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-12 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
                        {/* Tasks List */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="mb-4 text-xl font-bold">Задания</h2>
                            <div className="space-y-3">
                                {codingTasks.map((task, index) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                        <Card
                                            className={`cursor-pointer transition-all hover:shadow-lg ${selectedTask.id === task.id ? 'border-blue-500 bg-blue-500/5' : 'border-border/50'
                                                }`}
                                            onClick={() => setSelectedTask(task)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <Badge className={`${task.difficultyColor} text-white`}>
                                                        {task.difficulty}
                                                    </Badge>
                                                    <Code2 className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <h3 className="font-semibold">{task.title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-6"
                            >
                                <Link href="/dashboard/labs">
                                    <Button variant="outline" className="w-full">
                                        ← Вернуться к лабораторным
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Code Editor */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-6"
                        >
                            {/* Task Description */}
                            <Card className="border-2 border-blue-500/30">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">{selectedTask.title}</CardTitle>
                                            <CardDescription className="mt-2 text-base">{selectedTask.description}</CardDescription>
                                        </div>
                                        <Badge className={`${selectedTask.difficultyColor} text-white`}>
                                            {selectedTask.difficulty}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg bg-blue-500/5 p-4">
                                        <div className="flex items-start gap-2">
                                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                                            <div>
                                                <div className="font-semibold">Подсказка:</div>
                                                <div className="text-sm text-muted-foreground">{selectedTask.hint}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Code Editor */}
                            <Card className="border-2 border-blue-500/30">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Terminal className="h-5 w-5" />
                                        Редактор кода
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="# Напишите ваш код здесь..."
                                        className="font-mono min-h-[300px] bg-gray-950 text-gray-100 border-gray-800"
                                    />
                                    <Button
                                        onClick={runCode}
                                        disabled={isRunning || !code}
                                        className="mt-4 w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                        size="lg"
                                    >
                                        <Play className="h-5 w-5" />
                                        {isRunning ? "Выполнение..." : "Запустить код"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Output */}
                            {output && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className={`border-2 ${testPassed
                                        ? 'border-green-500/50 bg-green-500/5'
                                        : testPassed === false
                                            ? 'border-red-500/50 bg-red-500/5'
                                            : 'border-border'
                                        }`}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                {testPassed ? (
                                                    <><CheckCircle2 className="h-5 w-5 text-green-500" /> Тест пройден!</>
                                                ) : testPassed === false ? (
                                                    <><XCircle className="h-5 w-5 text-red-500" /> Тест не пройден</>
                                                ) : (
                                                    <>Вывод</>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="rounded-lg bg-gray-950 p-4 font-mono text-sm text-gray-100">
                                                {output}
                                            </div>
                                            {testPassed === false && (
                                                <div className="mt-4 rounded-lg bg-yellow-500/10 p-4 text-sm">
                                                    <div className="font-semibold">Ожидаемый вывод:</div>
                                                    <div className="mt-1 font-mono">{selectedTask.expectedOutput}</div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
