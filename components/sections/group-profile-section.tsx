"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Clock, MapPin, Users, Calendar, Heart, MessageCircle, Settings } from "lucide-react"

interface GroupPost {
  id: number
  image: string
  likes: number
  comments: number
  type: "post" | "story"
}

interface GroupEvent {
  id: number
  title: string
  date: string
  type: "upcoming" | "past"
  attendees: number
}

const mockGroupData = {
  name: "Los Aventureros",
  description:
    "Grupo de amigos apasionados por la naturaleza, el senderismo y las aventuras al aire libre. Siempre listos para explorar nuevos lugares y vivir experiencias únicas juntos.",
  zones: "Buenos Aires, Córdoba, Mendoza",
  avatar: "/placeholder.svg?key=groupavatar",
  coverImage: "/placeholder.svg?key=groupcover",
  memberCount: 8,
  isAdmin: true,
}

const mockPosts: GroupPost[] = [
  { id: 1, image: "/placeholder.svg?key=post1", likes: 24, comments: 8, type: "post" },
  { id: 2, image: "/placeholder.svg?key=post2", likes: 31, comments: 12, type: "post" },
  { id: 3, image: "/placeholder.svg?key=post3", likes: 18, comments: 5, type: "post" },
  { id: 4, image: "/placeholder.svg?key=post4", likes: 42, comments: 15, type: "post" },
  { id: 5, image: "/placeholder.svg?key=post5", likes: 27, comments: 9, type: "post" },
  { id: 6, image: "/placeholder.svg?key=post6", likes: 35, comments: 11, type: "post" },
]

const mockEvents: GroupEvent[] = [
  { id: 1, title: "Senderismo en Bariloche", date: "2024-03-20", type: "upcoming", attendees: 15 },
  { id: 2, title: "Camping en Córdoba", date: "2024-03-25", type: "upcoming", attendees: 8 },
  { id: 3, title: "Escalada en Mendoza", date: "2024-02-15", type: "past", attendees: 12 },
]

const featuredStories = [
  { id: 1, title: "Bariloche", image: "/placeholder.svg?key=story1" },
  { id: 2, title: "Córdoba", image: "/placeholder.svg?key=story2" },
  { id: 3, title: "Mendoza", image: "/placeholder.svg?key=story3" },
  { id: 4, title: "Aventuras", image: "/placeholder.svg?key=story4" },
]

export function GroupProfileSection() {
  const [groupData, setGroupData] = useState(mockGroupData)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    name: groupData.name,
    description: groupData.description,
    zones: groupData.zones,
  })

  const handleSaveEdit = () => {
    setGroupData({ ...groupData, ...editForm })
    setShowEditDialog(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Mi Grupo</h1>
          {groupData.isAdmin && (
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Grupo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre del grupo</label>
                    <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Zonas</label>
                    <Input
                      value={editForm.zones}
                      onChange={(e) => setEditForm({ ...editForm, zones: e.target.value })}
                      placeholder="Ej: Buenos Aires, Córdoba, Mendoza"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descripción</label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} className="flex-1">
                      Guardar cambios
                    </Button>
                    <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-br from-primary to-accent">
          <img
            src={groupData.coverImage || "/placeholder.svg"}
            alt="Portada del grupo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent p-1">
              <img
                src={groupData.avatar || "/placeholder.svg"}
                alt={groupData.name}
                className="w-full h-full rounded-full object-cover bg-background"
              />
            </div>
          </div>

          {/* Group Details */}
          <div className="space-y-3">
            <div>
              <h2 className="text-2xl font-bold">{groupData.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">{groupData.memberCount} miembros</span>
              </div>
            </div>

            {groupData.zones && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{groupData.zones}</span>
              </div>
            )}

            <p className="text-sm text-balance leading-relaxed">{groupData.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button className="flex-1 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Subir publicación
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Clock className="w-4 h-4" />
              Subir historia
            </Button>
          </div>
        </div>

        {/* Featured Stories */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Historias destacadas</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {featuredStories.map((story) => (
              <div key={story.id} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                  <div className="w-full h-full rounded-full bg-background p-0.5">
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs mt-1 text-muted-foreground max-w-[64px] truncate">{story.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Publicaciones</h3>
          <div className="grid grid-cols-3 gap-1">
            {mockPosts.map((post) => (
              <div key={post.id} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={`Publicación ${post.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex items-center gap-4 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="px-4">
          <h3 className="text-lg font-semibold mb-3">Eventos del grupo</h3>
          <div className="space-y-3">
            {mockEvents.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                      <span>•</span>
                      <Users className="w-3 h-3" />
                      <span>{event.attendees} asistentes</span>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      event.type === "upcoming" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {event.type === "upcoming" ? "Próximo" : "Pasado"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
