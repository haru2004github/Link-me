import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { link_id, profile_id } = await request.json()
    if (!link_id || !profile_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("link_clicks").insert({
      link_id,
      profile_id,
      visitor_ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    })

    if (error) {
      console.error("Click tracking error:", error)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
