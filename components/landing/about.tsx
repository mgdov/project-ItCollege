"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Award, Users, BookOpen, Target } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

const benefits = [
  "Лекции и лабораторные работы онлайн",
  "Интерактивные задания по математике",
  "Программирование с онлайн-компилятором",
  "Игровая система для физкультуры",
  "Автоматический расчёт успеваемости",
  "Система экзаменов и зачётов",
]

const stats = [
  {
    icon: Award,
    value: "95%",
    label: "Успешность",
    color: "text-primary",
  },
  {
    icon: Users,
    value: "1000+",
    label: "Студентов",
    color: "text-accent",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "Курсов",
    color: "text-chart-3",
  },
  {
    icon: Target,
    value: "100%",
    label: "Онлайн",
    color: "text-success",
  },
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-border/40 py-16 md:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
                alt="Online learning platform"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />

              {/* Floating Stats Cards */}
              <div className="absolute inset-0 p-6">
                <div className="grid grid-cols-2 gap-3 h-full">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className={`${index === 0 ? 'self-start' : index === 1 ? 'self-start' : index === 2 ? 'self-end' : 'self-end'}`}
                    >
                      <Card className="border-border/50 bg-background/90 backdrop-blur-md p-4 shadow-xl">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                О платформе
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Платформа, которая делает обучение{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  эффективным
                </span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Наша образовательная платформа объединяет все необходимые инструменты для качественного обучения: от
                просмотра лекций до интерактивных лабораторных работ и игровых элементов.
              </p>
            </div>

            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-6"
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-2xl font-bold text-primary">АНО</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Автономная некоммерческая организация</h3>
                    <p className="text-sm text-muted-foreground">
                      Качественное образование, доступное каждому
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
