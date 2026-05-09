import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { profile_id } = await request.json()
    if (!profile_id) {
      return NextResponse.json({ error: "Missing profile_id" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("profile_visits").insert({
      profile_id,
      visitor_ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      referrer: request.headers.get("referer") || null,
    })

    if (error) {
      console.error("Visit tracking error:", error)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
