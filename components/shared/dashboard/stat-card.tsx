import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    gradient?: string
    trend?: {
        value: number
        label: string
    }
    delay?: number
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    gradient = 'from-blue-500 to-cyan-500',
    trend,
    delay = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="border-2 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="pt-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                            <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">{title}</p>
                            <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{
                                backgroundImage: `linear-gradient(to right, var(--${gradient.split(' ')[0].replace('from-', '')}), var(--${gradient.split(' ')[1].replace('to-', '')}))`
                            }}>
                                {value}
                            </p>
                            {description && (
                                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                            )}
                            {trend && (
                                <div className="flex items-center gap-1 mt-2">
                                    <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">{trend.label}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
