import { Spinner } from '@/components/ui/spinner'

interface LoadingStateProps {
    message?: string
}

export function LoadingState({ message = 'Загрузка...' }: LoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Spinner className="h-12 w-12 text-primary" />
            <p className="text-muted-foreground text-lg">{message}</p>
        </div>
    )
}
