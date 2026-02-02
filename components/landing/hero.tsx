"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Trophy, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Enhanced Background with image */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-[40%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
        <div className="absolute -bottom-[20%] right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-accent/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm w-fit"
            >
              <Sparkles className="h-4 w-4" />
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Открыт набор на 2025 год
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Образование{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    нового поколения
                  </span>
                </span>
              </h1>

              <p className="max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
                Современная платформа для обучения с интерактивными лекциями, лабораторными работами и уникальной системой
                оценки знаний
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register" className="flex-1 sm:flex-initial">
                <Button size="lg" className="h-12 w-full sm:w-auto px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                  Начать обучение
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="lg" className="h-12 w-full sm:w-auto px-8 text-base font-semibold bg-background/50 backdrop-blur-sm hover:bg-background">
                  Узнать больше
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-border/40"
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold">50+</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Курсов</span>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 backdrop-blur-sm">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold">1000+</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Студентов</span>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 backdrop-blur-sm">
                    <Trophy className="h-5 w-5 text-success" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold">95%</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Успешность</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              {/* Image with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                alt="Students learning together"
                fill
                className="object-cover"
                priority
              />
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 left-6 z-20 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-md p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <Trophy className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Высокое качество</p>
                    <p className="text-xs text-muted-foreground">Современные методики</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute top-6 right-6 z-20 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-md p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <p className="text-sm font-semibold">Доступно онлайн</p>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section >
  )
}
