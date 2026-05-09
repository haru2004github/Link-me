import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total visits
    const { count: totalVisits } = await supabase
      .from("profile_visits")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id)

    // Get visits by day (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: visitRows } = await supabase
      .from("profile_visits")
      .select("visited_at")
      .eq("profile_id", user.id)
      .gte("visited_at", thirtyDaysAgo.toISOString())
      .order("visited_at", { ascending: true })

    // Group visits by day
    const visitsByDay: Record<string, number> = {}
    for (const row of visitRows || []) {
      const day = new Date(row.visited_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      visitsByDay[day] = (visitsByDay[day] || 0) + 1
    }

    // Get link clicks with link info
    const { data: userLinks } = await supabase
      .from("social_links")
      .select("id, label, platform")
      .eq("profile_id", user.id)

    const linkStats = []
    for (const link of userLinks || []) {
      const { count } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("link_id", link.id)

      linkStats.push({
        id: link.id,
        label: link.label,
        platform: link.platform,
        clicks: count || 0,
      })
    }

    // Total clicks
    const { count: totalClicks } = await supabase
      .from("link_clicks")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id)

    // Get clicks by day (last 30 days)
    const { data: clickRows } = await supabase
      .from("link_clicks")
      .select("clicked_at")
      .eq("profile_id", user.id)
      .gte("clicked_at", thirtyDaysAgo.toISOString())
      .order("clicked_at", { ascending: true })

    const clicksByDay: Record<string, number> = {}
    for (const row of clickRows || []) {
      const day = new Date(row.clicked_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      clicksByDay[day] = (clicksByDay[day] || 0) + 1
    }

    // Unique visitors (by IP)
    const { data: uniqueIps } = await supabase
      .from("profile_visits")
      .select("visitor_ip")
      .eq("profile_id", user.id)

    const uniqueVisitors = new Set((uniqueIps || []).map((r) => r.visitor_ip)).size

    return NextResponse.json({
      totalVisits: totalVisits || 0,
      totalClicks: totalClicks || 0,
      uniqueVisitors,
      visitsByDay,
      clicksByDay,
      linkStats: linkStats.sort((a, b) => b.clicks - a.clicks),
    })
  } catch (err) {
    console.error("Analytics error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
