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

    const { title, description, event_date, location, location_link, ticket_link, flyer_url, visibility, group_id } =
      await request.json()

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

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        event_date,
        location,
        location_link,
        ticket_link,
        flyer_url,
        visibility,
        group_id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const group_id = searchParams.get("group_id")
    const visibility = searchParams.get("visibility")

    let query = supabase
      .from("events")
      .select(`
        *,
        groups (
          id,
          name,
          avatar_url
        )
      `)
      .order("event_date", { ascending: true })

    if (group_id) {
      query = query.eq("group_id", group_id)
    }

    if (visibility) {
      query = query.eq("visibility", visibility)
    }

    const { data: events, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
