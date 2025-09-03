"use client"

import { useState, useEffect } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeSection } from "@/components/sections/home-section"
import { MessagesSection } from "@/components/sections/messages-section"
import { GroupProfileSection } from "@/components/sections/group-profile-section"
import { ActivitySection } from "@/components/sections/activity-section"
import { EventsSection } from "@/components/sections/events-section"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { loadActiveGroup, saveActiveGroup } from "@/lib/persist"


interface UserGroup {
  id: string
  name: string
  avatar_url: string | null
  role: string
}

export default function TangleApp() {
  const [activeSection, setActiveSection] = useState("home")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [currentGroup, setCurrentGroup] = useState<UserGroup | null>(null)

  useEffect(() => {
    const cached = loadActiveGroup();
    if (cached) setCurrentGroup(cached as any);
  }, []);

  useEffect(() => {
    if (currentGroup) saveActiveGroup(currentGroup as any);
  }, [currentGroup]);

  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: memberships } = await supabase
        .from("group_members")
        .select(`
          role,
          groups (
            id,
            name,
            avatar_url
          )
        `)
        .eq("user_id", user.id)

      if (!memberships || memberships.length === 0) {
        router.push("/onboarding")
        return
      }

      const groups = (memberships ?? []).map((m: any) => ({
        id: m?.groups?.id,
        name: m?.groups?.name,
        avatar_url: m?.groups?.avatar_url ?? null,
      }));


      setUserGroups(groups)
      setCurrentGroup(groups[0]) // Default to first group
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Tangle</div>
      </div>
    )
  }

  const renderSection = () => {
    if (!currentGroup) return null

    switch (activeSection) {
      case "home":
        return <HomeSection currentGroupId={currentGroup.id} />
      case "messages":
        return <MessagesSection currentGroupId={currentGroup.id} />
      case "group":
        return <GroupProfileSection currentGroupId={currentGroup.id} />
      case "activity":
        return <ActivitySection currentGroupId={currentGroup.id} />
      case "events":
        return <EventsSection currentGroupId={currentGroup.id} />
      default:
        return <HomeSection currentGroupId={currentGroup.id} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="h-screen overflow-hidden">{renderSection()}</main>
      <BottomNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        currentGroup={currentGroup}
        userGroups={userGroups}
        onGroupChange={setCurrentGroup}
      />
    </div>
  )
}
