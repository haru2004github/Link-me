"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "@/lib/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Eye, UserPlus, Users, TrendingUp, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsOverview() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users")
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalViews = users.reduce((sum, u) => sum + (u.profile_views || 0), 0)
  const totalSaves = users.reduce(
    (sum, u) => sum + (u.contact_saves || 0),
    0
  )
  const totalUsers = users.length
  const conversionRate =
    totalViews > 0 ? ((totalSaves / totalViews) * 100).toFixed(1) : "0"

  const userViewsData = users
    .filter((u) => u.full_name)
    .map((u) => ({
      name: (u.full_name || "").split(" ")[0],
      views: u.profile_views || 0,
      saves: u.contact_saves || 0,
    }))

  const roleData = [
    {
      name: "Pro",
      value: users.filter((u) => u.role === "pro").length,
    },
    {
      name: "Free",
      value: users.filter((u) => u.role === "free").length,
    },
    {
      name: "Admin",
      value: users.filter((u) => u.role === "admin").length,
    },
  ].filter((d) => d.value > 0)

  const COLORS = [
    "hsl(221, 83%, 53%)",
    "hsl(220, 9%, 46%)",
    "hsl(164, 76%, 46%)",
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Profile Views",
            value: totalViews.toLocaleString(),
            icon: Eye,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "Contact Saves",
            value: totalSaves.toLocaleString(),
            icon: UserPlus,
            color: "text-accent",
            bgColor: "bg-accent/10",
          },
          {
            label: "Total Users",
            value: totalUsers.toString(),
            icon: Users,
            color: "text-foreground",
            bgColor: "bg-secondary",
          },
          {
            label: "Conversion Rate",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            color: "text-accent",
            bgColor: "bg-accent/10",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Per-User Performance</CardTitle>
            <CardDescription>
              Individual profile views and contact saves
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userViewsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userViewsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(220, 9%, 46%)" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(220, 9%, 46%)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="views"
                    fill="hsl(221, 83%, 53%)"
                    radius={[4, 4, 0, 0]}
                    name="Views"
                  />
                  <Bar
                    dataKey="saves"
                    fill="hsl(164, 76%, 46%)"
                    radius={[4, 4, 0, 0]}
                    name="Saves"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Distribution</CardTitle>
            <CardDescription>Breakdown by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            {roleData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {roleData.map((_, index) => (
                        <Cell
                          key={`cell-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: chart cells
                            index
                          }`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-col gap-2">
                  {roleData.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-muted-foreground">
                          {entry.name}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                No users yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
