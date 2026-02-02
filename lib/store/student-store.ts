import { createStore } from './create-store'
import type { StudentState, StudentProfile, Grade, Lecture, Schedule } from './types'

export const studentStore = createStore<StudentState>((set, get) => ({
    profile: null,
    grades: [],
    lectures: [],
    schedule: [],
    exams: [],
    isLoading: false,

    // API methods - ready for backend integration
    fetchProfile: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/student/profile')
            // const profile = await response.json()
            // set({ profile })
        } catch (error) {
            console.error('Failed to fetch profile:', error)
        }
    },

    fetchGrades: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/student/grades')
            // const grades = await response.json()
            // set({ grades })
        } catch (error) {
            console.error('Failed to fetch grades:', error)
        }
    },

    fetchLectures: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/student/lectures')
            // const lectures = await response.json()
            // set({ lectures })
        } catch (error) {
            console.error('Failed to fetch lectures:', error)
        }
    },

    fetchSchedule: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/student/schedule')
            // const schedule = await response.json()
            // set({ schedule })
        } catch (error) {
            console.error('Failed to fetch schedule:', error)
        }
    },

    fetchExams: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/student/exams')
            // const exams = await response.json()
            // set({ exams })
        } catch (error) {
            console.error('Failed to fetch exams:', error)
        }
    },

    updateGrade: (grade: Grade) => {
        const currentGrades = get().grades
        set({ grades: [...currentGrades, grade] })
    },

    updateProfile: (profileUpdate: Partial<StudentProfile>) => {
        const currentProfile = get().profile
        if (currentProfile) {
            set({ profile: { ...currentProfile, ...profileUpdate } })
        }
    },
}))
