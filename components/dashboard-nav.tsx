"use client"

import Link from "next/link"
import { Zap, ExternalLink, LogOut, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/store"

export function DashboardNav() {
  const { state, logout, toggleDarkMode } = useAppState()
  const username = state.currentUser?.username || ""

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              LinkMe
            </span>
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            / Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-8 w-8 p-0"
            aria-label="Toggle dark mode"
          >
            {state.darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {username && (
            <Link href={`/${username}`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-transparent"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">View Profile</span>
              </Button>
            </Link>
          )}
          {(state.currentUser?.role === "admin" || state.currentUser?.is_admin) && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-1.5">
                Admin
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-1.5 text-muted-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
