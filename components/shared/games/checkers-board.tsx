import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export type CellType = "empty" | "white" | "black" | "white-king" | "black-king"

interface CheckersBoardProps {
    board: CellType[][]
    selectedCell: [number, number] | null
    onCellClick: (row: number, col: number) => void
    validMoves: [number, number][]
}

export function CheckersBoard({ board, selectedCell, onCellClick, validMoves }: CheckersBoardProps) {
    const isValidMove = (row: number, col: number) => {
        return validMoves.some(([r, c]) => r === row && c === col)
    }

    return (
        <Card className="p-4">
            <div className="grid grid-cols-8 gap-0 aspect-square max-w-[600px] mx-auto border-4 border-primary/20 rounded-lg overflow-hidden shadow-xl">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <CheckerCell
                            key={`${rowIndex}-${colIndex}`}
                            cell={cell}
                            row={rowIndex}
                            col={colIndex}
                            isDark={(rowIndex + colIndex) % 2 === 1}
                            isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
                            isValidMove={isValidMove(rowIndex, colIndex)}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </Card>
    )
}

interface CheckerCellProps {
    cell: CellType
    row: number
    col: number
    isDark: boolean
    isSelected: boolean
    isValidMove: boolean
    onClick: () => void
}

function CheckerCell({ cell, isDark, isSelected, isValidMove, onClick }: CheckerCellProps) {
    return (
        <motion.div
            whileHover={{ scale: cell !== "empty" || isValidMove ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        aspect-square flex items-center justify-center cursor-pointer relative
        ${isDark ? 'bg-primary/80' : 'bg-muted/50'}
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
        ${isValidMove ? 'ring-2 ring-green-400' : ''}
      `}
        >
            {cell !== "empty" && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative w-[70%] h-[70%]"
                >
                    <CheckerPiece type={cell} />
                </motion.div>
            )}
            {isValidMove && cell === "empty" && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-green-400/50"
                />
            )}
        </motion.div>
    )
}

interface CheckerPieceProps {
    type: CellType
}

function CheckerPiece({ type }: CheckerPieceProps) {
    const isWhite = type.includes('white')
    const isKing = type.includes('king')

    return (
        <div
            className={`
        w-full h-full rounded-full flex items-center justify-center
        border-4 shadow-lg
        ${isWhite
                    ? 'bg-gradient-to-br from-gray-100 to-gray-300 border-gray-400'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                }
      `}
        >
            {isKing && (
                <span className={`text-2xl font-bold ${isWhite ? 'text-yellow-600' : 'text-yellow-400'}`}>
                    ♔
                </span>
            )}
        </div>
    )
}
