'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useStore, gameStore } from '@/lib/store'
import { DifficultySelect, VictoryScreen, GameHeader } from '@/components/shared'
import {
    ChessBoard,
    CapturedPieces,
    MoveHistory,
    GameStatus,
} from '@/components/shared/games/chess-components'
import {
    createInitialBoard,
    ChessLogic,
    makeAIMove,
    positionToNotation,
    type Piece,
    type PieceColor,
    type GameState,
} from '@/components/shared/games/chess-utils'
import type { Difficulty } from '@/lib/store'

type GameMode = 'pvp' | 'pve' | null

export default function ChessPage() {
    const difficulty = useStore(gameStore, (s) => s.difficulty)
    const score = useStore(gameStore, (s) => s.score)
    const time = useStore(gameStore, (s) => s.time)
    const bestScores = useStore(gameStore, (s) => s.bestScores)

    const [gameMode, setGameMode] = useState<GameMode>(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameState, setGameState] = useState<GameState>({
        board: createInitialBoard(),
        currentPlayer: 'white',
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        enPassantTarget: null,
        capturedPieces: { white: [], black: [] },
        moveHistory: [],
    })

    const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
    const [validMoves, setValidMoves] = useState<[number, number][]>([])
    const [isAiThinking, setIsAiThinking] = useState(false)

    // Timer
    useEffect(() => {
        if (gameStarted && !gameState.isCheckmate && !gameState.isStalemate) {
            const timer = setInterval(() => {
                gameStore.setState({ time: time + 1 })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [gameStarted, gameState.isCheckmate, gameState.isStalemate, time])

    // AI move
    useEffect(() => {
        if (
            gameMode === 'pve' &&
            gameState.currentPlayer === 'black' &&
            !gameState.isCheckmate &&
            !gameState.isStalemate &&
            !isAiThinking
        ) {
            setIsAiThinking(true)
            setTimeout(() => {
                const aiMove = makeAIMove(gameState.board, difficulty, gameState.enPassantTarget)
                if (aiMove) {
                    makeMove(aiMove.from[0], aiMove.from[1], aiMove.to[0], aiMove.to[1])
                }
                setIsAiThinking(false)
            }, 500)
        }
    }, [gameState.currentPlayer, gameMode, gameState.isCheckmate, gameState.isStalemate, isAiThinking])

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode)
    }

    const handleDifficultySelect = (diff: Difficulty) => {
        gameStore.setState({ difficulty: diff, score: 0, time: 0 })
        setGameStarted(true)
    }

    const handleReset = () => {
        setGameStarted(false)
        setGameMode(null)
        setGameState({
            board: createInitialBoard(),
            currentPlayer: 'white',
            isCheck: false,
            isCheckmate: false,
            isStalemate: false,
            enPassantTarget: null,
            capturedPieces: { white: [], black: [] },
            moveHistory: [],
        })
        setSelectedSquare(null)
        setValidMoves([])
        setIsAiThinking(false)
        gameStore.setState({ score: 0, time: 0 })
    }

    const handleSquareClick = (row: number, col: number) => {
        if (gameState.isCheckmate || gameState.isStalemate) return
        if (gameMode === 'pve' && gameState.currentPlayer === 'black') return

        const piece = gameState.board[row][col]

        // Select piece
        if (!selectedSquare) {
            if (piece.color === gameState.currentPlayer) {
                setSelectedSquare([row, col])
                const moves = ChessLogic.getValidMoves(gameState.board, row, col, gameState.enPassantTarget)
                setValidMoves(moves)
            }
            return
        }

        // Deselect
        if (selectedSquare[0] === row && selectedSquare[1] === col) {
            setSelectedSquare(null)
            setValidMoves([])
            return
        }

        // Move piece
        const isValid = validMoves.some(([r, c]) => r === row && c === col)
        if (isValid) {
            makeMove(selectedSquare[0], selectedSquare[1], row, col)
            setSelectedSquare(null)
            setValidMoves([])
        } else if (piece.color === gameState.currentPlayer) {
            setSelectedSquare([row, col])
            const moves = ChessLogic.getValidMoves(gameState.board, row, col, gameState.enPassantTarget)
            setValidMoves(moves)
        } else {
            setSelectedSquare(null)
            setValidMoves([])
        }
    }

    const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const newBoard = gameState.board.map((r) => r.map((p) => ({ ...p })))
        const piece = newBoard[fromRow][fromCol]
        const capturedPiece = newBoard[toRow][toCol]

        // Update captured pieces
        const newCapturedPieces = { ...gameState.capturedPieces }
        if (capturedPiece.type && capturedPiece.color) {
            newCapturedPieces[capturedPiece.color].push(capturedPiece.type)

            // Update score
            const captureScore = score + 10
            gameStore.setState({ score: captureScore })
        }

        // Handle castling
        if (piece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
            const isKingside = toCol > fromCol
            const rookFromCol = isKingside ? 7 : 0
            const rookToCol = isKingside ? toCol - 1 : toCol + 1
            newBoard[toRow][rookToCol] = { ...newBoard[toRow][rookFromCol], hasMoved: true }
            newBoard[toRow][rookFromCol] = { type: null, color: null }
        }

        // Handle en passant
        let newEnPassantTarget: [number, number] | null = null
        if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
            const enPassantRow = (fromRow + toRow) / 2
            newEnPassantTarget = [enPassantRow, fromCol]
        }

        if (
            piece.type === 'pawn' &&
            gameState.enPassantTarget &&
            toRow === gameState.enPassantTarget[0] &&
            toCol === gameState.enPassantTarget[1]
        ) {
            const captureRow = piece.color === 'white' ? toRow + 1 : toRow - 1
            const enPassantPiece = newBoard[captureRow][toCol]
            if (enPassantPiece.type && enPassantPiece.color) {
                newCapturedPieces[enPassantPiece.color].push(enPassantPiece.type)
            }
            newBoard[captureRow][toCol] = { type: null, color: null }
        }

        // Make the move
        newBoard[toRow][toCol] = { ...piece, hasMoved: true }
        newBoard[fromRow][fromCol] = { type: null, color: null }

        // Pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            newBoard[toRow][toCol] = { type: 'queen', color: piece.color, hasMoved: true }
        }

        // Move notation
        const from = positionToNotation(fromRow, fromCol)
        const to = positionToNotation(toRow, toCol)
        const moveNotation = capturedPiece.type ? `${from}x${to}` : `${from}-${to}`

        const nextPlayer: PieceColor = gameState.currentPlayer === 'white' ? 'black' : 'white'
        const isCheck = ChessLogic.isInCheck(newBoard, nextPlayer)
        const hasValidMoves = ChessLogic.hasAnyValidMoves(newBoard, nextPlayer, newEnPassantTarget)
        const isCheckmate = isCheck && !hasValidMoves
        const isStalemate = !isCheck && !hasValidMoves

        if (isCheckmate) {
            const finalScore = score + 100 + Math.floor(1000 / (time + 1))
            gameStore.setState({ score: finalScore })

            const currentBest = bestScores[difficulty] || 0
            if (finalScore > currentBest) {
                gameStore.setState({
                    bestScores: { ...bestScores, [difficulty]: finalScore },
                })
            }
        }

        setGameState({
            board: newBoard,
            currentPlayer: nextPlayer,
            isCheck,
            isCheckmate,
            isStalemate,
            enPassantTarget: newEnPassantTarget,
            capturedPieces: newCapturedPieces,
            moveHistory: [...gameState.moveHistory, moveNotation],
        })
    }

    // Mode selection
    if (!gameMode) {
        return (
            <div className="container max-w-4xl py-8">
                <Card className="p-8">
                    <h1 className="text-3xl font-bold text-center mb-8">Шахматы</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-32 text-xl"
                            onClick={() => handleModeSelect('pvp')}
                        >
                            <Users className="mr-2 h-8 w-8" />
                            Player vs Player
                        </Button>
                        <Button
                            variant="outline"
                            className="h-32 text-xl"
                            onClick={() => handleModeSelect('pve')}
                        >
                            <Cpu className="mr-2 h-8 w-8" />
                            Player vs AI
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // Difficulty selection for PvE
    if (gameMode === 'pve' && !gameStarted) {
        return (
            <div className="container max-w-7xl py-8">
                <DifficultySelect
                    title="Выберите сложность AI"
                    description="Easy: случайные ходы, Medium: хорошие ходы, Hard: лучшие ходы"
                    onSelect={handleDifficultySelect}
                />
            </div>
        )
    }

    // PvP starts immediately
    if (gameMode === 'pvp' && !gameStarted) {
        setGameStarted(true)
        gameStore.setState({ difficulty: 'medium', score: 0, time: 0 })
    }

    // Game over
    if (gameState.isCheckmate || gameState.isStalemate) {
        return (
            <VictoryScreen
                title={
                    gameState.isCheckmate
                        ? `${gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!`
                        : 'Draw - Stalemate'
                }
                message={`Time: ${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`}
                score={score}
                time={time}
                bestScore={bestScores[difficulty] || 0}
                onPlayAgain={handleReset}
            />
        )
    }

    return (
        <div className="container max-w-7xl py-8 space-y-6">
            <GameHeader title="Шахматы" onReset={handleReset} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Board */}
                <div className="lg:col-span-2">
                    <ChessBoard
                        board={gameState.board}
                        selectedSquare={selectedSquare}
                        validMoves={validMoves}
                        onSquareClick={handleSquareClick}
                        isCheck={gameState.isCheck}
                        currentPlayer={gameState.currentPlayer}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <GameStatus
                        currentPlayer={gameState.currentPlayer}
                        isCheck={gameState.isCheck}
                        isCheckmate={gameState.isCheckmate}
                        isStalemate={gameState.isStalemate}
                    />

                    {isAiThinking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center p-4 bg-muted rounded-lg"
                        >
                            <Cpu className="inline-block animate-pulse h-6 w-6 mb-2" />
                            <p>AI thinking...</p>
                        </motion.div>
                    )}

                    <CapturedPieces pieces={gameState.capturedPieces.white} color="white" />
                    <CapturedPieces pieces={gameState.capturedPieces.black} color="black" />
                    <MoveHistory moves={gameState.moveHistory} />
                </div>
            </div>
        </div>
    )
}
