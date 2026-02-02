import type { CellType } from './checkers-board'
import type { Difficulty } from '@/lib/store'

export function createInitialBoard(): CellType[][] {
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

export function isPlayerPiece(cell: CellType, player: "white" | "black"): boolean {
    if (player === "white") return cell === "white" || cell === "white-king"
    return cell === "black" || cell === "black-king"
}

export function countPieces(board: CellType[][]): { white: number; black: number } {
    let white = 0
    let black = 0

    board.forEach(row => {
        row.forEach(cell => {
            if (isPlayerPiece(cell, 'white')) white++
            if (isPlayerPiece(cell, 'black')) black++
        })
    })

    return { white, black }
}

export function getValidMoves(
    board: CellType[][],
    row: number,
    col: number
): Array<[number, number]> {
    const cell = board[row][col]
    if (cell === "empty") return []

    const isKing = cell.includes("king")
    const isWhite = cell.includes("white")
    const validMoves: Array<[number, number]> = []

    const directions = isKing
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        : isWhite
            ? [[-1, -1], [-1, 1]]
            : [[1, -1], [1, 1]]

    // Check normal moves
    for (const [dr, dc] of directions) {
        const newRow = row + dr
        const newCol = col + dc
        if (
            newRow >= 0 &&
            newRow < 8 &&
            newCol >= 0 &&
            newCol < 8 &&
            board[newRow][newCol] === "empty"
        ) {
            validMoves.push([newRow, newCol])
        }
    }

    // Check capture moves
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const midRow = row + dr
        const midCol = col + dc
        const newRow = row + dr * 2
        const newCol = col + dc * 2

        if (
            newRow >= 0 &&
            newRow < 8 &&
            newCol >= 0 &&
            newCol < 8 &&
            board[newRow][newCol] === "empty"
        ) {
            const midCell = board[midRow][midCol]
            if (
                (isWhite && isPlayerPiece(midCell, "black")) ||
                (!isWhite && isPlayerPiece(midCell, "white"))
            ) {
                validMoves.push([newRow, newCol])
            }
        }
    }

    return validMoves
}

export function makeMove(
    board: CellType[][],
    from: [number, number],
    to: [number, number]
): { newBoard: CellType[][], captured: boolean } {
    const newBoard = board.map(row => [...row])
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to

    const piece = newBoard[fromRow][fromCol]
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = "empty"

    // Check for king promotion
    if (piece === "white" && toRow === 0) {
        newBoard[toRow][toCol] = "white-king"
    } else if (piece === "black" && toRow === 7) {
        newBoard[toRow][toCol] = "black-king"
    }

    // Check for capture
    let captured = false
    const rowDiff = Math.abs(toRow - fromRow)
    if (rowDiff === 2) {
        const midRow = (fromRow + toRow) / 2
        const midCol = (fromCol + toCol) / 2
        newBoard[midRow][midCol] = "empty"
        captured = true
    }

    return { newBoard, captured }
}

export function getAIMove(
    board: CellType[][],
    difficulty: Difficulty
): { from: [number, number]; to: [number, number] } | null {
    interface Move {
        from: [number, number]
        to: [number, number]
        score: number
        isCapture: boolean
    }

    const possibleMoves: Move[] = []

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (!isPlayerPiece(board[row][col], "black")) continue

            const moves = getValidMoves(board, row, col)
            moves.forEach(([toRow, toCol]) => {
                const rowDiff = Math.abs(toRow - row)
                const isCapture = rowDiff === 2
                possibleMoves.push({
                    from: [row, col],
                    to: [toRow, toCol],
                    score: isCapture ? 10 : 1,
                    isCapture,
                })
            })
        }
    }

    if (possibleMoves.length === 0) return null

    if (difficulty === "easy") {
        // Random move
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    } else if (difficulty === "medium") {
        // Prefer captures
        const captures = possibleMoves.filter(m => m.isCapture)
        if (captures.length > 0) {
            return captures[Math.floor(Math.random() * captures.length)]
        }
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    } else {
        // Hard: always capture if possible, otherwise best strategic move
        const captures = possibleMoves.filter(m => m.isCapture)
        if (captures.length > 0) {
            return captures[0]
        }
        // Prefer advancing pieces
        return possibleMoves.sort((a, b) => b.to[0] - a.to[0])[0]
    }
}

export function calculateGameScore(
    whiteCount: number,
    blackCount: number,
    moves: number,
    difficulty: Difficulty
): number {
    const baseScore = (12 - blackCount) * 100
    const survivalBonus = whiteCount * 50
    const movesPenalty = moves * 2
    const diffMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2

    return Math.floor((baseScore + survivalBonus - movesPenalty) * diffMultiplier)
}
