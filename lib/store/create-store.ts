import { useEffect, useState, useSyncExternalStore } from 'react'
import type { StoreApi, StateCreator } from './types'

export function createStore<T extends object>(createState: StateCreator<T>): StoreApi<T> {
    let state: T
    const listeners = new Set<(state: T, prevState: T) => void>()

    const setState: StoreApi<T>['setState'] = (partial) => {
        const nextState =
            typeof partial === 'function'
                ? { ...state, ...(partial as (state: T) => Partial<T>)(state) }
                : { ...state, ...partial }

        if (!Object.is(nextState, state)) {
            const previousState = state
            state = nextState
            listeners.forEach((listener) => listener(state, previousState))
        }
    }

    const getState: StoreApi<T>['getState'] = () => state

    const subscribe: StoreApi<T>['subscribe'] = (listener) => {
        listeners.add(listener)
        return () => listeners.delete(listener)
    }

    const destroy: StoreApi<T>['destroy'] = () => {
        listeners.clear()
    }

    const api = { setState, getState, subscribe, destroy }
    state = createState(setState, getState, api)

    return api
}

export function useStore<T extends object, U>(
    api: StoreApi<T>,
    selector: (state: T) => U = (state) => state as unknown as U
): U {
    const getSnapshot = () => selector(api.getState())
    const getServerSnapshot = () => selector(api.getState())

    return useSyncExternalStore(api.subscribe, getSnapshot, getServerSnapshot)
}

// Helper hook for entire store
export function useStoreAll<T extends object>(api: StoreApi<T>): T {
    return useStore(api, (state) => state)
}
