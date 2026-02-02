// Checkers game logic and types
export type CellType = 'empty' | 'white' | 'black' | 'white-king' | 'black-king'
export type Player = 'white' | 'black'

export interface Move {
    from: [number, number]
    to: [number, number]
    isCapture: boolean
    captured?: [number, number]
}

export interface GameStats {
    whiteCount: number
    blackCount: number
    moves: number
}

export const createInitialBoard = (): CellType[][] => {
    const board: CellType[][] = Array(8)
        .fill(null)
        .map(() => Array(8).fill('empty'))

    // Black pieces (top)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = 'black'
            }
        }
    }

    // White pieces (bottom)
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = 'white'
            }
        }
    }

    return board
}

export const isPlayerPiece = (cell: CellType, player: Player): boolean => {
    if (player === 'white') return cell === 'white' || cell === 'white-king'
    return cell === 'black' || cell === 'black-king'
}

export const shouldPromoteToKing = (row: number, player: Player): boolean => {
    return (player === 'white' && row === 0) || (player === 'black' && row === 7)
}

export const getValidMoves = (
    board: CellType[][],
    row: number,
    col: number
): Move[] => {
    const cell = board[row][col]
    if (cell === 'empty') return []

    const player: Player = cell.includes('white') ? 'white' : 'black'
    const isKing = cell.includes('king')
    const moves: Move[] = []

    const directions = isKing
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        : player === 'white'
            ? [[-1, -1], [-1, 1]]
            : [[1, -1], [1, 1]]

    // Check regular moves
    for (const [dr, dc] of directions) {
        const newRow = row + dr
        const newCol = col + dc
        if (
            newRow >= 0 &&
            newRow < 8 &&
            newCol >= 0 &&
            newCol < 8 &&
            board[newRow][newCol] === 'empty'
        ) {
            moves.push({
                from: [row, col],
                to: [newRow, newCol],
                isCapture: false,
            })
        }
    }

    // Check captures
    for (const [dr, dc] of directions) {
        const midRow = row + dr
        const midCol = col + dc
        const newRow = row + dr * 2
        const newCol = col + dc * 2

        if (
            newRow >= 0 &&
            newRow < 8 &&
            newCol >= 0 &&
            newCol < 8 &&
            board[newRow][newCol] === 'empty' &&
            isPlayerPiece(board[midRow][midCol], player === 'white' ? 'black' : 'white')
        ) {
            moves.push({
                from: [row, col],
                to: [newRow, newCol],
                isCapture: true,
                captured: [midRow, midCol],
            })
        }
    }

    return moves
}

export const countPieces = (board: CellType[][]): GameStats => {
    let whiteCount = 0
    let blackCount = 0

    for (const row of board) {
        for (const cell of row) {
            if (cell.includes('white')) whiteCount++
            else if (cell.includes('black')) blackCount++
        }
    }

    return { whiteCount, blackCount, moves: 0 }
}

export const checkWinner = (stats: GameStats): Player | null => {
    if (stats.whiteCount === 0) return 'black'
    if (stats.blackCount === 0) return 'white'
    return null
}

export const applyMove = (
    board: CellType[][],
    move: Move,
    player: Player
): CellType[][] => {
    const newBoard = board.map(row => [...row])
    const [fromRow, fromCol] = move.from
    const [toRow, toCol] = move.to

    const piece = newBoard[fromRow][fromCol]
    newBoard[fromRow][fromCol] = 'empty'

    // Promote to king if reached opposite end
    const shouldPromote = shouldPromoteToKing(toRow, player)
    newBoard[toRow][toCol] = shouldPromote
        ? player === 'white'
            ? 'white-king'
            : 'black-king'
        : piece

    // Remove captured piece
    if (move.isCapture && move.captured) {
        const [capturedRow, capturedCol] = move.captured
        newBoard[capturedRow][capturedCol] = 'empty'
    }

    return newBoard
}
