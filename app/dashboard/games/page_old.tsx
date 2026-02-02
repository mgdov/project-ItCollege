"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Cpu, ArrowRight, Gamepad2, Target, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const games = [
  {
    id: "chess",
    title: "Шахматы",
    description: "Классическая стратегическая игра",
    icon: "♟️",
    players: "1-2 игрока",
    difficulty: "Средне",
    href: "/dashboard/games/chess",
    color: "bg-chart-1/10",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400",
  },
  {
    id: "checkers",
    title: "Шашки",
    description: "Логическая настольная игра",
    icon: "⚫",
    players: "1-2 игрока",
    difficulty: "Легко",
    href: "/dashboard/games/checkers",
    color: "bg-chart-2/10",
    image: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400",
  },
  {
    id: "words",
    title: "Игра в слова",
    description: "Составляйте слова из букв",
    icon: "📝",
    players: "1 игрок",
    difficulty: "Легко",
    href: "/dashboard/games/words",
    color: "bg-chart-3/10",
    image: "https://images.unsplash.com/photo-1632501641765-e568d52b5c3e?w=400",
  },
  {
    id: "millionaire",
    title: "Кто хочет стать миллионером",
    description: "Отвечайте на вопросы и выигрывайте",
    icon: "💰",
    players: "1 игрок",
    difficulty: "Средне",
    href: "/dashboard/games/millionaire",
    color: "bg-chart-4/10",
    image: "https://images.unsplash.com/photo-1554224311-beee2afa5128?w=400",
  },
  {
    id: "memory",
    title: "Мемори",
    description: "Найдите одинаковые карточки",
    icon: "🎴",
    players: "1 игрок",
    difficulty: "Легко",
    href: "/dashboard/games/memory",
    color: "bg-chart-5/10",
    image: "https://images.unsplash.com/photo-1611271860500-1dc7ae1257c9?w=400",
  },
]

export default function GamesPage() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200"
            alt="Games"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        </div>
        <div className="relative px-6 py-12 md:px-8 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Физкультура</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Интерактивные игры для развития логики, мышления и стратегического планирования
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm p-4"
            >
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-xs text-muted-foreground">Игр доступно</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm p-4"
            >
              <div className="text-2xl font-bold text-accent">124</div>
              <div className="text-xs text-muted-foreground">Игры сыграно</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm p-4"
            >
              <div className="text-2xl font-bold text-warning">2500</div>
              <div className="text-xs text-muted-foreground">Рейтинг</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Game Modes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Cpu className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Игра с компьютером</h3>
              <p className="text-sm text-muted-foreground">Тренируйтесь против ИИ</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Игра с учениками</h3>
              <p className="text-sm text-muted-foreground">Соревнуйтесь с одногруппниками</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10">
              <Trophy className="h-7 w-7 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold">Турниры</h3>
              <p className="text-sm text-muted-foreground">Участвуйте в соревнованиях</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Games Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="group border-border/50 transition-all hover:border-primary/50 hover:shadow-xl overflow-hidden h-full">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className={`absolute top-4 right-4 flex h-14 w-14 items-center justify-center rounded-xl ${game.color} backdrop-blur-sm border border-border/50 text-3xl`}>
                  {game.icon}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-3">
                  <Badge variant="secondary" className="bg-muted">
                    <Users className="h-3 w-3 mr-1" />
                    {game.players}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={game.difficulty === "Легко" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}
                  >
                    <Target className="h-3 w-3 mr-1" />
                    {game.difficulty}
                  </Badge>
                </div>
                <Link href={game.href}>
                  <Button className="w-full gap-2 transition-transform group-hover:translate-x-1">
                    Играть
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="mt-8 border-border/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-warning/10 to-warning/5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-warning" />
              Таблица лидеров
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { rank: 1, name: "Иванов И.", score: 2500, game: "Шахматы" },
                { rank: 2, name: "Петров П.", score: 2350, game: "Миллионер" },
                { rank: 3, name: "Сидоров С.", score: 2200, game: "Шашки" },
                { rank: 4, name: "Козлов К.", score: 2100, game: "Слова" },
                { rank: 5, name: "Смирнов С.", score: 2000, game: "Мемори" },
              ].map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 hover:bg-muted/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${player.rank === 1
                        ? "bg-warning/20 text-warning border-2 border-warning/50"
                        : player.rank === 2
                          ? "bg-muted-foreground/20 text-muted-foreground border-2 border-muted-foreground/50"
                          : player.rank === 3
                            ? "bg-chart-4/20 text-chart-4 border-2 border-chart-4/50"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                    >
                      {player.rank}
                    </span>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        {player.game}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{player.score}</span>
                    <p className="text-xs text-muted-foreground">очков</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
