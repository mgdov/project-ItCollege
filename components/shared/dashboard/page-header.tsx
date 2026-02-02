import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
    title: string
    description?: string
    icon?: LucideIcon
    badge?: {
        label: string
        variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }
    gradient?: string
    actions?: React.ReactNode
}

export function PageHeader({
    title,
    description,
    icon: Icon,
    badge,
    gradient = 'from-primary to-purple-500',
    actions,
}: PageHeaderProps) {
    return (
        <div className={`relative overflow-hidden bg-gradient-to-r ${gradient} px-4 py-12 md:px-8 md:py-16`}>
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Icon className="h-8 w-8 text-white" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
                            {badge && (
                                <Badge variant={badge.variant} className="hidden sm:inline-flex">
                                    {badge.label}
                                </Badge>
                            )}
                        </div>
                        {description && (
                            <p className="text-white/90 text-lg max-w-2xl">{description}</p>
                        )}
                    </div>
                </div>

                {actions && <div className="hidden lg:block">{actions}</div>}
            </motion.div>
        </div>
    )
}
