import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, Inbox } from 'lucide-react'

interface EmptyStateProps {
    title: string
    description?: string
    icon?: LucideIcon
    action?: {
        label: string
        onClick: () => void
    }
}

export function EmptyState({
    title,
    description,
    icon: Icon = Inbox,
    action,
}: EmptyStateProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    {description && (
                        <p className="text-muted-foreground max-w-md">{description}</p>
                    )}
                </div>
                {action && (
                    <Button onClick={action.onClick} size="lg" className="mt-4">
                        {action.label}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
