import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { image_url, group_id } = await request.json()

    // Verify user is member of the group
    const { data: membership } = await supabase
      .from("group_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("group_id", group_id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this group" }, { status: 403 })
    }

    // Stories expire after 24 hours
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const { data: story, error } = await supabase
      .from("stories")
      .insert({
        image_url,
        group_id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error("Story creation error:", error)
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    // Only get non-expired stories
    const { data: stories, error } = await supabase
      .from("stories")
      .select(`
        *,
        groups (
          id,
          name,
          avatar_url
        )
      `)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(stories)
  } catch (error) {
    console.error("Stories fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}
