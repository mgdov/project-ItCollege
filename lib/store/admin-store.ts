import { createStore } from './create-store'
import type {
    AdminState,
    Student,
    Group,
    Subject,
    Exam,
    Schedule,
    AdminStats
} from './types'

export const adminStore = createStore<AdminState>((set, get) => ({
    students: [],
    groups: [],
    subjects: [],
    exams: [],
    schedule: [],
    stats: null,
    isLoading: false,

    // API methods - ready for backend integration
    fetchStudents: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/students')
            // const students = await response.json()
            // set({ students })
        } catch (error) {
            console.error('Failed to fetch students:', error)
        }
    },

    fetchGroups: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/groups')
            // const groups = await response.json()
            // set({ groups })
        } catch (error) {
            console.error('Failed to fetch groups:', error)
        }
    },

    fetchSubjects: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/subjects')
            // const subjects = await response.json()
            // set({ subjects })
        } catch (error) {
            console.error('Failed to fetch subjects:', error)
        }
    },

    fetchExams: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/exams')
            // const exams = await response.json()
            // set({ exams })
        } catch (error) {
            console.error('Failed to fetch exams:', error)
        }
    },

    fetchSchedule: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/schedule')
            // const schedule = await response.json()
            // set({ schedule })
        } catch (error) {
            console.error('Failed to fetch schedule:', error)
        }
    },

    fetchStats: async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/stats')
            // const stats = await response.json()
            // set({ stats })
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        }
    },

    // CRUD operations
    addStudent: (student: Student) => {
        set({ students: [...get().students, student] })
    },

    updateStudent: (student: Student) => {
        set({
            students: get().students.map((s) =>
                s.id === student.id ? student : s
            ),
        })
    },

    deleteStudent: (id: string) => {
        set({ students: get().students.filter((s) => s.id !== id) })
    },

    addGroup: (group: Group) => {
        set({ groups: [...get().groups, group] })
    },

    updateGroup: (group: Group) => {
        set({
            groups: get().groups.map((g) =>
                g.id === group.id ? group : g
            ),
        })
    },

    deleteGroup: (id: string) => {
        set({ groups: get().groups.filter((g) => g.id !== id) })
    },

    addSubject: (subject: Subject) => {
        set({ subjects: [...get().subjects, subject] })
    },

    updateSubject: (subject: Subject) => {
        set({
            subjects: get().subjects.map((s) =>
                s.id === subject.id ? subject : s
            ),
        })
    },

    deleteSubject: (id: string) => {
        set({ subjects: get().subjects.filter((s) => s.id !== id) })
    },

    addExam: (exam: Exam) => {
        set({ exams: [...get().exams, exam] })
    },

    updateExam: (exam: Exam) => {
        set({
            exams: get().exams.map((e) =>
                e.id === exam.id ? exam : e
            ),
        })
    },

    deleteExam: (id: string) => {
        set({ exams: get().exams.filter((e) => e.id !== id) })
    },

    addScheduleItem: (item: Schedule) => {
        set({ schedule: [...get().schedule, item] })
    },

    updateScheduleItem: (item: Schedule) => {
        set({
            schedule: get().schedule.map((s) =>
                s.id === item.id ? item : s
            ),
        })
    },

    deleteScheduleItem: (id: string) => {
        set({ schedule: get().schedule.filter((s) => s.id !== id) })
    },
}))
