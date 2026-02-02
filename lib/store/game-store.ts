import { createStore } from './create-store'
import type { GameState, GameType, Difficulty } from './types'
import { saveGameScore, getBestScore } from '../scoring'

const initialBestScores = {
    chess: { easy: 0, medium: 0, hard: 0 },
    checkers: { easy: 0, medium: 0, hard: 0 },
    millionaire: { easy: 0, medium: 0, hard: 0 },
    memory: { easy: 0, medium: 0, hard: 0 },
    words: { easy: 0, medium: 0, hard: 0 },
}

export const gameStore = createStore<GameState>((set, get) => ({
    currentGame: null,
    difficulty: 'medium',
    score: 0,
    isPlaying: false,
    isPaused: false,
    timeElapsed: 0,
    bestScores: initialBestScores,
    stats: {
        gamesPlayed: 0,
        totalScore: 0,
    },

    startGame: (gameType: GameType, difficulty: Difficulty) => {
        set({
            currentGame: gameType,
            difficulty,
            score: 0,
            isPlaying: true,
            isPaused: false,
            timeElapsed: 0,
        })
    },

    endGame: (finalScore: number) => {
        const state = get()
        if (state.currentGame && state.difficulty) {
            // Save score
            saveGameScore(state.currentGame, finalScore, state.difficulty)

            // Update best score if needed
            const currentBest = state.bestScores[state.currentGame][state.difficulty]
            if (finalScore > currentBest) {
                set({
                    bestScores: {
                        ...state.bestScores,
                        [state.currentGame]: {
                            ...state.bestScores[state.currentGame],
                            [state.difficulty]: finalScore,
                        },
                    },
                })
            }
        }

        set({ isPlaying: false, isPaused: false })
    },

    pauseGame: () => {
        set({ isPaused: true })
    },

    resumeGame: () => {
        set({ isPaused: false })
    },

    updateScore: (score: number) => {
        set({ score })
    },

    updateTime: (time: number) => {
        set({ timeElapsed: time })
    },

    loadBestScores: () => {
        const games: GameType[] = ['chess', 'checkers', 'millionaire', 'memory', 'words']
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

        const bestScores = { ...initialBestScores }

        games.forEach((game) => {
            difficulties.forEach((difficulty) => {
                const score = getBestScore(game, difficulty)
                if (score > 0) {
                    bestScores[game][difficulty] = score
                }
            })
        })

        set({ bestScores })
    },

    resetGame: () => {
        set({
            currentGame: null,
            difficulty: 'medium',
            score: 0,
            isPlaying: false,
            isPaused: false,
            timeElapsed: 0,
        })
    },
}))

// Load best scores on initialization
if (typeof window !== 'undefined') {
    gameStore.getState().loadBestScores()
}
