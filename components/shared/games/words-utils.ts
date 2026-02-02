import type { Difficulty } from '@/lib/store'

export interface WordData {
    word: string
    hint: string
}

export const wordsData: Record<Difficulty, WordData[]> = {
    easy: [
        { word: "СТОЛ", hint: "Мебель для работы" },
        { word: "КНИГА", hint: "Источник знаний" },
        { word: "УЧЕБА", hint: "Процесс получения знаний" },
        { word: "ШКОЛА", hint: "Учебное заведение" },
        { word: "УРОК", hint: "Занятие в школе" },
        { word: "ГОРОД", hint: "Населенный пункт" },
        { word: "НЕБО", hint: "Над головой" },
        { word: "МОРЕ", hint: "Большой водоем" },
    ],
    medium: [
        { word: "ПРОГРАММА", hint: "Набор инструкций для компьютера" },
        { word: "СТУДЕНТ", hint: "Учащийся вуза" },
        { word: "КОМПЬЮТЕР", hint: "Электронное устройство" },
        { word: "МАТЕМАТИКА", hint: "Наука о числах" },
        { word: "ОБРАЗОВАНИЕ", hint: "Процесс получения знаний" },
        { word: "ЛИТЕРАТУРА", hint: "Искусство слова" },
        { word: "ГЕОГРАФИЯ", hint: "Наука о Земле" },
    ],
    hard: [
        { word: "ПРОГРАММИРОВАНИЕ", hint: "Процесс создания программ" },
        { word: "УНИВЕРСИТЕТ", hint: "Высшее учебное заведение" },
        { word: "ИНФОРМАТИКА", hint: "Наука об информации" },
        { word: "АЛГОРИТМ", hint: "Последовательность действий" },
        { word: "ЭНЦИКЛОПЕДИЯ", hint: "Справочное издание" },
        { word: "АРХИТЕКТУРА", hint: "Искусство строительства" },
    ],
}

export function shuffleArray(array: string[]): string[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function calculateWordsScore(
    correctWords: number,
    totalWords: number,
    timeElapsed: number,
    difficulty: Difficulty
): number {
    const baseScore = correctWords * 100
    const completionBonus = correctWords === totalWords ? 500 : 0
    const timeBonus = Math.max(0, 300 - timeElapsed)
    const diffMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2

    return Math.floor((baseScore + completionBonus + timeBonus) * diffMultiplier)
}
