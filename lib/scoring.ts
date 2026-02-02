/**
 * Система начисления и хранения баллов для игр
 */

export interface GameScore {
    game: string
    score: number
    difficulty?: "easy" | "medium" | "hard"
    timestamp: number
}

export interface PlayerStats {
    totalScore: number
    gamesPlayed: number
    history: GameScore[]
}

const STORAGE_KEY = "online-learning-game-scores"

/**
 * Получить все статистику игрока
 */
export function getPlayerStats(): PlayerStats {
    if (typeof window === "undefined") {
        return { totalScore: 0, gamesPlayed: 0, history: [] }
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (!data) {
            return { totalScore: 0, gamesPlayed: 0, history: [] }
        }
        return JSON.parse(data)
    } catch (error) {
        console.error("Ошибка при загрузке статистики:", error)
        return { totalScore: 0, gamesPlayed: 0, history: [] }
    }
}

/**
 * Сохранить баллы за игру
 */
export function saveGameScore(game: string, score: number, difficulty?: "easy" | "medium" | "hard"): PlayerStats {
    const stats = getPlayerStats()

    const newScore: GameScore = {
        game,
        score,
        difficulty,
        timestamp: Date.now(),
    }

    stats.history.push(newScore)
    stats.totalScore += score
    stats.gamesPlayed += 1

    // Сохраняем только последние 100 игр
    if (stats.history.length > 100) {
        stats.history = stats.history.slice(-100)
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    } catch (error) {
        console.error("Ошибка при сохранении статистики:", error)
    }

    return stats
}

/**
 * Получить баллы за конкретную игру
 */
export function getGameScores(gameName: string): GameScore[] {
    const stats = getPlayerStats()
    return stats.history.filter((score) => score.game === gameName)
}

/**
 * Получить лучший результат для игры
 */
export function getBestScore(gameName: string, difficulty?: "easy" | "medium" | "hard"): number {
    const scores = getGameScores(gameName)
    const filtered = difficulty ? scores.filter((s) => s.difficulty === difficulty) : scores

    if (filtered.length === 0) return 0
    return Math.max(...filtered.map((s) => s.score))
}

/**
 * Очистить всю статистику
 */
export function clearAllStats(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY)
    }
}

/**
 * Получить общий рейтинг по играм
 */
export function getGameRankings(): { game: string; totalScore: number; bestScore: number; plays: number }[] {
    const stats = getPlayerStats()
    const gameMap = new Map<string, { total: number; best: number; count: number }>()

    for (const score of stats.history) {
        const current = gameMap.get(score.game) || { total: 0, best: 0, count: 0 }
        current.total += score.score
        current.best = Math.max(current.best, score.score)
        current.count += 1
        gameMap.set(score.game, current)
    }

    return Array.from(gameMap.entries())
        .map(([game, data]) => ({
            game,
            totalScore: data.total,
            bestScore: data.best,
            plays: data.count,
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
}

/**
 * Рассчитать баллы на основе сложности и результата
 */
export function calculateScore(
    baseScore: number,
    difficulty: "easy" | "medium" | "hard",
    multiplier: number = 1,
): number {
    const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2,
    }

    return Math.round(baseScore * difficultyMultiplier[difficulty] * multiplier)
}
