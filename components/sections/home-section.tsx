"use client"

import { useState } from "react"
import { TangleLogo } from "@/components/tangle-logo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, MapPin, ExternalLink, Clock, Users } from "lucide-react"

interface Event {
  id: number
  title: string
  date: string
  time: string
  organizingGroup: string
  description: string
  flyer: string
  type: "open" | "request"
  location?: string
  ticketLink?: string
  isAccepted?: boolean
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Concierto en el Parque",
    date: "2024-03-15",
    time: "19:00",
    organizingGroup: "Los Melómanos",
    description:
      "Una noche increíble de música indie en el parque central. Ven con tu grupo y disfruta de bandas locales.",
    flyer: "/placeholder-41x18.png",
    type: "open",
    location: "Parque Central, Ciudad",
    ticketLink: "https://tickets.example.com",
  },
  {
    id: 2,
    title: "Torneo de Fútbol Amistoso",
    date: "2024-03-20",
    time: "10:00",
    organizingGroup: "Deportistas Unidos",
    description: "Torneo amistoso entre grupos de amigos. Solo equipos pre-aprobados pueden participar.",
    flyer: "/football-tournament-poster.png",
    type: "request",
    isAccepted: false,
  },
  {
    id: 3,
    title: "Noche de Karaoke",
    date: "2024-03-18",
    time: "21:00",
    organizingGroup: "Cantantes Locos",
    description: "¡Ven a cantar con nosotros! Noche de karaoke con premios para los mejores grupos.",
    flyer: "/placeholder-p8kin.png",
    type: "request",
    isAccepted: true,
    location: "Bar El Micrófono, Centro",
    ticketLink: "https://karaoke.example.com",
  },
]

export function HomeSection() {
  const [activeTab, setActiveTab] = useState<"posts" | "events">("posts")
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [eventRequests, setEventRequests] = useState<Record<number, boolean>>({})

  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const handleEventRequest = (eventId: number, action: "request" | "cancel") => {
    setEventRequests((prev) => ({
      ...prev,
      [eventId]: action === "request",
    }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <TangleLogo />
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
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Historias</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[
                  { name: "Aventureros", active: true },
                  { name: "Foodies", active: true },
                  { name: "Gamers", active: false },
                  { name: "Artistas", active: true },
                  { name: "Runners", active: false },
                ].map((story, i) => (
                  <div key={i} className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full p-0.5 ${
                        story.active ? "bg-gradient-to-br from-primary to-accent" : "bg-muted-foreground/30"
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-background p-0.5">
                        <img
                          src={`/placeholder-emj7j.png?height=60&width=60&query=group story ${story.name.toLowerCase()}`}
                          alt={`Historia ${story.name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground max-w-[64px] truncate">{story.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {[
                {
                  id: 1,
                  group: "Los Aventureros",
                  time: "hace 2h",
                  content: "¡Increíble día de senderismo en la montaña! La vista desde la cima valió cada paso. 🏔️",
                  image: "/placeholder-hqq91.png",
                  likes: 24,
                  comments: 8,
                },
                {
                  id: 2,
                  group: "Foodies Unidos",
                  time: "hace 4h",
                  content: "Probamos el nuevo restaurante japonés del centro. ¡Ramen espectacular! 🍜",
                  image: "/placeholder-und2u.png",
                  likes: 31,
                  comments: 12,
                },
                {
                  id: 3,
                  group: "Artistas Creativos",
                  time: "hace 1d",
                  content: "Terminamos nuestro mural colaborativo. Cada uno aportó su estilo único. 🎨",
                  image: "/placeholder-0ahuq.png",
                  likes: 45,
                  comments: 15,
                },
              ].map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                      <img
                        src={`/abstract-geometric-shapes.png?height=40&width=40&query=${post.group.toLowerCase()} avatar`}
                        alt={post.group}
                        className="w-full h-full rounded-full object-cover bg-background"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{post.group}</h4>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={`Post de ${post.group}`}
                    className="w-full aspect-square object-cover"
                  />

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-sm mb-3 text-balance">{post.content}</p>
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
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)} grupos
                        </span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments} comentarios</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  {/* Event Flyer */}
                  <img
                    src={event.flyer || "/placeholder.svg"}
                    alt={`Flyer de ${event.title}`}
                    className="w-full h-48 object-cover"
                  />

                  {/* Event Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 text-balance">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>Organizado por {event.organizingGroup}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 text-balance">{event.description}</p>

                    {/* Event Actions */}
                    <div className="space-y-3">
                      {event.type === "open" ? (
                        <div className="space-y-2">
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-primary" />
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {event.location}
                              </a>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Ver más
                            </Button>
                            {event.ticketLink && (
                              <Button size="sm" className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Entradas
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {event.isAccepted ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Asistencia confirmada
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {event.location}
                                  </a>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  Ver más
                                </Button>
                                {event.ticketLink && (
                                  <Button size="sm" className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Entradas
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
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
