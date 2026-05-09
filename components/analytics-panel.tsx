"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Eye, MousePointerClick, Users, TrendingUp, Loader2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkStat {
  id: string
  label: string
  platform: string
  clicks: number
}

interface AnalyticsData {
  totalVisits: number
  totalClicks: number
  uniqueVisitors: number
  visitsByDay: Record<string, number>
  clicksByDay: Record<string, number>
  linkStats: LinkStat[]
}

const platformColors: Record<string, string> = {
  linkedin: "bg-[#0077b5]",
  facebook: "bg-[#1877f2]",
  messenger: "bg-[#0084ff]",
  whatsapp: "bg-[#25d366]",
  instagram: "bg-[#e4405f]",
  twitter: "bg-[#1da1f2]",
  tiktok: "bg-neutral-800",
  youtube: "bg-[#ff0000]",
  github: "bg-neutral-700",
  telegram: "bg-[#0088cc]",
  website: "bg-blue-500",
  email: "bg-red-500",
  phone: "bg-green-600",
  viber: "bg-[#7360f2]",
  custom: "bg-gray-500",
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  accent: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MiniBarChart({
  data,
  color,
}: {
  data: Record<string, number>
  color: string
}) {
  const entries = Object.entries(data)
  if (entries.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    )
  }

  const maxVal = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex h-36 items-end gap-1">
      {entries.map(([day, count]) => (
        <div key={day} className="group flex flex-1 flex-col items-center gap-1">
          <div className="relative w-full">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">
              {count}
            </div>
            <div
              className={cn("mx-auto w-full max-w-[20px] rounded-t transition-all", color)}
              style={{ height: `${Math.max((count / maxVal) * 100, 4)}%` }}
            />
          </div>
          <span className="w-full truncate text-center text-[9px] text-muted-foreground">
            {day.replace(",", "")}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          setError("Failed to load analytics")
        }
      } catch {
        setError("Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">{error || "No analytics data"}</p>
        </CardContent>
      </Card>
    )
  }

  const ctr = data.totalVisits > 0
    ? ((data.totalClicks / data.totalVisits) * 100).toFixed(1)
    : "0"

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Profile Views"
          value={data.totalVisits}
          icon={Eye}
          accent="bg-blue-600"
        />
        <StatCard
          label="Link Clicks"
          value={data.totalClicks}
          icon={MousePointerClick}
          accent="bg-emerald-600"
        />
        <StatCard
          label="Unique Visitors"
          value={data.uniqueVisitors}
          icon={Users}
          accent="bg-amber-600"
        />
        <StatCard
          label="Click Rate"
          value={Number.parseFloat(ctr)}
          icon={TrendingUp}
          accent="bg-rose-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile Views (Last 30 Days)</CardTitle>
            <CardDescription className="text-xs">
              How many times your profile page was viewed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MiniBarChart data={data.visitsByDay} color="bg-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Link Clicks (Last 30 Days)</CardTitle>
            <CardDescription className="text-xs">
              How many times your links were clicked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MiniBarChart data={data.clicksByDay} color="bg-emerald-500" />
          </CardContent>
        </Card>
      </div>

      {/* Link Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Link Performance</CardTitle>
          <CardDescription className="text-xs">
            Click count for each of your links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.linkStats.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <MousePointerClick className="h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                No link clicks yet. Share your profile to start tracking!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.linkStats.map((link, i) => {
                const maxClicks = data.linkStats[0]?.clicks || 1
                const pct = Math.max((link.clicks / maxClicks) * 100, 2)
                return (
                  <div key={link.id} className="flex items-center gap-3">
                    <span className="w-5 text-right text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            platformColors[link.platform] || "bg-gray-400"
                          )} />
                          <span className="text-sm font-medium text-foreground">
                            {link.label}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {link.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-1.5 rounded-full transition-all",
                            platformColors[link.platform] || "bg-gray-400"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
