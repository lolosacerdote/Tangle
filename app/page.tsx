"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeSection } from "@/components/sections/home-section"
import { MessagesSection } from "@/components/sections/messages-section"
import { GroupProfileSection } from "@/components/sections/group-profile-section"
import { ActivitySection } from "@/components/sections/activity-section"
import { EventsSection } from "@/components/sections/events-section"

export default function TangleApp() {
  const [activeSection, setActiveSection] = useState("home")

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection />
      case "messages":
        return <MessagesSection />
      case "group":
        return <GroupProfileSection />
      case "activity":
        return <ActivitySection />
      case "events":
        return <EventsSection />
      default:
        return <HomeSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="h-screen overflow-hidden">{renderSection()}</main>
      <BottomNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  )
}
