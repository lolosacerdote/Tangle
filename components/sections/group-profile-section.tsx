"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadDialog } from "@/components/upload-dialog"
import { Camera, Clock, MapPin, Users, Calendar, Heart, MessageCircle, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface GroupData {
  id: string
  name: string
  description: string | null
  zones: string | null
  avatar_url: string | null
  cover_url: string | null
  member_count: number
  user_role: string
}

interface GroupPost {
  id: string
  image_url: string | null
  likes_count: number
  comments_count: number
  created_at: string
}

interface GroupEvent {
  id: string
  title: string
  event_date: string
  visibility: string
}

interface GroupProfileProps {
  currentGroupId: string
}

export function GroupProfileSection({ currentGroupId }: GroupProfileProps) {
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [posts, setPosts] = useState<GroupPost[]>([])
  const [events, setEvents] = useState<GroupEvent[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"post" | "story" | "event">("post")
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    zones: "",
  })

  useEffect(() => {
    loadGroupData()
  }, [currentGroupId])

  const loadGroupData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get group data with member count and user role
      const { data: groupInfo } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner (
            role
          )
        `)
        .eq("id", currentGroupId)
        .eq("group_members.user_id", user.id)
        .single()

      if (groupInfo) {
        // Get member count
        const { count: memberCount } = await supabase
          .from("group_members")
          .select("*", { count: "exact", head: true })
          .eq("group_id", currentGroupId)

        setGroupData({
          ...groupInfo,
          member_count: memberCount || 0,
          user_role: groupInfo.group_members[0]?.role || "member",
        })

        setEditForm({
          name: groupInfo.name || "",
          description: groupInfo.description || "",
          zones: groupInfo.zones || "",
        })
      }

      // Get group posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("group_id", currentGroupId)
        .order("created_at", { ascending: false })

      if (postsData) {
        setPosts(postsData)
      }

      // Get group events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("group_id", currentGroupId)
        .order("event_date", { ascending: false })

      if (eventsData) {
        setEvents(eventsData)
      }

      // Get group stories (non-expired)
      const { data: storiesData } = await supabase
        .from("stories")
        .select("*")
        .eq("group_id", currentGroupId)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })

      if (storiesData) {
        setStories(storiesData)
      }
    } catch (error) {
      console.error("Error loading group data:", error)
      toast.error("Error al cargar los datos del grupo")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("groups")
        .update({
          name: editForm.name,
          description: editForm.description,
          zones: editForm.zones,
        })
        .eq("id", currentGroupId)

      if (error) throw error

      toast.success("Grupo actualizado exitosamente")
      setShowEditDialog(false)
      loadGroupData()
    } catch (error) {
      console.error("Error updating group:", error)
      toast.error("Error al actualizar el grupo")
    }
  }

  const openUploadDialog = (type: "post" | "story" | "event") => {
    setUploadType(type)
    setUploadDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
          <h1 className="text-xl font-bold text-primary">Mi Grupo</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!groupData) {
    return (
      <div className="flex flex-col h-full">
        <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
          <h1 className="text-xl font-bold text-primary">Mi Grupo</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No se pudo cargar el grupo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Mi Grupo</h1>
          {(groupData.user_role === "admin" || groupData.user_role === "moderator") && (
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
          {groupData.cover_url ? (
            <img
              src={groupData.cover_url || "/placeholder.svg"}
              alt="Portada del grupo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent" />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent p-1">
              <img
                src={groupData.avatar_url || "/placeholder.svg?height=128&width=128"}
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
                <span className="text-sm">{groupData.member_count} miembros</span>
              </div>
            </div>

            {groupData.zones && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{groupData.zones}</span>
              </div>
            )}

            {groupData.description && <p className="text-sm text-balance leading-relaxed">{groupData.description}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button className="flex-1 flex items-center gap-2" onClick={() => openUploadDialog("post")}>
              <Camera className="w-4 h-4" />
              Subir publicación
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => openUploadDialog("story")}
            >
              <Clock className="w-4 h-4" />
              Subir historia
            </Button>
          </div>
        </div>

        {/* Featured Stories */}
        {stories.length > 0 && (
          <div className="px-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Historias destacadas</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {stories.map((story) => (
                <div key={story.id} className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <img
                        src={story.image_url || "/placeholder.svg?height=64&width=64"}
                        alt="Historia"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground max-w-[64px] truncate">
                    {new Date(story.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Publicaciones</h3>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hay publicaciones aún</p>
              <Button onClick={() => openUploadDialog("post")}>
                <Camera className="w-4 h-4 mr-2" />
                Crear primera publicación
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div key={post.id} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={post.image_url || "/placeholder.svg?height=200&width=200"}
                    alt={`Publicación ${post.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-white" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Eventos del grupo</h3>
            <Button size="sm" variant="ghost" onClick={() => openUploadDialog("event")}>
              Crear evento
            </Button>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hay eventos creados</p>
              <Button onClick={() => openUploadDialog("event")}>
                <Calendar className="w-4 h-4 mr-2" />
                Crear primer evento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.event_date).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        new Date(event.event_date) > new Date()
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {new Date(event.event_date) > new Date() ? "Próximo" : "Pasado"}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        type={uploadType}
        groupId={currentGroupId}
        onSuccess={loadGroupData}
      />
    </div>
  )
}
