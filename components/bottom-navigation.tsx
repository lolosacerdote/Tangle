"use client"

import { Home, MessageCircle, Star, Calendar, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface UserGroup {
  id: string
  name: string
  avatar_url: string | null
  role: string
}

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  currentGroup: UserGroup | null
  userGroups: UserGroup[]
  onGroupChange: (group: UserGroup) => void
}

export function BottomNavigation({
  activeSection,
  onSectionChange,
  currentGroup,
  userGroups,
  onGroupChange,
}: BottomNavigationProps) {
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false)

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
              <div key={item.id} className="flex flex-col items-center">
                <Popover open={groupPopoverOpen} onOpenChange={setGroupPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex flex-col items-center justify-center relative -mt-4",
                        "transition-all duration-200",
                      )}
                    >
                      <div
                        className={cn(
                          "w-14 h-14 rounded-full border-3 overflow-hidden relative",
                          "bg-gradient-to-br from-primary to-accent",
                          isActive ? "border-primary scale-110" : "border-muted-foreground/30",
                        )}
                      >
                        <img
                          src={currentGroup?.avatar_url || "/placeholder.svg?height=56&width=56"}
                          alt="Mi grupo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <ChevronUp className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                      <span
                        className={cn("text-xs mt-1 font-medium", isActive ? "text-primary" : "text-muted-foreground")}
                      >
                        {item.label}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="center" side="top">
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Cambiar grupo</div>
                      {userGroups.map((group) => (
                        <Button
                          key={group.id}
                          variant={currentGroup?.id === group.id ? "secondary" : "ghost"}
                          className="w-full justify-start h-auto p-2"
                          onClick={() => {
                            onGroupChange(group)
                            setGroupPopoverOpen(false)
                            onSectionChange(item.id)
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent p-0.5">
                              <img
                                src={group.avatar_url || "/placeholder.svg?height=32&width=32"}
                                alt={group.name}
                                className="w-full h-full rounded-full object-cover bg-background"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">{group.name}</div>
                              <div className="text-xs text-muted-foreground capitalize">{group.role}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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
