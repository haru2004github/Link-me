import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  if (!profile.published) {
    return NextResponse.json(
      { error: "This profile is not published yet" },
      { status: 404 }
    )
  }

  const { data: links } = await supabase
    .from("social_links")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("enabled", true)
    .order("sort_order", { ascending: true })

  // Increment profile views
  await supabase
    .from("profiles")
    .update({ profile_views: (profile.profile_views || 0) + 1 })
    .eq("id", profile.id)

  return NextResponse.json({
    ...profile,
    links: links || [],
  })
}
