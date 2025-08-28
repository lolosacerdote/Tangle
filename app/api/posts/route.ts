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

    const { content, image_url, group_id } = await request.json()

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

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        content,
        image_url,
        group_id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const group_id = searchParams.get("group_id")

    let query = supabase
      .from("posts")
      .select(`
        *,
        groups (
          id,
          name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false })

    if (group_id) {
      query = query.eq("group_id", group_id)
    }

    const { data: posts, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
