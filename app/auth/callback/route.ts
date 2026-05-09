import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user profile exists, if not create one
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single()

        if (!existingProfile) {
          // Create profile for new Google sign-in users
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            ""
          const email = user.email || ""
          // Generate a username from email or name
          const baseUsername = (
            email.split("@")[0] ||
            fullName.toLowerCase().replace(/[^a-z0-9]/g, "")
          ).slice(0, 20)

          // Check if username exists and make it unique
          let username = baseUsername
          let attempt = 0
          let usernameExists = true
          while (usernameExists) {
            const { data: existing } = await supabase
              .from("profiles")
              .select("username")
              .eq("username", username)
              .maybeSingle()
            if (!existing) {
              usernameExists = false
            } else {
              attempt++
              username = `${baseUsername}${attempt}`
            }
          }

          await supabase.from("profiles").insert({
            id: user.id,
            full_name: fullName,
            username,
            email,
            avatar_url: user.user_metadata?.avatar_url || "",
            role: "free",
            theme: "minimal-light",
            published: false,
          })
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
