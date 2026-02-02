"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Flag, Cpu, Users, Brain, Zap, Flame, Trophy, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { saveGameScore, getBestScore, calculateScore } from "@/lib/scoring"

type CellType = "empty" | "white" | "black" | "white-king" | "black-king"
type Difficulty = "easy" | "medium" | "hard"

const createInitialBoard = (): CellType[][] => {
  const board: CellType[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill("empty"))

  // Black pieces (top)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = "black"
      }
    }
  }

  // White pieces (bottom)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = "white"
      }
    }
  }

  return board
}

export default function CheckersPage() {
  const router = useRouter()
  const [board, setBoard] = useState<CellType[][]>(createInitialBoard())
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [gameMode, setGameMode] = useState<"cpu" | "player" | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [whiteCount, setWhiteCount] = useState(12)
  const [blackCount, setBlackCount] = useState(12)
  const [totalScore, setTotalScore] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [moves, setMoves] = useState(0)

  const isPlayerPiece = (cell: CellType, player: "white" | "black") => {
    if (player === "white") return cell === "white" || cell === "white-king"
    return cell === "black" || cell === "black-king"
  }

  // AI Logic для разных уровней сложности
  const getAIMove = useCallback((board: CellType[][], difficulty: Difficulty) => {
    const possibleMoves: Array<{ from: [number, number], to: [number, number], score: number, isCapture: boolean }> = []

    // Найти все возможные ходы для чёрных
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (!isPlayerPiece(board[row][col], "black")) continue

        const isKing = board[row][col].includes("king")
        const directions = isKing ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : [[1, -1], [1, 1]]

        // Проверка обычных ходов
        for (const [dr, dc] of directions) {
          const newRow = row + dr
          const newCol = col + dc
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && board[newRow][newCol] === "empty") {
            possibleMoves.push({ from: [row, col], to: [newRow, newCol], score: 1, isCapture: false })
          }
        }

        // Проверка взятий
        for (const [dr, dc] of directions) {
          const midRow = row + dr
          const midCol = col + dc
          const newRow = row + dr * 2
          const newCol = col + dc * 2

          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 &&
            board[newRow][newCol] === "empty" &&
            isPlayerPiece(board[midRow][midCol], "white")) {
            possibleMoves.push({ from: [row, col], to: [newRow, newCol], score: 10, isCapture: true })
          }
        }
      }
    }

    if (possibleMoves.length === 0) return null

    // Сортировка по приоритету в зависимости от сложности
    if (difficulty === "easy") {
      // Легко: случайный ход
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    } else if (difficulty === "medium") {
      // Средне: предпочитать взятия
      const captures = possibleMoves.filter(m => m.isCapture)
      const moves = captures.length > 0 ? captures : possibleMoves
      return moves[Math.floor(Math.random() * moves.length)]
    } else {
      // Сложно: выбирать лучший ход
      const captures = possibleMoves.filter(m => m.isCapture)
      if (captures.length > 0) {
        return captures[Math.floor(Math.random() * captures.length)]
      }
      // Предпочитать ходы к дамке
      const sortedMoves = possibleMoves.sort((a, b) => {
        const aToKing = 7 - a.to[0]
        const bToKing = 7 - b.to[0]
        return aToKing - bToKing
      })
      return sortedMoves[0]
    }
  }, [])

  const makeAIMove = useCallback(() => {
    if (!difficulty) return

    const aiMove = getAIMove(board, difficulty)
    if (!aiMove) return

    const newBoard = board.map(r => [...r])
    const [fromRow, fromCol] = aiMove.from
    const [toRow, toCol] = aiMove.to
    const piece = newBoard[fromRow][fromCol]

    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = "empty"

    // Проверка взятия
    if (aiMove.isCapture) {
      const midRow = (fromRow + toRow) / 2
      const midCol = (fromCol + toCol) / 2
      newBoard[midRow][midCol] = "empty"
      setWhiteCount(prev => prev - 1)
    }

    // Превращение в дамку
    if (toRow === 7 && !piece.includes("king")) {
      newBoard[toRow][toCol] = "black-king"
    }

    setBoard(newBoard)
    setMoves(prev => prev + 1)
    setCurrentPlayer("white")

    // Проверка победы
    if (whiteCount <= 1) {
      setTimeout(() => {
        alert("Компьютер победил!")
        setGameMode(null)
      }, 500)
    }
  }, [board, difficulty, whiteCount, getAIMove])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameMode || currentPlayer === "black") return

      const cell = board[row][col]

      if (selectedCell) {
        const [selectedRow, selectedCol] = selectedCell
        const selectedPiece = board[selectedRow][selectedCol]

        // Check if it's a valid move
        if (isPlayerPiece(selectedPiece, currentPlayer)) {
          const rowDiff = row - selectedRow
          const colDiff = Math.abs(col - selectedCol)

          // Simple move (diagonal, one step)
          const validDirection = currentPlayer === "white" ? rowDiff < 0 : rowDiff > 0
          const isKing = selectedPiece.includes("king")

          if (cell === "empty" && colDiff === 1 && Math.abs(rowDiff) === 1 && (validDirection || isKing)) {
            const newBoard = board.map((r) => [...r])
            newBoard[row][col] = selectedPiece
            newBoard[selectedRow][selectedCol] = "empty"

            // King promotion
            if ((currentPlayer === "white" && row === 0) || (currentPlayer === "black" && row === 7)) {
              newBoard[row][col] = `${currentPlayer}-king` as CellType
            }

            setBoard(newBoard)
            setMoves(prev => prev + 1)
            setCurrentPlayer(currentPlayer === "white" ? "black" : "white")

            // AI ход после хода игрока
            if (gameMode === "cpu" && difficulty) {
              setTimeout(() => makeAIMove(), 500)
            }
          }

          // Jump (capture)
          if (cell === "empty" && colDiff === 2 && Math.abs(rowDiff) === 2 && (validDirection || isKing)) {
            const midRow = selectedRow + rowDiff / 2
            const midCol = selectedCol + (col - selectedCol) / 2
            const midPiece = board[midRow][midCol]

            if (isPlayerPiece(midPiece, currentPlayer === "white" ? "black" : "white")) {
              const newBoard = board.map((r) => [...r])
              newBoard[row][col] = selectedPiece
              newBoard[selectedRow][selectedCol] = "empty"
              newBoard[midRow][midCol] = "empty"

              // King promotion
              if ((currentPlayer === "white" && row === 0) || (currentPlayer === "black" && row === 7)) {
                newBoard[row][col] = `${currentPlayer}-king` as CellType
              }

              setBoard(newBoard)
              setMoves(prev => prev + 1)
              if (currentPlayer === "white") {
                setBlackCount(blackCount - 1)

                // Проверка победы
                if (blackCount <= 1) {
                  const baseScore = 200
                  const movesBonus = Math.max(0, 50 - moves) * 2
                  const score = Math.floor((baseScore + movesBonus) * calculateScore(1, difficulty!))
                  setTotalScore(score)
                  saveGameScore("Шашки", score, difficulty)
                  setShowScoreAnimation(true)
                  return
                }
              } else {
                setWhiteCount(whiteCount - 1)
              }
              setCurrentPlayer(currentPlayer === "white" ? "black" : "white")

              // AI ход после хода игрока
              if (gameMode === "cpu" && difficulty) {
                setTimeout(() => makeAIMove(), 500)
              }
            }
          }
        }
        setSelectedCell(null)
      } else if (isPlayerPiece(cell, currentPlayer)) {
        setSelectedCell([row, col])
      }
    },
    [board, selectedCell, currentPlayer, gameMode, blackCount, whiteCount, difficulty, moves, makeAIMove],
  )

  const resetGame = () => {
    setBoard(createInitialBoard())
    setSelectedCell(null)
    setCurrentPlayer("white")
    setWhiteCount(12)
    setBlackCount(12)
    setMoves(0)
    setTotalScore(0)
    setShowScoreAnimation(false)
  }

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff)
    setBestScore(getBestScore("Шашки", diff))
  }

  const renderPiece = (cell: CellType) => {
    if (cell === "empty") return null
    const isKing = cell.includes("king")
    const isWhite = cell.includes("white")
    return (
      <div
        className={`flex h-[80%] w-[80%] items-center justify-center rounded-full border-2 ${isWhite ? "border-gray-300 bg-gray-100" : "border-gray-800 bg-gray-900"
          } ${isKing ? "ring-2 ring-warning" : ""}`}
      >
        {isKing && <span className="text-warning">♔</span>}
      </div>
    )
  }

  // Экран победы с баллами
  if (showScoreAnimation) {
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
                  Вы победили на уровне "{difficulty === "easy" ? "Лёгкий" : difficulty === "medium" ? "Средний" : "Сложный"}"
                </motion.p>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mb-2"
                >
                  <div className="text-5xl font-bold text-warning">{totalScore}</div>
                  <div className="text-sm text-muted-foreground">баллов заработано</div>
                </motion.div>

                {bestScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6 text-sm text-muted-foreground"
                  >
                    Лучший результат: {bestScore} баллов
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
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
                      setGameMode(null)
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

  if (!gameMode) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Шашки</h1>
        </div>

        <div className="mx-auto max-w-md space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="cursor-pointer border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
              onClick={() => setGameMode("cpu")}
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Cpu className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Играть с компьютером</h3>
                  <p className="text-sm text-muted-foreground">Тренировка против ИИ с баллами</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              className="cursor-pointer border-border/50 transition-all hover:border-accent/50 hover:shadow-lg"
              onClick={() => {
                setGameMode("player")
                setDifficulty(null)
              }}
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <Users className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Играть вдвоём</h3>
                  <p className="text-sm text-muted-foreground">Играйте с другом за одним экраном</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (gameMode === "cpu" && !difficulty) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setGameMode(null)}>
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
                  <p className="text-sm text-muted-foreground">Для начинающих. ИИ делает случайные ходы.</p>
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
                  <p className="text-sm text-muted-foreground">Для любителей. ИИ предпочитает взятия.</p>
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
                  <p className="text-sm text-muted-foreground">Для опытных. ИИ играет стратегически.</p>
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

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setGameMode(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Шашки</h1>
            <p className="text-sm text-muted-foreground">{gameMode === "cpu" ? "Игра с компьютером" : "Игра вдвоём"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">Белые: {whiteCount}</Badge>
          <Badge variant="secondary">Чёрные: {blackCount}</Badge>
          <Badge variant={currentPlayer === "white" ? "default" : "secondary"}>
            Ход: {currentPlayer === "white" ? "Белые" : "Чёрные"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="mx-auto aspect-square max-w-[500px]">
                <div className="grid h-full w-full grid-cols-8 overflow-hidden rounded-lg border-2 border-border">
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isDark = (rowIndex + colIndex) % 2 === 1
                      const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                      return (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          className={`flex aspect-square items-center justify-center transition-colors ${isDark ? "bg-amber-800 dark:bg-amber-950" : "bg-amber-100 dark:bg-amber-900/30"
                            } ${isSelected ? "ring-2 ring-inset ring-primary" : ""} hover:opacity-80`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          disabled={!isDark && cell === "empty"}
                        >
                          {renderPiece(cell)}
                        </button>
                      )
                    }),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Управление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={resetGame}>
                <RotateCcw className="h-4 w-4" />
                Новая игра
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent text-destructive hover:text-destructive"
                onClick={() => setGameMode(null)}
              >
                <Flag className="h-4 w-4" />
                Сдаться
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Правила</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-inside list-disc space-y-1">
                <li>Шашки ходят по диагонали</li>
                <li>Белые ходят вверх, чёрные - вниз</li>
                <li>Бить обязательно</li>
                <li>Дамка ходит в любом направлении</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
