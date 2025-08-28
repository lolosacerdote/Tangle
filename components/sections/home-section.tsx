"use client"

import { useState, useEffect } from "react"
import { TangleLogo } from "@/components/tangle-logo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UploadDialog } from "@/components/upload-dialog"
import { Heart, MessageCircle, MapPin, ExternalLink, Clock, Users, Plus } from "lucide-react"
import { toast } from "sonner"

interface Post {
  id: string
  content: string
  image_url: string | null
  likes_count: number
  comments_count: number
  created_at: string
  groups: {
    id: string
    name: string
    avatar_url: string | null
  }
}

interface Story {
  id: string
  image_url: string
  created_at: string
  expires_at: string
  groups: {
    id: string
    name: string
    avatar_url: string | null
  }
}

interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  location_link: string | null
  ticket_link: string | null
  flyer_url: string | null
  visibility: "open" | "request"
  groups: {
    id: string
    name: string
    avatar_url: string | null
  }
}

interface HomeProps {
  currentGroupId: string
}

export function HomeSection({ currentGroupId }: HomeProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "events">("posts")
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [eventRequests, setEventRequests] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"post" | "story" | "event">("post")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load posts
      const postsResponse = await fetch("/api/posts")
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData)
      }

      // Load stories
      const storiesResponse = await fetch("/api/stories")
      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json()
        setStories(storiesData)
      }

      // Load events
      const eventsResponse = await fetch("/api/events?visibility=open")
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar el contenido")
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (postId: string) => {
    // TODO: Implement like API call
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const handleEventRequest = async (eventId: string, action: "request" | "cancel") => {
    // TODO: Implement event request API call
    setEventRequests((prev) => ({
      ...prev,
      [eventId]: action === "request",
    }))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "hace unos minutos"
    if (diffInHours < 24) return `hace ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    return `hace ${diffInDays}d`
  }

  const openUploadDialog = (type: "post" | "story" | "event") => {
    setUploadType(type)
    setUploadDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <TangleLogo />
          <Button
            size="sm"
            onClick={() => openUploadDialog(activeTab === "posts" ? "post" : "event")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "posts" ? "Post" : "Evento"}
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-background sticky top-[60px] z-30 px-4 pt-2">
        <div className="flex w-full relative">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "posts" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Publicaciones
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "events" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Eventos
            {activeTab === "events" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "posts" ? (
          <div className="p-4">
            {/* Stories */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Historias</h3>
                <Button size="sm" variant="ghost" onClick={() => openUploadDialog("story")} className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Historia
                </Button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {stories.map((story) => (
                  <div key={story.id} className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-primary to-accent">
                      <div className="w-full h-full rounded-full bg-background p-0.5">
                        <img
                          src={story.groups.avatar_url || "/placeholder.svg?height=60&width=60"}
                          alt={`Historia ${story.groups.name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground max-w-[64px] truncate">
                      {story.groups.name}
                    </p>
                  </div>
                ))}
                {stories.length === 0 && !loading && (
                  <div className="flex-shrink-0 text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">Sin historias</p>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando publicaciones...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No hay publicaciones aún</p>
                  <Button onClick={() => openUploadDialog("post")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear primera publicación
                  </Button>
                </div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                        <img
                          src={post.groups.avatar_url || "/placeholder.svg?height=40&width=40"}
                          alt={post.groups.name}
                          className="w-full h-full rounded-full object-cover bg-background"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{post.groups.name}</h4>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(post.created_at)}</p>
                      </div>
                    </div>

                    {/* Post Image */}
                    {post.image_url && (
                      <img
                        src={post.image_url || "/placeholder.svg"}
                        alt={`Post de ${post.groups.name}`}
                        className="w-full aspect-square object-cover"
                      />
                    )}

                    {/* Post Content */}
                    <div className="p-4">
                      {post.content && <p className="text-sm mb-3 text-balance">{post.content}</p>}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-2 text-sm transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedPosts.has(post.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground hover:text-red-500"
                            }`}
                          />
                          <span
                            className={likedPosts.has(post.id) ? "text-red-500 font-medium" : "text-muted-foreground"}
                          >
                            {post.likes_count + (likedPosts.has(post.id) ? 1 : 0)} grupos
                          </span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments_count} comentarios</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando eventos...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No hay eventos disponibles</p>
                  <Button onClick={() => openUploadDialog("event")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear primer evento
                  </Button>
                </div>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    {/* Event Flyer */}
                    {event.flyer_url && (
                      <img
                        src={event.flyer_url || "/placeholder.svg"}
                        alt={`Flyer de ${event.title}`}
                        className="w-full h-48 object-cover"
                      />
                    )}

                    {/* Event Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 text-balance">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Organizado por {event.groups.name}</span>
                          </div>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-4 text-balance">{event.description}</p>
                      )}

                      {/* Event Actions */}
                      <div className="space-y-3">
                        {event.visibility === "open" ? (
                          <div className="space-y-2">
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                {event.location_link ? (
                                  <a
                                    href={event.location_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {event.location}
                                  </a>
                                ) : (
                                  <span>{event.location}</span>
                                )}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                Ver más
                              </Button>
                              {event.ticket_link && (
                                <Button size="sm" asChild>
                                  <a
                                    href={event.ticket_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Entradas
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {eventRequests[event.id] ? (
                              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                                Solicitud enviada - Esperando confirmación
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                                <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                                Solicita asistencia para ver ubicación y detalles
                              </div>
                            )}
                            <div className="flex gap-2">
                              {eventRequests[event.id] ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-transparent"
                                  onClick={() => handleEventRequest(event.id, "cancel")}
                                >
                                  Cancelar solicitud
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleEventRequest(event.id, "request")}
                                >
                                  Asistir
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                Ver más
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        type={uploadType}
        groupId={currentGroupId}
        onSuccess={loadData}
      />
    </div>
  )
}
