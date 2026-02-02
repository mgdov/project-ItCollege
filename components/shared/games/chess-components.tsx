'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scroll } from 'lucide-react'
import type { Piece, PieceType, PieceColor } from './chess-utils'
import { pieceSymbols } from './chess-utils'

interface ChessBoardProps {
    board: Piece[][]
    selectedSquare: [number, number] | null
    validMoves: [number, number][]
    onSquareClick: (row: number, col: number) => void
    isCheck: boolean
    currentPlayer: PieceColor
}

export function ChessBoard({
    board,
    selectedSquare,
    validMoves,
    onSquareClick,
    isCheck,
    currentPlayer,
}: ChessBoardProps) {
    const isValidMove = (row: number, col: number) =>
        validMoves.some(([r, c]) => r === row && c === col)

    const isKingInCheck = (row: number, col: number) => {
        const piece = board[row][col]
        return isCheck && piece.type === 'king' && piece.color === currentPlayer
    }

    return (
        <div className="grid grid-cols-8 gap-0 border-4 border-muted rounded-lg overflow-hidden shadow-xl">
            {board.map((row, r) =>
                row.map((piece, c) => {
                    const isLight = (r + c) % 2 === 0
                    const isSelected = selectedSquare?.[0] === r && selectedSquare?.[1] === c
                    const canMove = isValidMove(r, c)
                    const inCheck = isKingInCheck(r, c)

                    return (
                        <motion.button
                            key={`${r}-${c}`}
                            onClick={() => onSquareClick(r, c)}
                            className={`
                aspect-square flex items-center justify-center text-4xl md:text-5xl
                transition-colors relative
                ${isLight ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-amber-800 dark:bg-amber-950'}
                ${isSelected ? 'ring-4 ring-blue-500' : ''}
                ${canMove ? 'ring-2 ring-green-500' : ''}
                ${inCheck ? 'bg-red-500 animate-pulse' : ''}
                hover:brightness-110
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {piece.type && piece.color && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={piece.color === 'white' ? 'drop-shadow-lg' : 'text-gray-900 drop-shadow-sm'}
                                >
                                    {pieceSymbols[`${piece.type}-${piece.color}`]}
                                </motion.span>
                            )}

                            {canMove && !piece.type && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                            )}

                            {canMove && piece.type && (
                                <div className="absolute inset-0 border-4 border-green-500/50 pointer-events-none" />
                            )}

                            <div className="absolute top-1 left-1 text-xs opacity-30 font-mono">
                                {String.fromCharCode(97 + c)}
                                {8 - r}
                            </div>
                        </motion.button>
                    )
                })
            )}
        </div>
    )
}

interface CapturedPiecesProps {
    pieces: PieceType[]
    color: PieceColor
}

export function CapturedPieces({ pieces, color }: CapturedPiecesProps) {
    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-2">
                Captured {color === 'white' ? 'White' : 'Black'} Pieces
            </h3>
            <div className="flex flex-wrap gap-1">
                {pieces.map((piece, index) =>
                    piece ? (
                        <span key={index} className="text-2xl">
                            {pieceSymbols[`${piece}-${color}`]}
                        </span>
                    ) : null
                )}
                {pieces.length === 0 && <span className="text-sm text-muted-foreground">None</span>}
            </div>
        </Card>
    )
}

interface MoveHistoryProps {
    moves: string[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
                <Scroll className="mr-2 h-4 w-4" />
                Move History
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1">
                {moves.length === 0 && <p className="text-sm text-muted-foreground">No moves yet</p>}
                {moves.map((move, index) => (
                    <div key={index} className="text-sm flex gap-2">
                        <span className="text-muted-foreground w-8">{Math.floor(index / 2) + 1}.</span>
                        <span className={index % 2 === 0 ? 'font-semibold' : ''}>{move}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

interface GameStatusProps {
    currentPlayer: PieceColor
    isCheck: boolean
    isCheckmate: boolean
    isStalemate: boolean
}

export function GameStatus({ currentPlayer, isCheck, isCheckmate, isStalemate }: GameStatusProps) {
    return (
        <Card className="p-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Turn:</span>
                    <Badge variant={currentPlayer === 'white' ? 'default' : 'secondary'}>
                        {currentPlayer === 'white' ? '♔ White' : '♚ Black'}
                    </Badge>
                </div>

                {isCheck && !isCheckmate && (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold text-red-500 flex items-center gap-2"
                    >
                        ⚠️ Check!
                    </motion.div>
                )}

                {isCheckmate && (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold text-green-500"
                    >
                        ✓ Checkmate! {currentPlayer === 'white' ? 'Black' : 'White'} wins!
                    </motion.div>
                )}

                {isStalemate && (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold text-yellow-500"
                    >
                        Draw - Stalemate
                    </motion.div>
                )}
            </div>
        </Card>
    )
}
