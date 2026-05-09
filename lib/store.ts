"use client"

import React from "react"

import { createContext, useContext } from "react"
import type { UserProfile } from "./types"

export interface AppState {
  currentUser: UserProfile | null
  loading: boolean
  saving: boolean
  darkMode: boolean
}

export const DEFAULT_APP_STATE: AppState = {
  currentUser: null,
  loading: true,
  saving: false,
  darkMode: false,
}

export const AppContext = createContext<{
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  saveProfile: () => Promise<{ success: boolean; error?: string }>
  publishProfile: (published: boolean) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
  toggleDarkMode: () => void
  logout: () => Promise<void>
}>({
  state: DEFAULT_APP_STATE,
  setState: () => {},
  saveProfile: async () => ({ success: false }),
  publishProfile: async () => ({ success: false }),
  refreshProfile: async () => {},
  toggleDarkMode: () => {},
  logout: async () => {},
})

export function useAppState() {
  return useContext(AppContext)
}
