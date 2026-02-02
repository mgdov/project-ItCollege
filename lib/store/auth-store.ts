import { createStore } from './create-store'
import type { AuthState, User } from './types'

export const authStore = createStore<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
            // TODO: Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const user: User = {
                id: '1',
                name: 'Иван Петров',
                email,
                role: email.includes('admin') ? 'admin' : 'student',
            }

            set({ user, isAuthenticated: true, isLoading: false })
            localStorage.setItem('user', JSON.stringify(user))
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    register: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
            // TODO: Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const user: User = {
                id: Date.now().toString(),
                name,
                email,
                role: 'student',
            }

            set({ user, isAuthenticated: true, isLoading: false })
            localStorage.setItem('user', JSON.stringify(user))
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false })
        localStorage.removeItem('user')
    },

    setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
    },
}))

// Initialize from localStorage
if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser)
            authStore.setState({ user, isAuthenticated: true })
        } catch (e) {
            // Invalid data
        }
    }
}
