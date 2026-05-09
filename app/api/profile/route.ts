import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET current user's profile with links
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const { data: links, error: linksError } = await supabase
    .from("social_links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true })

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 })
  }

  return NextResponse.json({
    ...profile,
    links: (links || []).map((link: { id: string; platform: string; label: string; url: string; icon: string; enabled: boolean; sort_order: number }) => ({
      ...link,
      id: link.id,
    })),
    is_admin: profile.role === "admin",
  })
}

// PUT update current user's profile
export async function PUT(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { links, ...profileData } = body

  // Update profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: profileData.full_name,
      username: profileData.username,
      job_title: profileData.job_title,
      organization: profileData.organization,
      bio: profileData.bio,
      avatar_url: profileData.avatar_url,
      phone: profileData.phone,
      email: profileData.email,
      website: profileData.website,
      location: profileData.location,
      theme: profileData.theme,
      custom_color: profileData.custom_color,
    })
    .eq("id", user.id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Update links - delete all existing and re-insert
  if (links !== undefined) {
    await supabase.from("social_links").delete().eq("profile_id", user.id)

    if (links.length > 0) {
      const linksToInsert = links.map(
        (link: {
          platform: string
          label: string
          url: string
          icon: string
          enabled: boolean
        }, index: number) => ({
          profile_id: user.id,
          platform: link.platform,
          label: link.label,
          url: link.url,
          icon: link.icon,
          enabled: link.enabled,
          sort_order: index,
        })
      )

      const { error: linksError } = await supabase
        .from("social_links")
        .insert(linksToInsert)

      if (linksError) {
        return NextResponse.json(
          { error: linksError.message },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ success: true })
}
