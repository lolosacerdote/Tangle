"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Edit3, Star, Users, MessageCircle, Clock } from "lucide-react"

interface Chat {
  id: number
  name: string
  avatar: string
  type: "private" | "community"
  lastMessage: string
  lastMessageTime: string
  note?: {
    text: string
    expiresAt: Date
  }
  unreadCount?: number
  participants?: string[]
}

interface Note {
  id: number
  text: string
  createdAt: Date
  expiresAt: Date
}

interface MessagesSectionProps {
  currentGroupId: string
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "Los Aventureros",
    avatar: "/placeholder.svg?key=chat1",
    type: "private",
    lastMessage: "¿Listos para el senderismo del sábado?",
    lastMessageTime: "hace 10min",
    note: {
      text: "¡En la montaña! 🏔️",
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Comunidad Foodies",
    avatar: "/placeholder.svg?key=chat2",
    type: "community",
    lastMessage: "Nuevo restaurante italiano en el centro",
    lastMessageTime: "hace 1h",
    participants: ["Foodies Unidos", "Chefs Caseros", "Gourmets"],
    unreadCount: 5,
  },
  {
    id: 3,
    name: "Gamers Nocturnos",
    avatar: "/placeholder.svg?key=chat3",
    type: "private",
    lastMessage: "¿Jugamos esta noche?",
    lastMessageTime: "hace 3h",
    note: {
      text: "Online hasta tarde 🎮",
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  },
]

export function MessagesSection({ currentGroupId }: MessagesSectionProps) {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [searchQuery, setSearchQuery] = useState("")
  const [noteText, setNoteText] = useState("")
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showCommunityDialog, setCommunityDialog] = useState(false)
  const [communityName, setCommunityName] = useState("")

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const createNote = async () => {
    if (noteText.trim() && noteText.length <= 80) {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: noteText,
            group_id: currentGroupId,
          }),
        })

        if (response.ok) {
          console.log("Note created successfully")
          setNoteText("")
          setShowNoteDialog(false)
          // TODO: Refresh notes display
        }
      } catch (error) {
        console.error("Error creating note:", error)
      }
    }
  }

  const createCommunity = () => {
    if (communityName.trim()) {
      const newCommunity: Chat = {
        id: Date.now(),
        name: communityName,
        avatar: "/placeholder.svg?key=newcom",
        type: "community",
        lastMessage: "Comunidad creada",
        lastMessageTime: "ahora",
        participants: ["Mi Grupo"],
      }
      setChats([newCommunity, ...chats])
      setCommunityName("")
      setCommunityDialog(false)
    }
  }

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <h1 className="text-xl font-bold text-primary">Mensajes</h1>
      </header>

      {/* Action Bar */}
      <div className="border-b border-border bg-background sticky top-[60px] z-30 p-4">
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar grupos o comunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Edit3 className="w-4 h-4" />
                Nota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nota</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="¿Qué está haciendo tu grupo?"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    maxLength={80}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{noteText.length}/80 caracteres • Dura 24 horas</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createNote} disabled={!noteText.trim()} className="flex-1">
                    Publicar Nota
                  </Button>
                  <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCommunityDialog} onOpenChange={setCommunityDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Star className="w-4 h-4" />
                Comunidad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Comunidad</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Nombre de la comunidad"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Las comunidades permiten chats entre múltiples grupos
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createCommunity} disabled={!communityName.trim()} className="flex-1">
                    Crear Comunidad
                  </Button>
                  <Button variant="outline" onClick={() => setCommunityDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Display Section */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Notas Activas</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {chats
              .filter((chat) => chat.note)
              .map((chat) => (
                <div key={chat.id} className="flex-shrink-0 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary p-0.5">
                      <div className="w-full h-full rounded-full bg-background p-0.5">
                        <img
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full max-w-[100px] truncate shadow-lg">
                      {chat.note?.text}
                    </div>
                  </div>
                  <p className="text-xs text-center mt-3 text-muted-foreground max-w-[64px] truncate">{chat.name}</p>
                </div>
              ))}
            {chats.filter((chat) => chat.note).length === 0 && (
              <p className="text-sm text-muted-foreground">No hay notas activas</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {filteredChats.length > 0 ? (
          <div className="p-4 space-y-3">
            {filteredChats.map((chat) => (
              <Card key={chat.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                      <img
                        src={chat.avatar || "/placeholder.svg"}
                        alt={chat.name}
                        className="w-full h-full rounded-full object-cover bg-background"
                      />
                    </div>
                    {chat.unreadCount && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                      {chat.type === "community" && <Users className="w-4 h-4 text-accent flex-shrink-0" />}
                    </div>

                    {chat.type === "community" && chat.participants && (
                      <p className="text-xs text-muted-foreground mb-1">{chat.participants.join(", ")}</p>
                    )}

                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>

                    {chat.note && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Nota expira en {formatTimeRemaining(chat.note.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-xs text-muted-foreground flex-shrink-0">{chat.lastMessageTime}</div>
                </div>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full pb-20 px-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No se encontraron resultados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No hay grupos o comunidades que coincidan con "{searchQuery}"
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Limpiar búsqueda
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-20 px-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">¡Conecta con otros grupos!</h3>
              <p className="text-sm text-muted-foreground mb-6 text-balance">
                Encuentra grupos afines y crea comunidades para compartir experiencias increíbles
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button onClick={() => setCommunityDialog(true)} className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Crear comunidad
                </Button>
                <Button variant="outline" onClick={() => setSearchQuery("")} className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Buscar grupos
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
