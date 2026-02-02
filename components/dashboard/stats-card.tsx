"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    positive: boolean
  }
}

export function StatsCard({ title, value, icon, description, trend }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
        {/* Background gradient */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent" />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-lg bg-primary/10 p-2">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {trend && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-sm font-semibold ${trend.positive ? "text-success" : "text-destructive"}`}
              >
                {trend.positive ? "+" : "-"}
                {trend.value}%
              </motion.span>
            )}
          </div>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
