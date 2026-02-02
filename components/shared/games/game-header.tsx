import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw, Flag, Pause, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GameHeaderProps {
    title: string
    onReset: () => void
    onTogglePause?: () => void
    isPaused?: boolean
    showPause?: boolean
}

export function GameHeader({
    title,
    onReset,
    onTogglePause,
    isPaused = false,
    showPause = false
}: GameHeaderProps) {
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 mb-6"
        >
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-primary/10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>

            <div className="flex items-center gap-2">
                {showPause && onTogglePause && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onTogglePause}
                        className="hover:bg-primary/10"
                    >
                        {isPaused ? (
                            <Play className="h-5 w-5" />
                        ) : (
                            <Pause className="h-5 w-5" />
                        )}
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onReset}
                    className="hover:bg-destructive/10"
                >
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    )
}
