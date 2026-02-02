"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, FlaskConical, Video } from "lucide-react"
import { motion } from "framer-motion"
import { studentStore, useStore } from "@/lib/store"
import { EmptyState } from "@/components/shared"

export function UpcomingClasses() {
  const schedule = useStore(studentStore, (state) => state.schedule)

  // Get today's classes
  const today = new Date().toISOString().split('T')[0]
  const todaysClasses = schedule.filter(item => item.date === today)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Ближайшие занятия</CardTitle>
              <CardDescription>Сегодня, {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysClasses.length === 0 ? (
            <EmptyState
              title="Нет занятий"
              description="Расписание появится после подключения к серверу"
            />
          ) : (
            todaysClasses.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-gradient-to-r from-muted/30 to-transparent p-4 transition-all hover:border-primary/50 hover:shadow-md hover:from-primary/5"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${item.type === "lecture" ? "bg-primary/10" : "bg-accent/10"
                    }`}
                >
                  {item.type === "lecture" ? (
                    <BookOpen className="h-6 w-6 text-primary" />
                  ) : (
                    <FlaskConical className="h-6 w-6 text-accent" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{item.subject}</p>
                    <Badge variant={item.type === "lecture" ? "default" : "secondary"} className="text-xs">
                      {item.type === "lecture" ? "ЛК" : "ЛЗ"}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      {item.room}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.teacher}</p>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
