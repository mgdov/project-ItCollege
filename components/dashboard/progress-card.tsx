"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface ProgressCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description?: string
  color?: string
}

export function ProgressCard({ title, value, icon, description, color = "bg-primary" }: ProgressCardProps) {
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
          <div className="mb-2 flex items-baseline gap-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
              {value}
            </motion.span>
            <span className="text-xl font-medium text-muted-foreground">%</span>
          </div>
          <Progress value={value} className="h-2" indicatorClassName={color} />
          {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
