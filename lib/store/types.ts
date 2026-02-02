// Core types for store system
export type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void
export type GetState<T> = () => T
export type Subscribe<T> = (listener: (state: T, prevState: T) => void) => () => void

export interface StoreApi<T> {
    getState: GetState<T>
    setState: SetState<T>
    subscribe: Subscribe<T>
    destroy: () => void
}

export type StateCreator<T> = (
    set: SetState<T>,
    get: GetState<T>,
    api: StoreApi<T>
) => T

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard'

// Game types
export type GameType = 'chess' | 'checkers' | 'millionaire' | 'memory' | 'words'

// User roles
export type UserRole = 'student' | 'admin' | 'teacher'

// Auth state
export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    setUser: (user: User | null) => void
}

// Game state
export interface GameScore {
    gameType: GameType
    score: number
    difficulty: Difficulty
    date: Date
    timeSpent?: number
}

export interface GameStats {
    gamesPlayed: number
    totalScore: number
}

export interface GameState {
    currentGame: GameType | null
    difficulty: Difficulty
    score: number
    isPlaying: boolean
    isPaused: boolean
    timeElapsed: number
    bestScores: Record<GameType, Record<Difficulty, number>>
    stats: GameStats

    startGame: (gameType: GameType, difficulty: Difficulty) => void
    endGame: (finalScore: number) => void
    pauseGame: () => void
    resumeGame: () => void
    updateScore: (score: number) => void
    updateTime: (time: number) => void
    loadBestScores: () => void
    resetGame: () => void
}

// Student data
export interface Grade {
    id: string
    subject: string
    grade: number
    date: string
    teacher: string
}

export interface Lecture {
    id: string
    title: string
    subject: string
    date: string
    duration: number
    description: string
    materials?: string[]
}

export interface Schedule {
    id: string
    day: string
    lessons: {
        time: string
        subject: string
        teacher: string
        room: string
        type: string
    }[]
}

export interface StudentProfile {
    name: string
    email: string
    phone: string
    group: string
    course: number
    specialty: string
    averageGrade: number
    progress: number
    completedCourses: number
    totalCourses: number
    address: string
    enrollmentDate: string
}

export interface StudentState {
    profile: StudentProfile | null
    grades: Grade[]
    lectures: Lecture[]
    schedule: Schedule[]
    exams: any[]
    isLoading: boolean

    loadProfile: () => Promise<void>
    loadGrades: () => Promise<void>
    loadLectures: () => Promise<void>
    loadSchedule: () => Promise<void>
    loadExams: () => Promise<void>
    updateProfile: (profile: Partial<StudentProfile>) => void
}

// Admin data
export interface Student {
    id: string
    name: string
    email: string
    group: string
    course: number
    averageGrade: number
}

export interface Group {
    id: string
    name: string
    course: number
    studentsCount: number
    specialty: string
}

export interface Subject {
    id: string
    name: string
    teacher: string
    hours: number
    semester: number
}

export interface Exam {
    id: string
    subject: string
    date: string
    time: string
    room: string
    teacher: string
    groups: string[]
}

export interface AdminStats {
    totalStudents: number
    totalGroups: number
    totalSubjects: number
    totalTeachers: number
    averageGrade: number
    attendance: number
}

export interface AdminState {
    students: Student[]
    groups: Group[]
    subjects: Subject[]
    exams: Exam[]
    schedule: Schedule[]
    stats: AdminStats | null
    isLoading: boolean

    loadStudents: () => Promise<void>
    loadGroups: () => Promise<void>
    loadSubjects: () => Promise<void>
    loadExams: () => Promise<void>
    loadSchedule: () => Promise<void>
    loadStats: () => Promise<void>

    addStudent: (student: Omit<Student, 'id'>) => void
    updateStudent: (id: string, student: Partial<Student>) => void
    deleteStudent: (id: string) => void

    addGroup: (group: Omit<Group, 'id'>) => void
    updateGroup: (id: string, group: Partial<Group>) => void
    deleteGroup: (id: string) => void

    addSubject: (subject: Omit<Subject, 'id'>) => void
    updateSubject: (id: string, subject: Partial<Subject>) => void
    deleteSubject: (id: string) => void

    addExam: (exam: Omit<Exam, 'id'>) => void
    updateExam: (id: string, exam: Partial<Exam>) => void
    deleteExam: (id: string) => void
}
