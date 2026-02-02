"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { LineChart as LineChartIcon, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { studentStore, useStore } from "@/lib/store"
import { EmptyState } from "@/components/shared"

export function GradesChart() {
  const grades = useStore(studentStore, (state) => state.grades)

  // Prepare chart data from grades
  const gradesData = grades.map((grade, index) => ({
    subject: grade.subject.substring(0, 7) + (grade.subject.length > 7 ? '.' : ''),
    grade: grade.grade,
    color: `hsl(var(--chart-${(index % 5) + 1}))`,
  }))

  const average = grades.length > 0
    ? (grades.reduce((sum, item) => sum + item.grade, 0) / grades.length).toFixed(1)
    : "0"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Успеваемость по предметам</CardTitle>
                <CardDescription>Текущий семестр</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-success" />
                Средний
              </div>
              <div className="text-2xl font-bold">{average}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <EmptyState
              title="Нет оценок"
              description="Оценки появятся после подключения к серверу"
            />
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "600" }}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar dataKey="grade" radius={[8, 8, 0, 0]}>
                    {gradesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
