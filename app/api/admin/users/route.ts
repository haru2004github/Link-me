import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") return null
  return user
}

export async function GET() {
  const supabase = await createClient()
  const user = await verifyAdmin(supabase)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Use admin client to bypass RLS and fetch all profiles
  const adminClient = createAdminClient()
  const { data: profiles, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profiles || [])
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const user = await verifyAdmin(supabase)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { userId, role } = await request.json()

  if (!["admin", "pro", "free"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  // Use admin client to bypass RLS for updating other users' profiles
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
