"use client"

import { useState, useEffect, useCallback } from "react"
import { useStore, gameStore, type Difficulty } from "@/lib/store"
import {
    DifficultySelect,
    VictoryScreen,
    GameHeader,
    GameStats
} from "@/shared"
import { CheckersBoard, type CellType } from "@/shared/games/checkers-board"
import {
    createInitialBoard,
    isPlayerPiece,
    countPieces,
    getValidMoves,
    makeMove,
    getAIMove,
    calculateGameScore,
} from "@/shared/games/checkers-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cpu, Users } from "lucide-react"
import { motion } from "framer-motion"

type GameMode = "cpu" | "player" | null

export default function CheckersGamePage() {
    // Game store state
    const difficulty = useStore(gameStore, s => s.difficulty)
    const score = useStore(gameStore, s => s.score)
    const isPlaying = useStore(gameStore, s => s.isPlaying)
    const bestScores = useStore(gameStore, s => s.bestScores)
    const startGame = useStore(gameStore, s => s.startGame)
    const endGame = useStore(gameStore, s => s.endGame)
    const updateScore = useStore(gameStore, s => s.updateScore)
    const resetGame = useStore(gameStore, s => s.resetGame)

    // Local game state
    const [board, setBoard] = useState<CellType[][]>(createInitialBoard())
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
    const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
    const [gameMode, setGameMode] = useState<GameMode>(null)
    const [validMoves, setValidMoves] = useState<[number, number][]>([])
    const [moves, setMoves] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [whiteCount, setWhiteCount] = useState(12)
    const [blackCount, setBlackCount] = useState(12)

    // Update piece counts
    useEffect(() => {
        const counts = countPieces(board)
        setWhiteCount(counts.white)
        setBlackCount(counts.black)

        // Check game over
        if (counts.white === 0 || counts.black === 0) {
            handleGameComplete(counts.white > 0)
        }
    }, [board])

    // AI move
    useEffect(() => {
        if (
            !isPlaying ||
            gameComplete ||
            gameMode !== "cpu" ||
            currentPlayer !== "black"
        ) {
            return
        }

        const timer = setTimeout(() => {
            const aiMove = getAIMove(board, difficulty)
            if (aiMove) {
                const { newBoard } = makeMove(board, aiMove.from, aiMove.to)
                setBoard(newBoard)
                setCurrentPlayer("white")
                setMoves(m => m + 1)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [currentPlayer, board, gameMode, difficulty, isPlaying, gameComplete])

    const handleModeSelect = (mode: GameMode, diff: Difficulty) => {
        setGameMode(mode)
        startGame('checkers', diff)
        setBoard(createInitialBoard())
        setSelectedCell(null)
        setCurrentPlayer("white")
        setMoves(0)
        setGameComplete(false)
    }

    const handleCellClick = (row: number, col: number) => {
        if (!isPlaying || gameComplete || currentPlayer !== "white") return

        const cell = board[row][col]

        // Select piece
        if (selectedCell === null) {
            if (isPlayerPiece(cell, "white")) {
                setSelectedCell([row, col])
                setValidMoves(getValidMoves(board, row, col))
            }
            return
        }

        // Move to valid position
        const isValid = validMoves.some(([r, c]) => r === row && c === col)
        if (isValid) {
            const { newBoard, captured } = makeMove(board, selectedCell, [row, col])
            setBoard(newBoard)
            setSelectedCell(null)
            setValidMoves([])
            setMoves(m => m + 1)

            // Add score for capture
            if (captured) {
                const newScore = score + 100
                updateScore(newScore)
            }

            setCurrentPlayer("black")
        } else {
            // Reselect
            if (isPlayerPiece(cell, "white")) {
                setSelectedCell([row, col])
                setValidMoves(getValidMoves(board, row, col))
            } else {
                setSelectedCell(null)
                setValidMoves([])
            }
        }
    }

    const handleGameComplete = (playerWon: boolean) => {
        if (gameComplete) return
        setGameComplete(true)

        const finalScore = playerWon
            ? calculateGameScore(whiteCount, blackCount, moves, difficulty)
            : 0

        updateScore(finalScore)
        endGame(finalScore)
    }

    const handleReset = () => {
        resetGame()
        setBoard(createInitialBoard())
        setSelectedCell(null)
        setCurrentPlayer("white")
        setGameMode(null)
        setValidMoves([])
        setMoves(0)
        setGameComplete(false)
    }

    const handleRestart = () => {
        setGameComplete(false)
        setBoard(createInitialBoard())
        setSelectedCell(null)
        setCurrentPlayer("white")
        setValidMoves([])
        setMoves(0)
        startGame('checkers', difficulty)
    }

    const bestScore = bestScores.checkers[difficulty]

    // Show mode selection
    if (!isPlaying && !gameMode) {
        return (
            <div className="px-4 py-6 md:px-8 md:py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center min-h-[60vh]"
                >
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <h2 className="text-3xl font-bold text-center mb-6">Шашки</h2>
                            <p className="text-center text-muted-foreground mb-6">
                                Выберите режим игры
                            </p>
                            <div className="grid gap-4">
                                <Button
                                    variant="outline"
                                    className="h-24 flex-col gap-2"
                                    onClick={() => {
                                        setGameMode("cpu")
                                    }}
                                >
                                    <Cpu className="h-8 w-8" />
                                    <span className="font-bold">Против компьютера</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-24 flex-col gap-2"
                                    onClick={() => {
                                        setGameMode("player")
                                    }}
                                >
                                    <Users className="h-8 w-8" />
                                    <span className="font-bold">Для двоих</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    // Show difficulty selection
    if (gameMode && !isPlaying) {
        return (
            <div className="px-4 py-6 md:px-8 md:py-8">
                <DifficultySelect
                    title={gameMode === "cpu" ? "Выберите сложность" : "Готовы играть?"}
                    description={gameMode === "cpu" ? "Насколько силен соперник?" : "Начните партию"}
                    onSelect={(diff) => handleModeSelect(gameMode, diff)}
                />
            </div>
        )
    }

    return (
        <div className="px-4 py-6 md:px-8 md:py-8">
            <GameHeader title="Шашки" onReset={handleReset} />

            <div className="flex flex-wrap gap-4 mb-6">
                <GameStats
                    score={score}
                    bestScore={bestScore}
                    difficulty={difficulty}
                    moves={moves}
                />

                <Card className="border-primary/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Белые</p>
                                <p className="text-lg font-bold">{whiteCount}</p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <p className="text-xs text-muted-foreground">Чёрные</p>
                                <p className="text-lg font-bold">{blackCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/20">
                    <CardContent className="p-3 flex items-center">
                        <Badge variant={currentPlayer === "white" ? "default" : "secondary"}>
                            Ход: {currentPlayer === "white" ? "Белые" : "Чёрные"}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <CheckersBoard
                board={board}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
                validMoves={validMoves}
            />

            {gameComplete && (
                <VictoryScreen
                    score={score}
                    bestScore={bestScore}
                    isNewRecord={score > bestScore}
                    difficulty={difficulty}
                    onRestart={handleRestart}
                    message={whiteCount > 0 ? "Победа!" : "Поражение"}
                    stats={[
                        { label: 'Ходов', value: moves },
                        { label: 'Белых осталось', value: whiteCount },
                        { label: 'Чёрных осталось', value: blackCount },
                    ]}
                />
            )}
        </div>
    )
}
