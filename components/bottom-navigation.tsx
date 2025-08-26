"use client"

import { Home, MessageCircle, Star, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "messages", icon: MessageCircle, label: "Mensajes" },
    { id: "group", icon: null, label: "Mi grupo", isGroupProfile: true },
    { id: "activity", icon: Star, label: "Actividad" },
    { id: "events", icon: Calendar, label: "Eventos" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-end justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id

          if (item.isGroupProfile) {
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center relative -mt-4",
                  "transition-all duration-200",
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full border-3 overflow-hidden",
                    "bg-gradient-to-br from-primary to-accent",
                    isActive ? "border-primary scale-110" : "border-muted-foreground/30",
                  )}
                >
                  <img src="/group-profile-avatar.png" alt="Mi grupo" className="w-full h-full object-cover" />
                </div>
                <span className={cn("text-xs mt-1 font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </button>
            )
          }

          const Icon = item.icon!
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 min-w-[60px]",
                "transition-all duration-200",
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
