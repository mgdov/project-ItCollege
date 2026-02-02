import type { Difficulty } from '@/lib/store'

export interface Question {
    question: string
    options: string[]
    correct: number
    prize: number
}

export const questionsData: Record<Difficulty, Question[]> = {
    easy: [
        {
            question: "Сколько планет в Солнечной системе?",
            options: ["7", "8", "9", "10"],
            correct: 1,
            prize: 500,
        },
        {
            question: "Кто написал 'Евгений Онегин'?",
            options: ["Лермонтов", "Пушкин", "Гоголь", "Толстой"],
            correct: 1,
            prize: 1000,
        },
        {
            question: "Какой химический элемент обозначается как 'Fe'?",
            options: ["Фтор", "Железо", "Фосфор", "Франций"],
            correct: 1,
            prize: 2000,
        },
        {
            question: "Какой город является столицей России?",
            options: ["Санкт-Петербург", "Москва", "Казань", "Новосибирск"],
            correct: 1,
            prize: 5000,
        },
        {
            question: "Сколько дней в году?",
            options: ["365", "366", "364", "360"],
            correct: 0,
            prize: 10000,
        },
    ],
    medium: [
        {
            question: "Какой город является столицей Австралии?",
            options: ["Сидней", "Мельбурн", "Канберра", "Перт"],
            correct: 2,
            prize: 500,
        },
        {
            question: "В каком году началась Первая мировая война?",
            options: ["1912", "1914", "1916", "1918"],
            correct: 1,
            prize: 1000,
        },
        {
            question: "Какая река самая длинная в мире?",
            options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"],
            correct: 1,
            prize: 2000,
        },
        {
            question: "Сколько костей в теле взрослого человека?",
            options: ["186", "206", "226", "246"],
            correct: 1,
            prize: 5000,
        },
        {
            question: "Кто изобрёл телефон?",
            options: ["Эдисон", "Тесла", "Белл", "Маркони"],
            correct: 2,
            prize: 10000,
        },
        {
            question: "В каком году был основан Google?",
            options: ["1996", "1998", "2000", "2002"],
            correct: 1,
            prize: 25000,
        },
        {
            question: "Какое озеро самое глубокое в мире?",
            options: ["Байкал", "Танганьика", "Виктория", "Мичиган"],
            correct: 0,
            prize: 50000,
        },
        {
            question: "Какая планета самая большая в Солнечной системе?",
            options: ["Юпитер", "Сатурн", "Уран", "Нептун"],
            correct: 0,
            prize: 100000,
        },
    ],
    hard: [
        {
            question: "Кто открыл закон всемирного тяготения?",
            options: ["Галилей", "Ньютон", "Кеплер", "Коперник"],
            correct: 1,
            prize: 500,
        },
        {
            question: "В каком году был подписан Версальский мирный договор?",
            options: ["1918", "1919", "1920", "1921"],
            correct: 1,
            prize: 1000,
        },
        {
            question: "Какой элемент имеет атомный номер 79?",
            options: ["Серебро", "Платина", "Золото", "Ртуть"],
            correct: 2,
            prize: 2000,
        },
        {
            question: "Кто написал 'Божественную комедию'?",
            options: ["Петрарка", "Боккаччо", "Данте", "Ариосто"],
            correct: 2,
            prize: 5000,
        },
        {
            question: "В каком году Юрий Гагарин совершил первый полёт в космос?",
            options: ["1959", "1961", "1963", "1965"],
            correct: 1,
            prize: 10000,
        },
        {
            question: "Какая скорость света в вакууме (км/с)?",
            options: ["299792", "300000", "301000", "298000"],
            correct: 0,
            prize: 25000,
        },
        {
            question: "Кто является автором теории относительности?",
            options: ["Планк", "Бор", "Эйнштейн", "Хокинг"],
            correct: 2,
            prize: 50000,
        },
        {
            question: "Сколько хромосом в клетке человека?",
            options: ["44", "46", "48", "50"],
            correct: 1,
            prize: 100000,
        },
        {
            question: "В каком году пала Римская империя?",
            options: ["410", "455", "476", "493"],
            correct: 2,
            prize: 250000,
        },
        {
            question: "Какая постоянная Планка (h)?",
            options: ["6.626×10⁻³⁴", "6.674×10⁻³⁴", "6.022×10²³", "3.141"],
            correct: 0,
            prize: 500000,
        },
        {
            question: "Кто доказал последнюю теорему Ферма?",
            options: ["Гаусс", "Эйлер", "Уайлс", "Перельман"],
            correct: 2,
            prize: 1000000,
        },
    ],
}

export function formatPrize(prize: number): string {
    if (prize >= 1000000) {
        return `${(prize / 1000000).toFixed(1)}M₽`
    }
    if (prize >= 1000) {
        return `${(prize / 1000).toFixed(0)}K₽`
    }
    return `${prize}₽`
}

export function useFiftyFifty(question: Question, hiddenOptions: number[]): number[] {
    if (hiddenOptions.length > 0) return hiddenOptions

    const incorrectOptions = question.options
        .map((_, index) => index)
        .filter(index => index !== question.correct)

    // Remove 2 random incorrect answers
    const toHide = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2)
    return toHide
}

export function simulateAudience(correctAnswer: number): number[] {
    const votes = [0, 0, 0, 0]

    // Audience is 60-80% correct
    const correctPercentage = 60 + Math.random() * 20
    votes[correctAnswer] = Math.floor(correctPercentage)

    // Distribute remaining votes
    const remaining = 100 - votes[correctAnswer]
    const otherIndices = [0, 1, 2, 3].filter(i => i !== correctAnswer)

    otherIndices.forEach((index, i) => {
        if (i === otherIndices.length - 1) {
            votes[index] = 100 - votes.reduce((sum, v) => sum + v, 0)
        } else {
            votes[index] = Math.floor(Math.random() * remaining / 2)
        }
    })

    return votes
}
