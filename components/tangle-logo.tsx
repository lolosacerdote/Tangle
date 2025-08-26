"use client"
import { ChevronDown, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockGroups = [
  { id: 1, name: "Los Aventureros", avatar: "/placeholder.svg?key=group1" },
  { id: 2, name: "Foodies Unidos", avatar: "/placeholder.svg?key=group2" },
  { id: 3, name: "Gamers Nocturnos", avatar: "/placeholder.svg?key=group3" },
]

export function TangleLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-primary">Tangle</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Mis Grupos</div>
            {mockGroups.map((group) => (
              <DropdownMenuItem key={group.id} className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                  <img
                    src={group.avatar || "/placeholder.svg"}
                    alt={group.name}
                    className="w-full h-full rounded-full object-cover bg-background"
                  />
                </div>
                <span className="font-medium">{group.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>Unirse a grupo</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>Crear grupo</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">U</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Mi Cuenta</DropdownMenuItem>
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Cerrar Sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
