"use client"

import React from "react"

import { useAppState } from "@/lib/store"
import { THEME_CONFIGS, type ThemeId } from "@/lib/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, Lock, Sun, Moon, Sparkles, Crown, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type CategoryFilter = "all" | "light" | "dark" | "gradient" | "premium"

const CATEGORY_TABS: { id: CategoryFilter; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { id: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
  { id: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
  { id: "gradient", label: "Gradient", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "premium", label: "Premium", icon: <Crown className="h-3.5 w-3.5" /> },
]

function ThemeMiniPreview({ themeId }: { themeId: ThemeId }) {
  const config = THEME_CONFIGS.find((t) => t.id === themeId)
  if (!config) return null
  const t = config.colors

  return (
    <div
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-lg overflow-hidden",
        t.bg
      )}
    >
      {/* Mini avatar */}
      <div className={cn("h-7 w-7 rounded-full", t.avatarBg)} />
      {/* Mini name bar */}
      <div className={cn("h-1.5 w-16 rounded-full opacity-80", t.text === "text-white" ? "bg-white/70" : "bg-gray-600/40")} />
      <div className={cn("h-1 w-10 rounded-full opacity-50", t.text === "text-white" ? "bg-white/50" : "bg-gray-500/30")} />
      {/* Mini buttons */}
      <div className="mt-1 flex gap-1.5">
        <div className={cn("h-4 w-14 rounded", t.btnBg, "flex items-center justify-center")}>
          <span className="text-[5px] font-bold opacity-80">Save</span>
        </div>
        <div className={cn("h-4 w-14 rounded border", t.btnOutline, "flex items-center justify-center")}>
          <span className="text-[5px] font-bold opacity-80">Share</span>
        </div>
      </div>
      {/* Mini link rows */}
      <div className="mt-1 flex w-4/5 flex-col gap-1">
        <div className={cn("h-3 w-full rounded border", t.linkBg)} />
        <div className={cn("h-3 w-full rounded border", t.linkBg)} />
      </div>
    </div>
  )
}

export function ThemeSelector() {
  const { state, setState } = useAppState()
  const user = state.currentUser
  const [filter, setFilter] = useState<CategoryFilter>("all")
  if (!user) return null

  const isPro = user.role === "pro" || user.role === "admin"

  const selectTheme = (themeId: ThemeId) => {
    const theme = THEME_CONFIGS.find((t) => t.id === themeId)
    if (theme?.pro && !isPro) return

    setState((prev) => ({
      ...prev,
      currentUser: prev.currentUser
        ? { ...prev.currentUser, theme: themeId }
        : null,
    }))
  }

  const updateCustomColor = (color: string) => {
    setState((prev) => ({
      ...prev,
      currentUser: prev.currentUser
        ? { ...prev.currentUser, custom_color: color }
        : null,
    }))
  }

  const filteredThemes = filter === "all"
    ? THEME_CONFIGS
    : THEME_CONFIGS.filter((t) => t.category === filter)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Theme</CardTitle>
          <CardDescription>
            Choose how your public profile looks ({THEME_CONFIGS.length} templates available)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  filter === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "all" && (
                  <span className="ml-0.5 rounded-full bg-primary-foreground/20 px-1.5 text-[10px]">
                    {THEME_CONFIGS.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
            {filteredThemes.map((theme) => {
              const isSelected = user.theme === theme.id
              const isLocked = theme.pro && !isPro
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => selectTheme(theme.id)}
                  disabled={isLocked}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:shadow-lg",
                    isLocked && "cursor-not-allowed opacity-60"
                  )}
                >
                  {/* Theme Mini Preview */}
                  <ThemeMiniPreview themeId={theme.id} />

                  {/* Info */}
                  <div className="flex w-full items-start justify-between p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {theme.name}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    {isLocked && !isSelected && (
                      <Badge variant="secondary" className="ml-2 flex-shrink-0 gap-0.5 px-1.5 py-0.5 text-[10px]">
                        <Lock className="h-2.5 w-2.5" />
                        Pro
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Color Picker */}
      {user.theme === "custom" && isPro && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brand Color</CardTitle>
            <CardDescription>
              Pick your primary brand color for your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customColor">Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="customColor"
                    value={user.custom_color || "#3b82f6"}
                    onChange={(e) => updateCustomColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-border"
                  />
                  <Input
                    value={user.custom_color || "#3b82f6"}
                    onChange={(e) => updateCustomColor(e.target.value)}
                    className="w-32"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div
                className="ml-auto h-16 w-16 rounded-xl shadow-inner"
                style={{ backgroundColor: user.custom_color || "#3b82f6" }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Badge */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {"Current Plan: "}
              <span className="capitalize text-primary">{user.role}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {isPro
                ? "You have access to all themes"
                : "Upgrade to Pro to unlock premium themes"}
            </p>
          </div>
          {!isPro && (
            <Badge className="bg-accent text-accent-foreground">
              Upgrade
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
