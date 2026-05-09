"use client"

import { useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AppContext, DEFAULT_APP_STATE } from "@/lib/store"
import type { AppState } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_APP_STATE)
  const router = useRouter()
  const pathname = usePathname()

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile")
      if (res.ok) {
        const profile = await res.json()
        setState((prev) => ({
          ...prev,
          currentUser: profile,
          loading: false,
        }))
      } else {
        setState((prev) => ({ ...prev, currentUser: null, loading: false }))
      }
    } catch {
      setState((prev) => ({ ...prev, currentUser: null, loading: false }))
    }
  }, [])

  const saveProfile = useCallback(async (): Promise<{
    success: boolean
    error?: string
  }> => {
    if (!state.currentUser) return { success: false, error: "No profile found" }
    setState((prev) => ({ ...prev, saving: true }))
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: state.currentUser.full_name,
          username: state.currentUser.username,
          job_title: state.currentUser.job_title,
          organization: state.currentUser.organization,
          bio: state.currentUser.bio,
          avatar_url: state.currentUser.avatar_url,
          phone: state.currentUser.phone,
          email: state.currentUser.email,
          website: state.currentUser.website,
          location: state.currentUser.location,
          theme: state.currentUser.theme,
          custom_color: state.currentUser.custom_color,
          links: state.currentUser.links,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        return { success: false, error: data.error || "Save failed" }
      }
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Save failed",
      }
    } finally {
      setState((prev) => ({ ...prev, saving: false }))
    }
  }, [state.currentUser])

  const publishProfile = useCallback(
    async (
      published: boolean
    ): Promise<{ success: boolean; error?: string }> => {
      if (!state.currentUser)
        return { success: false, error: "No profile found" }
      try {
        const res = await fetch("/api/profile/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published }),
        })
        if (!res.ok) {
          const data = await res.json()
          return { success: false, error: data.error || "Publish failed" }
        }
        setState((prev) => ({
          ...prev,
          currentUser: prev.currentUser
            ? { ...prev.currentUser, published }
            : null,
        }))
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Publish failed",
        }
      }
    },
    [state.currentUser]
  )

  const toggleDarkMode = useCallback(() => {
    setState((prev) => {
      const newDark = !prev.darkMode
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", newDark)
        localStorage.setItem("linkme-dark-mode", newDark ? "1" : "0")
      }
      return { ...prev, darkMode: newDark }
    })
  }, [])

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("linkme-dark-mode")
      if (saved === "1") {
        document.documentElement.classList.add("dark")
        setState((prev) => ({ ...prev, darkMode: true }))
      }
    }
  }, [])

  const logout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setState((prev) => ({ ...prev, currentUser: null }))
    router.push("/")
    router.refresh()
  }, [router])

  useEffect(() => {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin")
    ) {
      refreshProfile()
    } else {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [pathname, refreshProfile])

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        saveProfile,
        publishProfile,
        refreshProfile,
        toggleDarkMode,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
