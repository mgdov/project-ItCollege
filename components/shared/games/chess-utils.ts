export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | null
export type PieceColor = 'white' | 'black' | null

export interface Piece {
    type: PieceType
    color: PieceColor
    hasMoved?: boolean
}

export interface GameState {
    board: Piece[][]
    currentPlayer: 'white' | 'black'
    isCheck: boolean
    isCheckmate: boolean
    isStalemate: boolean
    enPassantTarget: [number, number] | null
    capturedPieces: { white: PieceType[]; black: PieceType[] }
    moveHistory: string[]
}

export const pieceSymbols: Record<string, string> = {
    'king-white': '♔',
    'queen-white': '♕',
    'rook-white': '♖',
    'bishop-white': '♗',
    'knight-white': '♘',
    'pawn-white': '♙',
    'king-black': '♚',
    'queen-black': '♛',
    'rook-black': '♜',
    'bishop-black': '♝',
    'knight-black': '♞',
    'pawn-black': '♟',
}

export const PIECE_VALUES: Record<string, number> = {
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

export function createInitialBoard(): Piece[][] {
    return [
        [
            { type: 'rook', color: 'black', hasMoved: false },
            { type: 'knight', color: 'black' },
            { type: 'bishop', color: 'black' },
            { type: 'queen', color: 'black' },
            { type: 'king', color: 'black', hasMoved: false },
            { type: 'bishop', color: 'black' },
            { type: 'knight', color: 'black' },
            { type: 'rook', color: 'black', hasMoved: false },
        ],
        Array(8)
            .fill(null)
            .map(() => ({ type: 'pawn' as PieceType, color: 'black' as PieceColor, hasMoved: false })),
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
            .map(() => ({ type: 'pawn' as PieceType, color: 'white' as PieceColor, hasMoved: false })),
        [
            { type: 'rook', color: 'white', hasMoved: false },
            { type: 'knight', color: 'white' },
            { type: 'bishop', color: 'white' },
            { type: 'queen', color: 'white' },
            { type: 'king', color: 'white', hasMoved: false },
            { type: 'bishop', color: 'white' },
            { type: 'knight', color: 'white' },
            { type: 'rook', color: 'white', hasMoved: false },
        ],
    ]
}

export class ChessLogic {
    static isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8
    }

    static findKing(board: Piece[][], color: PieceColor): [number, number] | null {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c].type === 'king' && board[r][c].color === color) {
                    return [r, c]
                }
            }
        }
        return null
    }

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

    static isInCheck(board: Piece[][], color: PieceColor): boolean {
        const kingPos = this.findKing(board, color)
        if (!kingPos) return false
        const opponentColor = color === 'white' ? 'black' : 'white'
        return this.isSquareAttacked(board, kingPos[0], kingPos[1], opponentColor)
    }

    static getRawMoves(
        board: Piece[][],
        row: number,
        col: number,
        enPassantTarget: [number, number] | null,
        forAttackCheck = false
    ): [number, number][] {
        const piece = board[row][col]
        if (!piece.type || !piece.color) return []

        const moves: [number, number][] = []
        const color = piece.color
        const opponentColor = color === 'white' ? 'black' : 'white'

        switch (piece.type) {
            case 'pawn': {
                const direction = color === 'white' ? -1 : 1
                const startRow = color === 'white' ? 6 : 1

                if (!forAttackCheck) {
                    const oneForward = row + direction
                    if (this.isValidPosition(oneForward, col) && !board[oneForward][col].type) {
                        moves.push([oneForward, col])
                        const twoForward = row + 2 * direction
                        if (row === startRow && !board[twoForward][col].type) {
                            moves.push([twoForward, col])
                        }
                    }
                }

                for (const dc of [-1, 1]) {
                    const newRow = row + direction
                    const newCol = col + dc
                    if (this.isValidPosition(newRow, newCol)) {
                        const target = board[newRow][newCol]
                        if (target.color === opponentColor || forAttackCheck) {
                            moves.push([newRow, newCol])
                        }
                        if (enPassantTarget && newRow === enPassantTarget[0] && newCol === enPassantTarget[1]) {
                            moves.push([newRow, newCol])
                        }
                    }
                }
                break
            }

            case 'knight': {
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1],
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

            case 'bishop': {
                const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
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

            case 'rook': {
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
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

            case 'queen': {
                const directions = [
                    [-1, -1], [-1, 0], [-1, 1], [0, -1],
                    [0, 1], [1, -1], [1, 0], [1, 1],
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

            case 'king': {
                const directions = [
                    [-1, -1], [-1, 0], [-1, 1], [0, -1],
                    [0, 1], [1, -1], [1, 0], [1, 1],
                ]
                for (const [dr, dc] of directions) {
                    const newRow = row + dr
                    const newCol = col + dc
                    if (this.isValidPosition(newRow, newCol) && board[newRow][newCol].color !== color) {
                        moves.push([newRow, newCol])
                    }
                }

                if (!forAttackCheck && !piece.hasMoved && !this.isInCheck(board, color)) {
                    const baseRow = color === 'white' ? 7 : 0

                    const kingsideRook = board[baseRow][7]
                    if (kingsideRook.type === 'rook' && !kingsideRook.hasMoved) {
                        if (!board[baseRow][5].type && !board[baseRow][6].type) {
                            if (
                                !this.isSquareAttacked(board, baseRow, 5, opponentColor) &&
                                !this.isSquareAttacked(board, baseRow, 6, opponentColor)
                            ) {
                                moves.push([baseRow, 6])
                            }
                        }
                    }

                    const queensideRook = board[baseRow][0]
                    if (queensideRook.type === 'rook' && !queensideRook.hasMoved) {
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

    static getValidMoves(board: Piece[][], row: number, col: number, enPassantTarget: [number, number] | null): [number, number][] {
        const piece = board[row][col]
        if (!piece.type || !piece.color) return []

        const rawMoves = this.getRawMoves(board, row, col, enPassantTarget, false)
        const validMoves: [number, number][] = []

        for (const [newRow, newCol] of rawMoves) {
            const boardCopy = board.map((r) => r.map((p) => ({ ...p })))
            boardCopy[newRow][newCol] = { ...boardCopy[row][col] }
            boardCopy[row][col] = { type: null, color: null }

            if (piece.type === 'pawn' && enPassantTarget && newRow === enPassantTarget[0] && newCol === enPassantTarget[1]) {
                const captureRow = piece.color === 'white' ? newRow + 1 : newRow - 1
                boardCopy[captureRow][newCol] = { type: null, color: null }
            }

            if (!this.isInCheck(boardCopy, piece.color)) {
                validMoves.push([newRow, newCol])
            }
        }

        return validMoves
    }

    static evaluatePosition(board: Piece[][], color: PieceColor): number {
        let score = 0

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c]
                if (!piece.type || !piece.color) continue

                const pieceValue = PIECE_VALUES[piece.type] || 0
                const positionValue =
                    POSITION_TABLES[piece.type]?.[piece.color === 'white' ? r : 7 - r][c] || 0

                const totalValue = pieceValue + positionValue

                if (piece.color === color) {
                    score += totalValue
                } else {
                    score -= totalValue
                }
            }
        }

        return score
    }

    static hasAnyValidMoves(board: Piece[][], color: PieceColor, enPassantTarget: [number, number] | null): boolean {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c]
                if (piece.color === color && piece.type) {
                    const moves = this.getValidMoves(board, r, c, enPassantTarget)
                    if (moves.length > 0) return true
                }
            }
        }
        return false
    }
}

export function positionToNotation(row: number, col: number): string {
    return `${String.fromCharCode(97 + col)}${8 - row}`
}

export function makeAIMove(
    board: Piece[][],
    difficulty: 'easy' | 'medium' | 'hard',
    enPassantTarget: [number, number] | null
): { from: [number, number]; to: [number, number] } | null {
    const allMoves: Array<{ from: [number, number]; to: [number, number]; score: number }> = []

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c]
            if (piece.color === 'black' && piece.type) {
                const moves = ChessLogic.getValidMoves(board, r, c, enPassantTarget)
                for (const [newRow, newCol] of moves) {
                    const boardCopy = board.map((row) => row.map((p) => ({ ...p })))
                    boardCopy[newRow][newCol] = { ...boardCopy[r][c] }
                    boardCopy[row][col] = { type: null, color: null }

                    const score = ChessLogic.evaluatePosition(boardCopy, 'black')
                    allMoves.push({ from: [r, c], to: [newRow, newCol], score })
                }
            }
        }
    }

    if (allMoves.length === 0) return null

    if (difficulty === 'easy') {
        return allMoves[Math.floor(Math.random() * allMoves.length)]
    } else if (difficulty === 'medium') {
        const topMoves = allMoves.sort((a, b) => b.score - a.score).slice(0, 5)
        return topMoves[Math.floor(Math.random() * topMoves.length)]
    } else {
        return allMoves.sort((a, b) => b.score - a.score)[0]
    }
}
