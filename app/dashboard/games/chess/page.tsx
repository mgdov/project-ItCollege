"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Flag, Cpu, Users, Brain, Zap, Flame, Trophy, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { saveGameScore, getBestScore, calculateScore } from "@/lib/scoring"

type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn" | null
type PieceColor = "white" | "black" | null
type Difficulty = "easy" | "medium" | "hard"

interface Piece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

interface GameState {
  board: Piece[][]
  currentPlayer: "white" | "black"
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  enPassantTarget: [number, number] | null
}

const createInitialBoard = (): Piece[][] => [
  [
    { type: "rook", color: "black", hasMoved: false },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black", hasMoved: false },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black", hasMoved: false },
  ],
  Array(8)
    .fill(null)
    .map(() => ({ type: "pawn" as PieceType, color: "black" as PieceColor, hasMoved: false })),
  Array(8)
    .fill(null)
    .map(() => ({ type: null, color: null })),
  Array(8)
    .fill(null)
    .map(() => ({ type: null, color: null })),
  Array(8)
    .fill(null)
    .map(() => ({ type: null, color: null })),
  Array(8)
    .fill(null)
    .map(() => ({ type: null, color: null })),
  Array(8)
    .fill(null)
    .map(() => ({ type: "pawn" as PieceType, color: "white" as PieceColor, hasMoved: false })),
  [
    { type: "rook", color: "white", hasMoved: false },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white", hasMoved: false },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white", hasMoved: false },
  ],
]

const pieceSymbols: Record<string, string> = {
  "king-white": "♔",
  "queen-white": "♕",
  "rook-white": "♖",
  "bishop-white": "♗",
  "knight-white": "♘",
  "pawn-white": "♙",
  "king-black": "♚",
  "queen-black": "♛",
  "rook-black": "♜",
  "bishop-black": "♝",
  "knight-black": "♞",
  "pawn-black": "♟",
}

const PIECE_VALUES: Record<string, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
}

const POSITION_TABLES: Record<string, number[][]> = {
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  knight: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  bishop: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  queen: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  king: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
}

class ChessLogic {
  // Check if position is within board
  static isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  // Find king position for a color
  static findKing(board: Piece[][], color: PieceColor): [number, number] | null {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].type === "king" && board[r][c].color === color) {
          return [r, c]
        }
      }
    }
    return null
  }

  // Check if a square is under attack by opponent
  static isSquareAttacked(board: Piece[][], row: number, col: number, byColor: PieceColor): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c]
        if (piece.color === byColor && piece.type) {
          const moves = this.getRawMoves(board, r, c, null, true)
          if (moves.some(([mr, mc]) => mr === row && mc === col)) {
            return true
          }
        }
      }
    }
    return false
  }

  // Check if king is in check
  static isInCheck(board: Piece[][], color: PieceColor): boolean {
    const kingPos = this.findKing(board, color)
    if (!kingPos) return false
    const opponentColor = color === "white" ? "black" : "white"
    return this.isSquareAttacked(board, kingPos[0], kingPos[1], opponentColor)
  }

  // Get raw moves without check validation (to prevent infinite recursion)
  static getRawMoves(
    board: Piece[][],
    row: number,
    col: number,
    enPassantTarget: [number, number] | null,
    forAttackCheck = false,
  ): [number, number][] {
    const piece = board[row][col]
    if (!piece.type || !piece.color) return []

    const moves: [number, number][] = []
    const color = piece.color
    const opponentColor = color === "white" ? "black" : "white"

    switch (piece.type) {
      case "pawn": {
        const direction = color === "white" ? -1 : 1
        const startRow = color === "white" ? 6 : 1

        // Forward move
        if (!forAttackCheck) {
          const oneForward = row + direction
          if (this.isValidPosition(oneForward, col) && !board[oneForward][col].type) {
            moves.push([oneForward, col])
            // Double move from start
            const twoForward = row + 2 * direction
            if (row === startRow && !board[twoForward][col].type) {
              moves.push([twoForward, col])
            }
          }
        }

        // Captures (diagonal)
        for (const dc of [-1, 1]) {
          const newRow = row + direction
          const newCol = col + dc
          if (this.isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol]
            if (target.color === opponentColor || forAttackCheck) {
              moves.push([newRow, newCol])
            }
            // En passant
            if (enPassantTarget && newRow === enPassantTarget[0] && newCol === enPassantTarget[1]) {
              moves.push([newRow, newCol])
            }
          }
        }
        break
      }

      case "knight": {
        const knightMoves = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ]
        for (const [dr, dc] of knightMoves) {
          const newRow = row + dr
          const newCol = col + dc
          if (this.isValidPosition(newRow, newCol) && board[newRow][newCol].color !== color) {
            moves.push([newRow, newCol])
          }
        }
        break
      }

      case "bishop": {
        const directions = [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]
        for (const [dr, dc] of directions) {
          let newRow = row + dr
          let newCol = col + dc
          while (this.isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol].type) {
              moves.push([newRow, newCol])
            } else {
              if (board[newRow][newCol].color === opponentColor) {
                moves.push([newRow, newCol])
              }
              break
            }
            newRow += dr
            newCol += dc
          }
        }
        break
      }

      case "rook": {
        const directions = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]
        for (const [dr, dc] of directions) {
          let newRow = row + dr
          let newCol = col + dc
          while (this.isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol].type) {
              moves.push([newRow, newCol])
            } else {
              if (board[newRow][newCol].color === opponentColor) {
                moves.push([newRow, newCol])
              }
              break
            }
            newRow += dr
            newCol += dc
          }
        }
        break
      }

      case "queen": {
        const directions = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ]
        for (const [dr, dc] of directions) {
          let newRow = row + dr
          let newCol = col + dc
          while (this.isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol].type) {
              moves.push([newRow, newCol])
            } else {
              if (board[newRow][newCol].color === opponentColor) {
                moves.push([newRow, newCol])
              }
              break
            }
            newRow += dr
            newCol += dc
          }
        }
        break
      }

      case "king": {
        const directions = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ]
        for (const [dr, dc] of directions) {
          const newRow = row + dr
          const newCol = col + dc
          if (this.isValidPosition(newRow, newCol) && board[newRow][newCol].color !== color) {
            moves.push([newRow, newCol])
          }
        }

        // Castling (only check when not for attack validation)
        if (!forAttackCheck && !piece.hasMoved && !this.isInCheck(board, color)) {
          const baseRow = color === "white" ? 7 : 0

          // Kingside castling
          const kingsideRook = board[baseRow][7]
          if (kingsideRook.type === "rook" && !kingsideRook.hasMoved) {
            if (!board[baseRow][5].type && !board[baseRow][6].type) {
              if (
                !this.isSquareAttacked(board, baseRow, 5, opponentColor) &&
                !this.isSquareAttacked(board, baseRow, 6, opponentColor)
              ) {
                moves.push([baseRow, 6])
              }
            }
          }

          // Queenside castling
          const queensideRook = board[baseRow][0]
          if (queensideRook.type === "rook" && !queensideRook.hasMoved) {
            if (!board[baseRow][1].type && !board[baseRow][2].type && !board[baseRow][3].type) {
              if (
                !this.isSquareAttacked(board, baseRow, 2, opponentColor) &&
                !this.isSquareAttacked(board, baseRow, 3, opponentColor)
              ) {
                moves.push([baseRow, 2])
              }
            }
          }
        }
        break
      }
    }

    return moves
  }

  // Get legal moves (filtered by check)
  static getLegalMoves(
    board: Piece[][],
    row: number,
    col: number,
    enPassantTarget: [number, number] | null,
  ): [number, number][] {
    const piece = board[row][col]
    if (!piece.type || !piece.color) return []

    const rawMoves = this.getRawMoves(board, row, col, enPassantTarget)
    const legalMoves: [number, number][] = []

    for (const [toRow, toCol] of rawMoves) {
      // Simulate the move
      const newBoard = board.map((r) => r.map((c) => ({ ...c })))

      // Handle en passant capture
      if (piece.type === "pawn" && enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
        const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1
        newBoard[capturedPawnRow][toCol] = { type: null, color: null }
      }

      // Handle castling
      if (piece.type === "king" && Math.abs(col - toCol) === 2) {
        if (toCol === 6) {
          // Kingside
          newBoard[row][5] = newBoard[row][7]
          newBoard[row][7] = { type: null, color: null }
        } else if (toCol === 2) {
          // Queenside
          newBoard[row][3] = newBoard[row][0]
          newBoard[row][0] = { type: null, color: null }
        }
      }

      newBoard[toRow][toCol] = { ...piece, hasMoved: true }
      newBoard[row][col] = { type: null, color: null }

      // Check if this leaves king in check
      if (!this.isInCheck(newBoard, piece.color)) {
        legalMoves.push([toRow, toCol])
      }
    }

    return legalMoves
  }

  // Check if player has any legal moves
  static hasLegalMoves(board: Piece[][], color: PieceColor, enPassantTarget: [number, number] | null): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].color === color) {
          const moves = this.getLegalMoves(board, r, c, enPassantTarget)
          if (moves.length > 0) return true
        }
      }
    }
    return false
  }

  // Make a move and return new game state
  static makeMove(
    board: Piece[][],
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    currentPlayer: "white" | "black",
    enPassantTarget: [number, number] | null,
  ): { newBoard: Piece[][]; newEnPassant: [number, number] | null; promotion: boolean } {
    const newBoard = board.map((r) => r.map((c) => ({ ...c })))
    const piece = newBoard[fromRow][fromCol]
    let newEnPassant: [number, number] | null = null
    let promotion = false

    // Handle en passant capture
    if (piece.type === "pawn" && enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
      const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1
      newBoard[capturedPawnRow][toCol] = { type: null, color: null }
    }

    // Handle castling
    if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
      if (toCol === 6) {
        // Kingside
        newBoard[fromRow][5] = { ...newBoard[fromRow][7], hasMoved: true }
        newBoard[fromRow][7] = { type: null, color: null }
      } else if (toCol === 2) {
        // Queenside
        newBoard[fromRow][3] = { ...newBoard[fromRow][0], hasMoved: true }
        newBoard[fromRow][0] = { type: null, color: null }
      }
    }

    // Set en passant target for double pawn move
    if (piece.type === "pawn" && Math.abs(fromRow - toRow) === 2) {
      newEnPassant = [(fromRow + toRow) / 2, fromCol]
    }

    // Check for pawn promotion
    if (piece.type === "pawn" && (toRow === 0 || toRow === 7)) {
      promotion = true
      newBoard[toRow][toCol] = { type: "queen", color: piece.color, hasMoved: true }
    } else {
      newBoard[toRow][toCol] = { ...piece, hasMoved: true }
    }

    newBoard[fromRow][fromCol] = { type: null, color: null }

    return { newBoard, newEnPassant, promotion }
  }

  static evaluateBoard(board: Piece[][]): number {
    let score = 0

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c]
        if (piece.type && piece.color) {
          const pieceValue = PIECE_VALUES[piece.type]
          const positionTable = POSITION_TABLES[piece.type]

          // Для чёрных инвертируем таблицу позиций
          const positionBonus = piece.color === "white" ? positionTable[r][c] : positionTable[7 - r][c]

          if (piece.color === "white") {
            score += pieceValue + positionBonus
          } else {
            score -= pieceValue + positionBonus
          }
        }
      }
    }

    return score
  }

  static minimax(
    board: Piece[][],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    enPassantTarget: [number, number] | null,
  ): number {
    if (depth === 0) {
      return this.evaluateBoard(board)
    }

    const color: PieceColor = isMaximizing ? "white" : "black"
    const hasLegal = this.hasLegalMoves(board, color, enPassantTarget)

    if (!hasLegal) {
      if (this.isInCheck(board, color)) {
        // Мат - очень плохо для текущего игрока
        return isMaximizing ? -100000 + depth : 100000 - depth
      }
      // Пат - ничья
      return 0
    }

    if (isMaximizing) {
      let maxEval = Number.NEGATIVE_INFINITY

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (board[r][c].color === "white") {
            const moves = this.getLegalMoves(board, r, c, enPassantTarget)
            for (const [toR, toC] of moves) {
              const { newBoard, newEnPassant } = this.makeMove(board, r, c, toR, toC, "white", enPassantTarget)
              const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, false, newEnPassant)
              maxEval = Math.max(maxEval, evalScore)
              alpha = Math.max(alpha, evalScore)
              if (beta <= alpha) break
            }
          }
        }
      }
      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (board[r][c].color === "black") {
            const moves = this.getLegalMoves(board, r, c, enPassantTarget)
            for (const [toR, toC] of moves) {
              const { newBoard, newEnPassant } = this.makeMove(board, r, c, toR, toC, "black", enPassantTarget)
              const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, true, newEnPassant)
              minEval = Math.min(minEval, evalScore)
              beta = Math.min(beta, evalScore)
              if (beta <= alpha) break
            }
          }
        }
      }
      return minEval
    }
  }

  static getBestMove(
    board: Piece[][],
    color: PieceColor,
    enPassantTarget: [number, number] | null,
    difficulty: Difficulty = "medium",
  ): { from: [number, number]; to: [number, number] } | null {
    const allMoves: { from: [number, number]; to: [number, number]; score: number }[] = []

    // Собираем все возмомые ходы
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].color === color) {
          const moves = this.getLegalMoves(board, r, c, enPassantTarget)
          for (const [toR, toC] of moves) {
            allMoves.push({ from: [r, c], to: [toR, toC], score: 0 })
          }
        }
      }
    }

    if (allMoves.length === 0) return null

    switch (difficulty) {
      case "easy":
        // Лёгкий: случайные ходы с небольшим предпочтением взятий
        for (const move of allMoves) {
          const targetPiece = board[move.to[0]][move.to[1]]
          if (targetPiece.type) {
            move.score = PIECE_VALUES[targetPiece.type] * 0.5
          }
          // Большой элемент случайности
          move.score += Math.random() * 500
        }
        break

      case "medium":
        // Средний: Minimax с глубиной 2
        for (const move of allMoves) {
          const { newBoard, newEnPassant } = this.makeMove(
            board,
            move.from[0],
            move.from[1],
            move.to[0],
            move.to[1],
            color as "white" | "black",
            enPassantTarget,
          )
          move.score = -this.minimax(
            newBoard,
            2,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            color === "black",
            newEnPassant,
          )
          // Небольшая случайность для разнообразия
          move.score += Math.random() * 30
        }
        break

      case "hard":
        // Сложный: Minimax с глубиной 4
        for (const move of allMoves) {
          const { newBoard, newEnPassant } = this.makeMove(
            board,
            move.from[0],
            move.from[1],
            move.to[0],
            move.to[1],
            color as "white" | "black",
            enPassantTarget,
          )
          move.score = -this.minimax(
            newBoard,
            4,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            color === "black",
            newEnPassant,
          )
          // Минимальная случайность
          move.score += Math.random() * 5
        }
        break
    }

    // Сортируем и выбираем лучший ход (для чёрных минимизируем)
    allMoves.sort((a, b) => b.score - a.score)

    return { from: allMoves[0].from, to: allMoves[0].to }
  }
}

export default function ChessPage() {
  const router = useRouter()
  const [board, setBoard] = useState<Piece[][]>(createInitialBoard)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [gameMode, setGameMode] = useState<"cpu" | "player" | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [moves, setMoves] = useState<string[]>([])
  const [enPassantTarget, setEnPassantTarget] = useState<[number, number] | null>(null)
  const [isCheck, setIsCheck] = useState(false)
  const [gameOver, setGameOver] = useState<"checkmate" | "stalemate" | null>(null)
  const [winner, setWinner] = useState<"white" | "black" | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [bestScore, setBestScore] = useState(0)

  const getPieceSymbol = (piece: Piece) => {
    if (!piece.type || !piece.color) return null
    return pieceSymbols[`${piece.type}-${piece.color}`]
  }

  const getPieceColorClass = (piece: Piece) => {
    if (!piece.color) return ""
    return piece.color === "white"
      ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]"
      : "text-gray-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"
  }

  const getMoveNotation = (
    piece: Piece,
    fromCol: number,
    fromRow: number,
    toCol: number,
    toRow: number,
    capture: boolean,
  ) => {
    const pieceNames: Record<string, string> = {
      king: "Кр",
      queen: "Ф",
      rook: "Л",
      bishop: "С",
      knight: "К",
      pawn: "",
    }
    const files = "abcdefgh"
    const pieceName = pieceNames[piece.type || ""]
    const captureSymbol = capture ? "x" : ""
    return `${pieceName}${files[fromCol]}${8 - fromRow}${captureSymbol}${files[toCol]}${8 - toRow}`
  }

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameMode || gameOver || isThinking) return

      const piece = board[row][col]

      if (selectedCell) {
        const [selectedRow, selectedCol] = selectedCell

        const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col)

        if (isLegalMove) {
          const selectedPiece = board[selectedRow][selectedCol]
          const capturedPiece = board[row][col]

          const { newBoard, newEnPassant, promotion } = ChessLogic.makeMove(
            board,
            selectedRow,
            selectedCol,
            row,
            col,
            currentPlayer,
            enPassantTarget,
          )

          setBoard(newBoard)
          setEnPassantTarget(newEnPassant)

          const notation =
            getMoveNotation(selectedPiece, selectedCol, selectedRow, col, row, !!capturedPiece.type) +
            (promotion ? "=Ф" : "")
          setMoves((prev) => [...prev, notation])

          const nextPlayer = currentPlayer === "white" ? "black" : "white"

          const inCheck = ChessLogic.isInCheck(newBoard, nextPlayer)
          setIsCheck(inCheck)

          const hasLegalMoves = ChessLogic.hasLegalMoves(newBoard, nextPlayer, newEnPassant)

          if (!hasLegalMoves) {
            if (inCheck) {
              setGameOver("checkmate")
              setWinner(currentPlayer)

              // Начисляем баллы за победу
              if (gameMode === "cpu" && difficulty && currentPlayer === "white") {
                const baseScore = 100
                const movesBonus = Math.max(0, 50 - moves.length) * 2
                const score = calculateScore(baseScore + movesBonus, difficulty)
                setTotalScore(score)
                saveGameScore("Шахматы", score, difficulty)
                setShowScoreAnimation(true)
              }

              setMoves((prev) => {
                const newMoves = [...prev]
                newMoves[newMoves.length - 1] += "#"
                return newMoves
              })
            } else {
              setGameOver("stalemate")
            }
          } else if (inCheck) {
            setMoves((prev) => {
              const newMoves = [...prev]
              newMoves[newMoves.length - 1] += "+"
              return newMoves
            })
          }

          setCurrentPlayer(nextPlayer)
          setSelectedCell(null)
          setLegalMoves([])

          if (gameMode === "cpu" && difficulty && !gameOver && nextPlayer === "black" && hasLegalMoves) {
            setIsThinking(true)
            setTimeout(
              () => {
                const aiMove = ChessLogic.getBestMove(newBoard, "black", newEnPassant, difficulty)
                if (aiMove) {
                  const aiPiece = newBoard[aiMove.from[0]][aiMove.from[1]]
                  const aiCapture = newBoard[aiMove.to[0]][aiMove.to[1]]

                  const {
                    newBoard: aiBoard,
                    newEnPassant: aiEnPassant,
                    promotion: aiPromotion,
                  } = ChessLogic.makeMove(
                    newBoard,
                    aiMove.from[0],
                    aiMove.from[1],
                    aiMove.to[0],
                    aiMove.to[1],
                    "black",
                    newEnPassant,
                  )

                  setBoard(aiBoard)
                  setEnPassantTarget(aiEnPassant)

                  const aiNotation =
                    getMoveNotation(
                      aiPiece,
                      aiMove.from[1],
                      aiMove.from[0],
                      aiMove.to[1],
                      aiMove.to[0],
                      !!aiCapture.type,
                    ) + (aiPromotion ? "=Ф" : "")

                  const aiInCheck = ChessLogic.isInCheck(aiBoard, "white")
                  setIsCheck(aiInCheck)

                  const whiteHasMoves = ChessLogic.hasLegalMoves(aiBoard, "white", aiEnPassant)

                  if (!whiteHasMoves) {
                    if (aiInCheck) {
                      setGameOver("checkmate")
                      setWinner("black")
                      setMoves((prev) => [...prev, aiNotation + "#"])
                    } else {
                      setGameOver("stalemate")
                      setMoves((prev) => [...prev, aiNotation])
                    }
                  } else {
                    setMoves((prev) => [...prev, aiNotation + (aiInCheck ? "+" : "")])
                  }

                  setCurrentPlayer("white")
                }
                setIsThinking(false)
              },
              difficulty === "hard" ? 1000 : difficulty === "medium" ? 500 : 300,
            )
          }
        } else if (piece.color === currentPlayer) {
          setSelectedCell([row, col])
          setLegalMoves(ChessLogic.getLegalMoves(board, row, col, enPassantTarget))
        } else {
          setSelectedCell(null)
          setLegalMoves([])
        }
      } else if (piece.color === currentPlayer) {
        setSelectedCell([row, col])
        setLegalMoves(ChessLogic.getLegalMoves(board, row, col, enPassantTarget))
      }
    },
    [board, selectedCell, legalMoves, currentPlayer, gameMode, enPassantTarget, gameOver, difficulty, isThinking],
  )

  const resetGame = () => {
    setBoard(createInitialBoard())
    setSelectedCell(null)
    setLegalMoves([])
    setCurrentPlayer("white")
    setMoves([])
    setEnPassantTarget(null)
    setIsCheck(false)
    setGameOver(null)
    setWinner(null)
    setIsThinking(false)
    setTotalScore(0)
    setShowScoreAnimation(false)
  }

  // Загружаем лучший результат при выборе сложности
  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff)
    setBestScore(getBestScore("Шахматы", diff))
  }

  if (!gameMode) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Шахматы</h1>
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
                  <p className="text-sm text-muted-foreground">Для начинающих. ИИ делает простые ходы.</p>
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
                  <p className="text-sm text-muted-foreground">Для любителей. ИИ анализирует на 2 хода вперёд.</p>
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
                  <p className="text-sm text-muted-foreground">Для опытных. ИИ анализирует на 4 хода вперёд.</p>
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

  // Экран победы с баллами
  if (gameOver === "checkmate" && winner === "white" && gameMode === "cpu" && showScoreAnimation) {
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
                      setShowScoreAnimation(false)
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

  const difficultyNames: Record<Difficulty, string> = {
    easy: "Лёгкий",
    medium: "Средний",
    hard: "Сложный",
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setGameMode(null)
              setDifficulty(null)
              resetGame()
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Шахматы</h1>
            <p className="text-sm text-muted-foreground">
              {gameMode === "cpu"
                ? `Игра с компьютером (${difficulty ? difficultyNames[difficulty] : ""})`
                : "Игра вдвоём"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {gameMode === "cpu" && difficulty && bestScore > 0 && (
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" />
              Рекорд: {bestScore}
            </Badge>
          )}
          {isThinking && (
            <Badge variant="outline" className="animate-pulse">
              ИИ думает...
            </Badge>
          )}
          {gameOver ? (
            <Badge variant="destructive" className="text-base">
              {gameOver === "checkmate" ? `Мат! ${winner === "white" ? "Белые" : "Чёрные"} победили` : "Пат! Ничья"}
            </Badge>
          ) : (
            <>
              {isCheck && <Badge variant="destructive">Шах!</Badge>}
              <Badge variant={currentPlayer === "white" ? "default" : "secondary"} className="text-base">
                Ход: {currentPlayer === "white" ? "Белые" : "Чёрные"}
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="mx-auto aspect-square max-w-[500px]">
                <div
                  className={`grid h-full w-full grid-cols-8 overflow-hidden rounded-lg border-2 border-border ${isThinking ? "pointer-events-none opacity-80" : ""}`}
                >
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0
                      const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                      const isLegalMove = legalMoves.some(([r, c]) => r === rowIndex && c === colIndex)
                      const isCapture = isLegalMove && board[rowIndex][colIndex].type

                      return (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          className={`relative flex aspect-square items-center justify-center text-3xl transition-colors sm:text-4xl ${isLight ? "bg-amber-200 dark:bg-amber-100" : "bg-amber-700 dark:bg-amber-800"
                            } ${isSelected ? "ring-2 ring-inset ring-primary" : ""} ${isCapture ? "ring-2 ring-inset ring-red-500" : ""
                            } hover:opacity-80 ${getPieceColorClass(cell)}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          disabled={gameOver !== null && !selectedCell}
                        >
                          {getPieceSymbol(cell)}
                          {isLegalMove && !isCapture && (
                            <div className="absolute h-3 w-3 rounded-full bg-green-500/60" />
                          )}
                        </button>
                      )
                    }),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
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
              {gameMode === "cpu" && (
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => {
                    resetGame()
                    setDifficulty(null)
                  }}
                >
                  <Brain className="h-4 w-4" />
                  Сменить сложность
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent text-destructive hover:text-destructive"
                onClick={() => {
                  setGameMode(null)
                  setDifficulty(null)
                  resetGame()
                }}
              >
                <Flag className="h-4 w-4" />
                Сдаться
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Правила ходов</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                  <span>Возможный ход</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded ring-2 ring-red-500" />
                  <span>Взятие фигуры</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded ring-2 ring-primary" />
                  <span>Выбранная фигура</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">История ходов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[200px] space-y-1 overflow-y-auto">
                {moves.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ходов пока нет</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {moves.map((move, index) => (
                      <div
                        key={index}
                        className={`rounded px-2 py-1 text-sm ${index % 2 === 0 ? "bg-muted/50" : "bg-muted/30"}`}
                      >
                        {Math.floor(index / 2) + 1}
                        {index % 2 === 0 ? "." : "..."} {move}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
